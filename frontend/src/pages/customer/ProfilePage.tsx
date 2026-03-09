import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { BottomNav } from '../../components/BottomNav';
import { getProfile } from '../../lib/api';
import { CONTRACTS, ERC20_ABI } from '../../lib/contracts';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    const [stats, setStats] = useState({
        huntsCompleted: 0,
        totalEarned: '0.00',
        currentStreak: 0,
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Read actual USDC balance from the blockchain
    const { data: usdcBalance } = useReadContract({
        address: CONTRACTS.USDC_TOKEN as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
    });

    const displayBalance = usdcBalance ? parseFloat(formatUnits(usdcBalance as bigint, 6)).toFixed(2) : '0.00';

    useEffect(() => {
        if (isConnected && address) {
            getProfile(address)
                .then(res => {
                    setStats(res.data.stats);
                    setRecentActivity(res.data.recentActivity || []);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [isConnected, address]);

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#FFFFFF',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
        borderRadius: 'var(--nb-radius-lg)',
        padding: '24px',
        marginBottom: '24px'
    };

    if (!isConnected) {
        return (
            <div style={{
                backgroundColor: 'var(--nb-bg)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
                color: '#000000'
            }}>
                <div style={cardStyle}>
                    <div style={{ fontSize: '48px', marginBottom: '24px' }}>🔒</div>
                    <h2 style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px' }}>CONNECT WALLET</h2>
                    <p style={{ fontWeight: 700, color: '#6B7280', marginBottom: '32px' }}>Connect your wallet to view your hunter profile and rewards.</p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            width: '100%',
                            backgroundColor: 'var(--nb-yellow)',
                            border: 'var(--nb-border)',
                            boxShadow: '4px 4px 0px #000',
                            borderRadius: '12px',
                            padding: '20px',
                            fontSize: '20px',
                            fontWeight: 900,
                            cursor: 'pointer',
                            textTransform: 'uppercase'
                        }}
                    >CONNECT NOW</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: 'var(--nb-bg)',
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif",
            color: '#000000',
            paddingBottom: '100px'
        }}>
            {/* Header */}
            <div style={{
                padding: '24px 24px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--nb-bg)',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    margin: 0
                }}>PROFILE 👤</h1>
                <button
                    onClick={() => { disconnect(); navigate('/login'); }}
                    style={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #000',
                        boxShadow: '2px 2px 0px #000',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '10px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                    }}
                >LOGOUT</button>
            </div>

            <div style={{ padding: '0 24px' }}>
                {/* User Info Card */}
                <div style={{ ...cardStyle, textAlign: 'center', paddingTop: '40px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'var(--nb-mint)',
                        border: 'var(--nb-border)',
                        boxShadow: '4px 4px 0px #000',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        fontSize: '36px'
                    }}>🏹</div>
                    <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>MASTER HUNTER</h2>
                    <div style={{
                        display: 'inline-block',
                        backgroundColor: '#F3F4F6',
                        border: '1px solid #000',
                        borderRadius: '6px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: 900,
                        fontFamily: 'monospace'
                    }}>
                        {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '0x...'}
                    </div>
                </div>

                {loading ? (
                    <div style={{ ...cardStyle, height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', border: '4px solid #000', borderTopColor: 'var(--nb-yellow)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <>
                        {/* Balance Board */}
                        <div style={{
                            backgroundColor: 'var(--nb-yellow)',
                            border: 'var(--nb-border)',
                            boxShadow: 'var(--nb-shadow)',
                            borderRadius: 'var(--nb-radius-lg)',
                            padding: '24px',
                            textAlign: 'center',
                            marginBottom: '24px'
                        }}>
                            <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#000', opacity: 0.6, margin: '0 0 4px 0' }}>CURRENT WALLET BALANCE</p>
                            <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>{displayBalance} <span style={{ fontSize: '16px' }}>USDC</span></h2>
                        </div>

                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
                            <div style={{ ...cardStyle, padding: '16px', marginBottom: 0 }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#6B7280', margin: 0 }}>HUNTS DONE</p>
                                <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '4px 0 0 0' }}>{stats.huntsCompleted}</h2>
                            </div>
                            <div style={{ ...cardStyle, padding: '16px', marginBottom: 0 }}>
                                <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#6B7280', margin: 0 }}>TOTAL EARNED</p>
                                <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--nb-mint)', margin: '4px 0 0 0' }}>${stats.totalEarned}</h2>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <h3 style={{ fontSize: '18px', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', marginBottom: '20px' }}>RECENT ACTIVITY</h3>

                        {recentActivity.length === 0 ? (
                            <div style={{ ...cardStyle, textAlign: 'center', backgroundColor: '#F3F4F6' }}>
                                <p style={{ fontWeight: 800, color: '#6B7280', margin: 0 }}>Start your first hunt to earn rewards!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {recentActivity.map((item, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            backgroundColor: '#FFFFFF',
                                            border: 'var(--nb-border)',
                                            boxShadow: '4px 4px 0px #000',
                                            borderRadius: '16px',
                                            padding: '16px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div>
                                            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 4px 0' }}>{item.title}</h3>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <span style={{ fontSize: '10px', fontWeight: 800, color: '#6B7280' }}>
                                                    {new Date(item.timestamp).toLocaleDateString()}
                                                </span>
                                                <span style={{
                                                    backgroundColor: item.status === 'completed' ? 'var(--nb-mint)' : 'var(--nb-yellow)',
                                                    border: '1px solid #000',
                                                    borderRadius: '4px',
                                                    padding: '1px 6px',
                                                    fontSize: '8px',
                                                    fontWeight: 900,
                                                    textTransform: 'uppercase'
                                                }}>{item.status}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--nb-mint)' }}>+{item.reward}</div>
                                            <div style={{ fontSize: '8px', fontWeight: 900, color: '#6B7280' }}>USDC</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
