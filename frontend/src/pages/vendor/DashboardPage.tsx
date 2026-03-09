import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { WalletButton } from '../../components/WalletButton';
import { VendorSidebar } from '../../components/VendorSidebar';
import { login, getHunts } from '../../lib/api';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { isConnected, address } = useAccount();
    const [hunts, setHunts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isConnected && address) {
            // Register as vendor
            login(address, 'vendor', 'My Business').catch(() => { });
            // Fetch hunts
            getHunts()
                .then(res => setHunts(res.data.hunts || []))
                .catch(() => setHunts([]))
                .finally(() => setLoading(false));
        }
    }, [isConnected, address]);

    if (!isConnected) {
        return (
            <div className="page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '40px 24px' }}>
                <div style={{
                    fontSize: '2.5rem', fontWeight: 900,
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', marginBottom: '8px',
                }}>
                    Tr!vvo
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Vendor Dashboard</p>
                <p style={{ marginBottom: '32px', textAlign: 'center' }}>Connect your wallet to manage hunts and distribute rewards.</p>
                <WalletButton />
                <button onClick={() => navigate('/login')} className="btn btn-secondary btn-sm mt-6">
                    ← Back to Customer App
                </button>
            </div>
        );
    }

    const activeOrUpcomingHunts = hunts.filter(h => h.status === 'active' || h.status === 'upcoming');
    const totalParticipants = hunts.reduce((sum, h) => sum + (h.participant_count || 0), 0);

    return (
        <div className="vendor-layout">
            <div className="vendor-header">
                <div className="logo logo-sm">Tr!vvo</div>
                <WalletButton />
            </div>
            <VendorSidebar />

            <div className="page" style={{ paddingBottom: '20px' }}>
                <h2 className="mb-4">Dashboard Overview</h2>

                {/* Stats */}
                <div className="stat-grid mb-4 animate-fade-in">
                    <div className="stat-card">
                        <div className="stat-value">{activeOrUpcomingHunts.length}</div>
                        <div className="stat-label">Live & Upcoming</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{totalParticipants}</div>
                        <div className="stat-label">Participants</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{hunts.length}</div>
                        <div className="stat-label">Total Hunts</div>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 mb-4 animate-slide-up">
                    <button onClick={() => navigate('/vendor/create-hunt')} className="btn btn-primary" style={{ flex: 1 }}>
                        + New Hunt
                    </button>
                    <button onClick={() => navigate('/vendor/analytics')} className="btn btn-secondary" style={{ flex: 1 }}>
                        📊 Analytics
                    </button>
                </div>

                {/* Hunts list */}
                <h3 className="mb-3">{hunts.length > 0 ? 'Your Hunts' : 'No hunts yet'}</h3>
                {loading ? (
                    <div className="card skeleton" style={{ height: '100px' }} />
                ) : hunts.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏹</div>
                        <p>Create your first hunt to get started!</p>
                        <button onClick={() => navigate('/vendor/create-hunt')} className="btn btn-primary mt-3">
                            + Create Hunt
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 stagger">
                        {hunts.map((hunt) => (
                            <div key={hunt.hunt_id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/vendor/hunt-manage/${hunt.hunt_id}`)}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{hunt.title}</h3>
                                        <div className="flex gap-2">
                                            <small>💰 {Number(hunt.arrival_reward) + Number(hunt.main_reward)} USDC/user</small>
                                        </div>
                                    </div>
                                    <span className={`badge ${hunt.status === 'active' ? 'badge-active' : 'badge-ended'}`}>
                                        {hunt.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
