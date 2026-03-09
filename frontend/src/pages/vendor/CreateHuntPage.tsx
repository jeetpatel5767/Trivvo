import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { createHunt, login } from '../../lib/api';
import LogoT from '../../assets/LogoT.png';

export default function CreateHuntPage() {
    const navigate = useNavigate();
    const { address } = useAccount();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', locationName: '',
        locationLat: '', locationLng: '',
        startTime: '', endTime: '',
        arrivalReward: '0.5', mainReward: '5',
        tasks: [''],
    });

    const updateField = (field: string, value: string) => setForm({ ...form, [field]: value });

    const addTask = () => setForm({ ...form, tasks: [...form.tasks, ''] });
    const updateTask = (i: number, value: string) => {
        const tasks = [...form.tasks];
        tasks[i] = value;
        setForm({ ...form, tasks });
    };
    const removeTask = (i: number) => {
        const tasks = form.tasks.filter((_, idx) => idx !== i);
        setForm({ ...form, tasks });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Ensure vendor is registered in the database first
            await login(address!, 'vendor', 'My Business');

            const res = await createHunt({
                vendorWallet: address,
                title: form.title,
                description: form.description,
                locationLat: parseFloat(form.locationLat) || 40.7128,
                locationLng: parseFloat(form.locationLng) || -74.006,
                locationName: form.locationName,
                startTime: form.startTime ? new Date(form.startTime).toISOString() : new Date().toISOString(),
                endTime: form.endTime ? new Date(form.endTime).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                arrivalReward: parseFloat(form.arrivalReward),
                mainReward: parseFloat(form.mainReward),
                tasks: form.tasks.filter(Boolean),
            });
            navigate(`/vendor/qr/${res.data.hunt.hunt_id}`);
        } catch (err: any) {
            const msg = err?.response?.data?.error || 'Failed to create hunt. Make sure backend is running.';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '12px',
        fontWeight: 900,
        textTransform: 'uppercase',
        marginBottom: '8px',
        display: 'block',
        color: '#000'
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        backgroundColor: '#FFFFFF',
        border: '3px solid #000',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 700,
        outline: 'none',
        boxShadow: '4px 4px 0px #000'
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#FFFFFF',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
        borderRadius: 'var(--nb-radius-lg)',
        padding: '24px',
        marginBottom: '24px'
    };

    return (
        <div style={{
            backgroundColor: 'var(--nb-bg)',
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif",
            color: '#000000',
            paddingBottom: '40px'
        }}>
            {/* Top Navigation Bar */}
            <div style={{
                backgroundColor: '#FFFFFF',
                borderBottom: 'var(--nb-border)',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'var(--nb-yellow)',
                        border: '2px solid #000',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '4px'
                    }}>
                        <img src={LogoT} alt="T" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase' }}>TR!VVO</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '20px', cursor: 'pointer' }}>🔔</span>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#E5E7EB',
                        border: '2px solid #000',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '20px'
                    }}>👤</div>
                </div>
            </div>

            <div style={{ padding: '24px' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <button
                        onClick={() => navigate('/vendor/dashboard')}
                        style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#FFFFFF',
                            border: 'var(--nb-border)',
                            boxShadow: '4px 4px 0px #000',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '20px',
                            cursor: 'pointer'
                        }}
                    >←</button>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 900,
                        fontStyle: 'italic',
                        textTransform: 'uppercase',
                        margin: 0,
                        lineHeight: '1'
                    }}>NEW HUNT! 🏹</h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>

                    {/* Basic Info Section */}
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📝</span> BASIC INFO
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>HUNT NAME</label>
                                <input style={inputStyle} placeholder="e.g. Secret Coffee Trail" value={form.title} onChange={(e) => updateField('title', e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>DESCRIPTION</label>
                                <textarea
                                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                    placeholder="Tell hunters what to expect..."
                                    value={form.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📍</span> LOCATION
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>LOCATION NAME</label>
                                <input style={inputStyle} placeholder="e.g. Downtown Central" value={form.locationName} onChange={(e) => updateField('locationName', e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>LATITUDE</label>
                                    <input style={inputStyle} placeholder="40.7128" value={form.locationLat} onChange={(e) => updateField('locationLat', e.target.value)} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>LONGITUDE</label>
                                    <input style={inputStyle} placeholder="-74.006" value={form.locationLng} onChange={(e) => updateField('locationLng', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Section */}
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📅</span> SCHEDULE
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>START TIME</label>
                                <input type="datetime-local" style={inputStyle} value={form.startTime} onChange={(e) => updateField('startTime', e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>END TIME</label>
                                <input type="datetime-local" style={inputStyle} value={form.endTime} onChange={(e) => updateField('endTime', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Rewards Section */}
                    <div style={{ ...cardStyle, backgroundColor: 'var(--nb-pink)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>💰</span> REWARDS (USDC)
                        </h3>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>ARRIVAL</label>
                                <input type="number" step="0.1" style={inputStyle} value={form.arrivalReward} onChange={(e) => updateField('arrivalReward', e.target.value)} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>MAIN</label>
                                <input type="number" step="0.1" style={inputStyle} value={form.mainReward} onChange={(e) => updateField('mainReward', e.target.value)} />
                            </div>
                        </div>
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            border: '2px solid #000',
                            borderRadius: '12px',
                            padding: '12px',
                            textAlign: 'center'
                        }}>
                            <span style={{ fontSize: '14px', fontWeight: 900 }}>
                                TOTAL: {(parseFloat(form.arrivalReward || '0') + parseFloat(form.mainReward || '0')).toFixed(1)} USDC PER HUNTER
                            </span>
                        </div>
                    </div>

                    {/* Tasks Section */}
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                <span>🎯</span> TASKS
                            </h3>
                            <button
                                onClick={addTask}
                                style={{
                                    backgroundColor: 'var(--nb-mint)',
                                    border: '2px solid #000',
                                    borderRadius: '8px',
                                    padding: '4px 12px',
                                    fontSize: '12px',
                                    fontWeight: 900,
                                    cursor: 'pointer',
                                    boxShadow: '2px 2px 0px #000'
                                }}
                            >+ ADD TASK</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {form.tasks.map((task, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: '#000',
                                        color: '#FFF',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '12px',
                                        fontWeight: 900
                                    }}>{i + 1}</div>
                                    <input
                                        style={{ ...inputStyle, padding: '8px 12px' }}
                                        placeholder="Task description..."
                                        value={task}
                                        onChange={(e) => updateTask(i, e.target.value)}
                                    />
                                    {form.tasks.length > 1 && (
                                        <button
                                            onClick={() => removeTask(i)}
                                            style={{
                                                backgroundColor: '#FCA5A5',
                                                border: '2px solid #000',
                                                borderRadius: '8px',
                                                padding: '8px',
                                                cursor: 'pointer',
                                                fontWeight: 900
                                            }}
                                        >✕</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !form.title}
                        style={{
                            width: '100%',
                            backgroundColor: 'var(--nb-yellow)',
                            border: 'var(--nb-border)',
                            boxShadow: 'var(--nb-shadow)',
                            borderRadius: 'var(--nb-radius-lg)',
                            padding: '24px',
                            fontSize: '22px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            cursor: loading || !form.title ? 'not-allowed' : 'pointer',
                            opacity: loading || !form.title ? 0.7 : 1,
                            marginTop: '20px'
                        }}
                    >
                        {loading ? 'CREATING...' : '🚀 DEPLOY HUNT'}
                    </button>
                </div>
            </div>
        </div>
    );
}
