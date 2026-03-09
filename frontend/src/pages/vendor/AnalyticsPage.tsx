import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VendorSidebar } from '../../components/VendorSidebar';
import { WalletButton } from '../../components/WalletButton';
import { getHunts } from '../../lib/api';

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

    // Some mock completion rate calculation for visual sake
    const completionRate = totalParticipants > 0 ? Math.round((totalDistributed / (totalParticipants * 5)) * 100) : 0;

    const stats = [
        { label: 'Total Views', value: totalViews, change: '+0%', positive: true },
        { label: 'QR Scans', value: totalScans, change: '+0%', positive: true },
        { label: 'Participants', value: totalParticipants, change: '+0%', positive: true },
        { label: 'USDC Distributed', value: totalDistributed.toFixed(2), change: '+0%', positive: true },
    ];

    return (
        <div className="vendor-layout">
            <div className="vendor-header">
                <div className="logo logo-sm">Tr!vvo</div>
                <WalletButton />
            </div>
            <VendorSidebar />

            <div className="page" style={{ paddingBottom: '40px' }}>
                <h2 className="mb-4">Analytics</h2>

                {loading ? (
                    <div className="card skeleton" style={{ height: '200px' }} />
                ) : (
                    <>
                        {/* Stats grid */}
                        <div className="stat-grid mb-4 animate-fade-in">
                            {stats.map((stat, i) => (
                                <div key={i} className="stat-card">
                                    <div className="stat-value">{stat.value}</div>
                                    <div className="stat-label">{stat.label}</div>
                                    <div style={{
                                        fontSize: '0.7rem', fontWeight: 600, marginTop: '4px',
                                        color: stat.positive ? 'var(--success)' : 'var(--error)',
                                    }}>
                                        {stat.change}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chart placeholder (keeps UI looking premium) */}
                        <div className="card-glass mb-4 animate-slide-up">
                            <h3 className="mb-3">📈 Activity Trend</h3>
                            <div style={{
                                height: '150px', borderRadius: 'var(--radius-md)',
                                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(6, 182, 212, 0.05))',
                                display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
                                padding: '10px',
                            }}>
                                {[35, 50, 40, 65, 55, 80, 70, 90, 75, 85, 95, 88].map((h, i) => (
                                    <div key={i} style={{
                                        width: '6%', height: `${h}%`,
                                        background: 'var(--gradient-primary)',
                                        borderRadius: '4px 4px 0 0',
                                        opacity: 0.7 + (i * 0.025),
                                        transition: 'height 0.5s ease',
                                    }} />
                                ))}
                            </div>
                            <div className="flex justify-between mt-2">
                                <small>Jan</small>
                                <small>Mar</small>
                                <small>Jun</small>
                                <small>Sep</small>
                                <small>Dec</small>
                            </div>
                        </div>

                        {/* Hunt performance */}
                        <h3 className="mb-3">Hunt Performance</h3>
                        {hunts.length === 0 ? (
                            <div className="card text-center" style={{ padding: '20px', color: 'var(--text-muted)' }}>
                                No hunts to analyze yet.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 stagger">
                                {hunts.map((hunt) => (
                                    <div key={hunt.hunt_id} className="card" style={{ padding: '14px 16px', cursor: 'pointer' }}
                                        onClick={() => navigate(`/vendor/hunt-manage/${hunt.hunt_id}`)}>
                                        <h3 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>{hunt.title}</h3>
                                        <div className="flex justify-between">
                                            <div>
                                                <small>👁️ {hunt.views}</small>
                                            </div>
                                            <div>
                                                <small>📱 {hunt.qr_scans}</small>
                                            </div>
                                            <div>
                                                <small>👥 {hunt.active_participants}</small>
                                            </div>
                                            <div>
                                                <small style={{ color: 'var(--success)' }}>💰 {Number(hunt.rewards_distributed).toFixed(2)} USDC</small>
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
