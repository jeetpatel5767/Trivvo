import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { WalletButton } from '../../components/WalletButton';
import { login, getHunts } from '../../lib/api';
import LogoT from '../../assets/LogoT.png';
import huntBuilding from '../../assets/hunt_building.png';
import huntMap from '../../assets/hunt_map.png';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { isConnected, address } = useAccount();
    const [hunts, setHunts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLogout, setShowLogout] = useState(false);
    const { disconnect } = useDisconnect();

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
            <div style={{
                backgroundColor: 'var(--nb-bg)',
                color: 'var(--nb-text)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px 24px',
                textAlign: 'center',
                fontFamily: "'Inter', sans-serif"
            }}>
                <img src={LogoT} alt="Logo" style={{ width: '80px', marginBottom: '24px' }} />
                <h1 style={{ fontSize: '32px', fontWeight: 900, fontStyle: 'italic', marginBottom: '8px' }}>TR!VVO</h1>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#6B7280', marginBottom: '32px' }}>VENDOR DASHBOARD</p>
                <div style={{
                    backgroundColor: '#FFFFFF',
                    border: 'var(--nb-border)',
                    boxShadow: 'var(--nb-shadow)',
                    borderRadius: 'var(--nb-radius)',
                    padding: '24px',
                    width: '100%',
                    maxWidth: '400px',
                    marginBottom: '32px'
                }}>
                    <p style={{ fontWeight: 600, marginBottom: '24px' }}>Connect your wallet to manage hunts and distribute rewards.</p>
                    <WalletButton />
                </div>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #000',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        fontWeight: 800,
                        cursor: 'pointer'
                    }}
                >
                    ← BACK TO CUSTOMER APP
                </button>
            </div>
        );
    }

    const totalParticipants = hunts.reduce((sum, h) => sum + (h.participant_count || 0), 0);
    const activeOrUpcomingHunts = hunts.filter(h => h.status === 'active' || h.status === 'upcoming');
    const totalRewardsSent = hunts.reduce((sum, h) => {
        const rewardPerPerson = Number(h.arrival_reward || 0) + Number(h.main_reward || 0);
        return sum + (rewardPerPerson * (h.participant_count || 0));
    }, 0);

    return (
        <div style={{
            backgroundColor: 'var(--nb-bg)',
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif",
            color: 'var(--nb-text)',
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
                    <div style={{ position: 'relative' }}>
                        <div
                            onClick={() => setShowLogout(!showLogout)}
                            style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#E5E7EB',
                                border: '2px solid #000',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '20px',
                                overflow: 'hidden',
                                cursor: 'pointer'
                            }}
                        >
                            👤
                        </div>

                        {showLogout && (
                            <div style={{
                                position: 'absolute',
                                top: '50px',
                                right: '0',
                                backgroundColor: '#FFFFFF',
                                border: '2px solid #000',
                                boxShadow: '4px 4px 0px #000',
                                borderRadius: '12px',
                                padding: '8px',
                                zIndex: 1000,
                                minWidth: '120px'
                            }}>
                                <button
                                    onClick={() => {
                                        disconnect();
                                        navigate('/login');
                                    }}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '12px',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        fontSize: '14px',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <span>🚪</span> LOGOUT
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ padding: '24px' }}>
                {/* Greeting Section */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: 900,
                        fontStyle: 'italic',
                        textTransform: 'uppercase',
                        margin: 0,
                        lineHeight: '1'
                    }}>
                        YO, ADMIN! 👋
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#6B7280',
                        marginTop: '8px'
                    }}>
                        Ready to hide some treasures today?
                    </p>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                    <button
                        onClick={() => navigate('/vendor/create-hunt')}
                        style={{
                            flex: 1,
                            backgroundColor: 'var(--nb-yellow)',
                            border: 'var(--nb-border)',
                            boxShadow: 'var(--nb-shadow)',
                            borderRadius: 'var(--nb-radius-lg)',
                            padding: '16px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            cursor: 'pointer'
                        }}
                    >
                        <span style={{ fontSize: '18px' }}>⊕</span> NEW HUNT
                    </button>
                    <button
                        onClick={() => navigate('/vendor/analytics')}
                        style={{
                            flex: 1,
                            backgroundColor: '#FFFFFF',
                            border: 'var(--nb-border)',
                            boxShadow: 'var(--nb-shadow)',
                            borderRadius: 'var(--nb-radius-lg)',
                            padding: '16px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            cursor: 'pointer'
                        }}
                    >
                        <span>📊</span> ANALYTICS
                    </button>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '32px'
                }}>
                    {/* Total Hunts Card */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        border: 'var(--nb-border)',
                        boxShadow: 'var(--nb-shadow)',
                        borderRadius: 'var(--nb-radius)',
                        padding: '16px',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '120px'
                    }}>
                        <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#6B7280', margin: '0 0 4px 0' }}>Total Hunts</p>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>{hunts.length}</h2>
                        <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--nb-mint)', marginTop: '4px' }}>↗ +5%</p>
                        <div style={{ position: 'absolute', right: '-5px', top: '5px', fontSize: '32px', opacity: 0.1, transform: 'rotate(-10deg)' }}>🗺️</div>
                    </div>

                    {/* Active Hunts Card */}
                    <div style={{
                        backgroundColor: '#FEFCE8',
                        border: 'var(--nb-border)',
                        boxShadow: 'var(--nb-shadow)',
                        borderRadius: 'var(--nb-radius)',
                        padding: '16px',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '120px'
                    }}>
                        <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#6B7280', margin: '0 0 4px 0' }}>Active Hunts</p>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>{activeOrUpcomingHunts.length}</h2>
                        <p style={{ fontSize: '10px', fontWeight: 800, color: '#000', marginTop: '4px' }}>● Live</p>
                        <div style={{ position: 'absolute', right: '-5px', top: '5px', fontSize: '32px', opacity: 0.1, transform: 'rotate(-10deg)' }}>⚡</div>
                    </div>

                    {/* Participants Card */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        border: 'var(--nb-border)',
                        boxShadow: 'var(--nb-shadow)',
                        borderRadius: 'var(--nb-radius)',
                        padding: '16px',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '120px'
                    }}>
                        <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#6B7280', margin: '0 0 4px 0' }}>Participants</p>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>{totalParticipants >= 1000 ? (totalParticipants / 1000).toFixed(1) + 'k' : totalParticipants}</h2>
                        <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--nb-mint)', marginTop: '4px' }}>↗ +15%</p>
                        <div style={{ position: 'absolute', right: '-5px', top: '5px', fontSize: '32px', opacity: 0.1, transform: 'rotate(-10deg)' }}>👥</div>
                    </div>

                    {/* Rewards Sent Card */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        border: 'var(--nb-border)',
                        boxShadow: 'var(--nb-shadow)',
                        borderRadius: 'var(--nb-radius)',
                        padding: '16px',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '120px'
                    }}>
                        <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#6B7280', margin: '0 0 4px 0' }}>Rewards Sent</p>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>${totalRewardsSent >= 1000 ? (totalRewardsSent / 1000).toFixed(1) + 'k' : totalRewardsSent}</h2>
                        <p style={{ fontSize: '10px', fontWeight: 800, color: '#6B7280', marginTop: '4px' }}>💰 USDC</p>
                        <div style={{ position: 'absolute', right: '-5px', top: '5px', fontSize: '32px', opacity: 0.1, transform: 'rotate(-10deg)' }}>💵</div>
                    </div>
                </div>

                {/* Recent Hunts List */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', margin: 0 }}>RECENT HUNTS</h3>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#6B7280', cursor: 'pointer' }}>View All</span>
                </div>

                {loading ? (
                    <div style={{ height: '100px', backgroundColor: '#E5E7EB', borderRadius: 'var(--nb-radius)', border: 'var(--nb-border)', opacity: 0.5 }} />
                ) : hunts.length === 0 ? (
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        border: 'var(--nb-border)',
                        boxShadow: 'var(--nb-shadow)',
                        borderRadius: 'var(--nb-radius)',
                        padding: '32px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏹</div>
                        <p style={{ fontWeight: 700, margin: 0 }}>No hunts yet. Time to create one!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {hunts.map((hunt) => (
                            <div
                                key={hunt.hunt_id}
                                onClick={() => navigate(`/vendor/hunt-manage/${hunt.hunt_id}`)}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    border: 'var(--nb-border)',
                                    boxShadow: '4px 4px 0px #000',
                                    borderRadius: '20px',
                                    padding: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    backgroundColor: '#000',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid #000'
                                }}>
                                    <img src={hunt.title.includes('Coffee') ? huntBuilding : huntMap} alt="Hunt" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>{hunt.title}</h4>
                                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', margin: '4px 0 0 0' }}>
                                        {hunt.location_name || 'Downtown'} • 24 Active
                                    </p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                    <span style={{
                                        backgroundColor: hunt.status === 'active' ? 'var(--nb-mint)' : '#E5E7EB',
                                        border: '1px solid #000',
                                        borderRadius: '6px',
                                        padding: '2px 8px',
                                        fontSize: '10px',
                                        fontWeight: 900
                                    }}>
                                        {hunt.status === 'active' ? 'LIVE' : 'ENDED'}
                                    </span>
                                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280' }}>ID: #TRV-{(hunt.hunt_id || '').slice(-3)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sidebar/Nav placeholder if needed, normally it should be part of layout */}
            {/* But since we use mobile-first full screen here, BottomNav might be better if applicable */}
            {/* For now I'll just leave it as is, or add a simple bottom spacer */}
            <div style={{ height: '20px' }} />
        </div>
    );
}
