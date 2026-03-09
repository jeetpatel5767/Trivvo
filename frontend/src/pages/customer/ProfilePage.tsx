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

    if (!isConnected) {
        return (
            <div className="page text-center" style={{ paddingTop: '100px' }}>
                <h2>Connect Wallet</h2>
                <p className="mt-2">Connect your wallet to view your profile</p>
                <button onClick={() => navigate('/login')} className="btn btn-primary mt-4">Connect</button>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="flex justify-between items-center mb-6">
                <h2>Profile</h2>
                <button onClick={() => { disconnect(); navigate('/login'); }} className="btn btn-secondary btn-sm">
                    Disconnect
                </button>
            </div>

            {/* Avatar & wallet */}
            <div className="card-glass animate-fade-in" style={{ textAlign: 'center', padding: '24px', marginBottom: '20px' }}>
                <div style={{
                    width: '70px', height: '70px', borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px', fontSize: '2rem',
                }}>
                    🏹
                </div>
                <h3>Hunter</h3>
                <div className="wallet-address" style={{ marginTop: '8px' }}>
                    {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '0x...'}
                </div>
            </div>

            {loading ? (
                <div className="card skeleton" style={{ height: '300px' }} />
            ) : (
                <>
                    {/* Stats */}
                    <div className="stat-grid mb-4 animate-slide-up">
                        <div className="stat-card" style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))', borderColor: 'rgba(16,185,129,0.2)' }}>
                            <div className="stat-label mb-1" style={{ color: 'var(--text-secondary)' }}>Wallet USDC Balance</div>
                            <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--success)' }}>{displayBalance}</div>
                            <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--primary-light)' }}>Tr!vvo Smart Contract Rewards</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.huntsCompleted}</div>
                            <div className="stat-label">Hunts Done</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.totalEarned}</div>
                            <div className="stat-label">Total Earned</div>
                        </div>
                    </div>

                    {/* Recent activity */}
                    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <h3 className="mb-3">Recent Activity</h3>
                        {recentActivity.length === 0 ? (
                            <div className="card text-center text-muted" style={{ padding: '20px' }}>
                                Start your first hunt to earn rewards!
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 stagger">
                                {recentActivity.map((item, i) => (
                                    <div key={i} className="card" style={{ padding: '14px 16px' }}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 style={{ fontSize: '0.9rem', marginBottom: '2px' }}>{item.title}</h3>
                                                <div className="flex gap-2">
                                                    <small>{new Date(item.timestamp).toLocaleDateString()}</small>
                                                    <span className={`badge badge-${item.status === 'completed' ? 'active' : 'pending'}`} style={{ fontSize: '0.65rem' }}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.9rem' }}>+{item.reward}</div>
                                                <small>USDC</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            <div style={{ height: '80px' }} />
            <BottomNav />
        </div>
    );
}
