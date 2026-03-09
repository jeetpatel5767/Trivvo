import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHunts } from '../../lib/api';
import LogoT from '../../assets/LogoT.png';

export default function AnalyticsPage() {
    const navigate = useNavigate();
    const [hunts, setHunts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getHunts()
            .then(res => setHunts(res.data.hunts || []))
            .catch(() => setHunts([]))
            .finally(() => setLoading(false));
    }, []);

    // Aggregate stats
    const totalViews = hunts.reduce((sum, h) => sum + (Number(h.views) || 0), 0);
    const totalScans = hunts.reduce((sum, h) => sum + (Number(h.qr_scans) || 0), 0);
    const totalParticipants = hunts.reduce((sum, h) => sum + (Number(h.active_participants) || 0), 0);
    const totalDistributed = hunts.reduce((sum, h) => sum + (Number(h.rewards_distributed) || 0), 0);

    const stats = [
        { label: 'Total Views', value: totalViews, change: '+12%', color: 'var(--nb-yellow)' },
        { label: 'QR Scans', value: totalScans, change: '+5%', color: 'var(--nb-mint)' },
        { label: 'Participants', value: totalParticipants, change: '+8%', color: 'var(--nb-pink)' },
        { label: 'Distributed', value: `$${totalDistributed.toFixed(1)}`, change: '+15%', color: 'var(--nb-yellow)' },
    ];

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
                    }}>ANALYTICS 📊</h1>
                </div>

                {loading ? (
                    <div style={{ ...cardStyle, height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ padding: '40px', textAlign: 'center' }}>
                            <div style={{ width: '40px', height: '40px', border: '4px solid #000', borderTopColor: 'var(--nb-yellow)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                            {stats.map((stat, i) => (
                                <div key={i} style={{
                                    backgroundColor: stat.color,
                                    border: 'var(--nb-border)',
                                    boxShadow: '4px 4px 0px #000',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>{stat.label}</p>
                                    <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '4px 0 2px 0' }}>{stat.value}</h2>
                                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#000', opacity: 0.6 }}>{stat.change} vs last month</span>
                                </div>
                            ))}
                        </div>

                        {/* Chart Area */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>📈</span> ACTIVITY TREND
                            </h3>
                            <div style={{
                                height: '180px',
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'space-between',
                                gap: '8px',
                                padding: '10px 0'
                            }}>
                                {[35, 50, 40, 65, 55, 80, 70, 90, 75, 85, 95, 88].map((h, i) => (
                                    <div key={i} style={{
                                        flex: 1,
                                        height: `${h}%`,
                                        backgroundColor: i % 2 === 0 ? 'var(--nb-yellow)' : 'var(--nb-mint)',
                                        border: '2px solid #000',
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        boxShadow: '2px 0px 0px #000'
                                    }} />
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', borderTop: '2px solid #000', paddingTop: '8px' }}>
                                {['JAN', 'MAR', 'JUN', 'SEP', 'DEC'].map(m => (
                                    <span key={m} style={{ fontSize: '10px', fontWeight: 900 }}>{m}</span>
                                ))}
                            </div>
                        </div>

                        {/* Hunt Performance List */}
                        <h3 style={{ fontSize: '20px', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', marginBottom: '20px' }}>HUNT PERFORMANCE</h3>

                        {hunts.length === 0 ? (
                            <div style={{ ...cardStyle, textAlign: 'center', backgroundColor: '#F3F4F6' }}>
                                <p style={{ fontWeight: 800, color: '#6B7280', margin: 0 }}>No hunts to analyze yet.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {hunts.map((hunt) => (
                                    <div
                                        key={hunt.hunt_id}
                                        onClick={() => navigate(`/vendor/hunt-manage/${hunt.hunt_id}`)}
                                        style={{
                                            ...cardStyle,
                                            padding: '20px',
                                            cursor: 'pointer',
                                            transition: 'transform 0.1s ease',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-2px, -2px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                                    >
                                        <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px' }}>{hunt.title}</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                                            <div style={{ textAlign: 'center', backgroundColor: '#F3F4F6', padding: '8px', borderRadius: '8px', border: '1px solid #000' }}>
                                                <div style={{ fontSize: '14px', fontWeight: 900 }}>{hunt.views}</div>
                                                <div style={{ fontSize: '8px', fontWeight: 900 }}>VIEWS</div>
                                            </div>
                                            <div style={{ textAlign: 'center', backgroundColor: '#F3F4F6', padding: '8px', borderRadius: '8px', border: '1px solid #000' }}>
                                                <div style={{ fontSize: '14px', fontWeight: 900 }}>{hunt.qr_scans}</div>
                                                <div style={{ fontSize: '8px', fontWeight: 900 }}>SCANS</div>
                                            </div>
                                            <div style={{ textAlign: 'center', backgroundColor: '#F3F4F6', padding: '8px', borderRadius: '8px', border: '1px solid #000' }}>
                                                <div style={{ fontSize: '14px', fontWeight: 900 }}>{hunt.active_participants}</div>
                                                <div style={{ fontSize: '8px', fontWeight: 900 }}>PARTS</div>
                                            </div>
                                            <div style={{ textAlign: 'center', backgroundColor: 'var(--nb-yellow)', padding: '8px', borderRadius: '8px', border: '1px solid #000' }}>
                                                <div style={{ fontSize: '12px', fontWeight: 900 }}>${Number(hunt.rewards_distributed).toFixed(1)}</div>
                                                <div style={{ fontSize: '8px', fontWeight: 900 }}>USDC</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
