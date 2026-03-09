import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { createHunt, login } from '../../lib/api';
import { VendorSidebar } from '../../components/VendorSidebar';
import { WalletButton } from '../../components/WalletButton';

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

    return (
        <div className="vendor-layout">
            <div className="vendor-header">
                <div className="logo logo-sm">Tr!vvo</div>
                <WalletButton />
            </div>
            <VendorSidebar />

            <div className="page" style={{ paddingBottom: '40px' }}>
                <div className="page-header">
                    <button className="back-btn" onClick={() => navigate('/vendor/dashboard')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <h2>Create New Hunt</h2>
                </div>

                <div className="flex flex-col gap-4 animate-fade-in">
                    {/* Basic info */}
                    <div className="card-glass">
                        <h3 className="mb-3">📝 Basic Info</h3>
                        <div className="flex flex-col gap-3">
                            <div className="input-group">
                                <label>Hunt Name</label>
                                <input className="input" placeholder="Coffee Discovery Trail" value={form.title} onChange={(e) => updateField('title', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Description</label>
                                <textarea className="input" placeholder="Describe the hunt experience..." value={form.description} onChange={(e) => updateField('description', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="card-glass">
                        <h3 className="mb-3">📍 Location</h3>
                        <div className="flex flex-col gap-3">
                            <div className="input-group">
                                <label>Location Name</label>
                                <input className="input" placeholder="Downtown Store" value={form.locationName} onChange={(e) => updateField('locationName', e.target.value)} />
                            </div>
                            <div className="flex gap-2">
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>Latitude</label>
                                    <input className="input" placeholder="40.7128" value={form.locationLat} onChange={(e) => updateField('locationLat', e.target.value)} />
                                </div>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>Longitude</label>
                                    <input className="input" placeholder="-74.006" value={form.locationLng} onChange={(e) => updateField('locationLng', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="card-glass">
                        <h3 className="mb-3">📅 Schedule</h3>
                        <div className="flex gap-2">
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>Start Time</label>
                                <input type="datetime-local" className="input" value={form.startTime} onChange={(e) => updateField('startTime', e.target.value)} />
                            </div>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>End Time</label>
                                <input type="datetime-local" className="input" value={form.endTime} onChange={(e) => updateField('endTime', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Rewards */}
                    <div className="card-glass">
                        <h3 className="mb-3">💰 Rewards (USDC)</h3>
                        <div className="flex gap-2">
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>Arrival Reward</label>
                                <input className="input" type="number" step="0.1" value={form.arrivalReward} onChange={(e) => updateField('arrivalReward', e.target.value)} />
                            </div>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>Main Reward</label>
                                <input className="input" type="number" step="0.1" value={form.mainReward} onChange={(e) => updateField('mainReward', e.target.value)} />
                            </div>
                        </div>
                        <div className="card mt-2" style={{ padding: '12px', textAlign: 'center' }}>
                            <small>Total per participant: <strong style={{ color: 'var(--success)' }}>{(parseFloat(form.arrivalReward || '0') + parseFloat(form.mainReward || '0')).toFixed(1)} USDC</strong></small>
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="card-glass">
                        <div className="flex justify-between items-center mb-3">
                            <h3>🎯 Tasks</h3>
                            <button onClick={addTask} className="btn btn-secondary btn-sm">+ Add</button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {form.tasks.map((task, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', width: '20px' }}>{i + 1}</span>
                                    <input className="input" style={{ flex: 1 }} placeholder="Task description..." value={task} onChange={(e) => updateTask(i, e.target.value)} />
                                    {form.tasks.length > 1 && (
                                        <button onClick={() => removeTask(i)} className="btn btn-danger btn-sm" style={{ padding: '8px' }}>✕</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <button onClick={handleSubmit} className="btn btn-primary btn-lg btn-full" disabled={loading || !form.title}>
                        {loading ? 'Creating...' : '🚀 Create Hunt'}
                    </button>
                </div>
            </div>
        </div>
    );
}
