import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { HUNT_ESCROW_ABI, CONTRACTS } from '../../lib/contracts';
import { VendorSidebar } from '../../components/VendorSidebar';
import { WalletButton } from '../../components/WalletButton';
import { getHunt, getParticipants, withdrawHunt } from '../../lib/api';

export default function HuntManagePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [hunt, setHunt] = useState<any>(null);
    const [participants, setParticipants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [withdrawError, setWithdrawError] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const { writeContract: withdrawOnChain, data: withdrawTxHash, error: chainError } = useWriteContract();
    const { isSuccess: withdrawConfirmed } = useWaitForTransactionReceipt({ hash: withdrawTxHash });

    useEffect(() => {
        if (!id) return;
        Promise.all([
            getHunt(id).catch(() => ({ data: { hunt: null } })),
            getParticipants(id).catch(() => ({ data: { participants: [] } }))
        ]).then(([huntRes, partsRes]) => {
            setHunt(huntRes.data?.hunt);
            setParticipants(partsRes.data?.participants || []);
        }).finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (withdrawConfirmed && hunt?.hunt_id) {
            const syncWithdrawal = async () => {
                try {
                    await withdrawHunt(hunt.hunt_id, withdrawTxHash as string);
                    setHunt(prev => ({ ...prev, status: 'ended', remaining_funds: '0.00' }));
                    setIsWithdrawing(false);
                } catch (err) {
                    console.error('Failed to sync withdrawal with database', err);
                    setWithdrawError('Withdrawn on-chain, but failed to sync to database.');
                    setIsWithdrawing(false);
                }
            };
            syncWithdrawal();
        }
    }, [withdrawConfirmed, hunt?.hunt_id, withdrawTxHash]);

    useEffect(() => {
        if (chainError) {
            setWithdrawError((chainError as any).shortMessage || chainError.message);
            setIsWithdrawing(false);
        }
    }, [chainError]);

    const handleWithdraw = () => {
        if (!hunt || hunt.contract_hunt_id === undefined || hunt.contract_hunt_id === null) return;
        setWithdrawError('');
        setIsWithdrawing(true);
        withdrawOnChain({
            address: CONTRACTS.HUNT_ESCROW as `0x${string}`,
            abi: HUNT_ESCROW_ABI,
            functionName: 'withdrawRemaining',
            args: [BigInt(hunt.contract_hunt_id)],
        });
    };

    if (loading) {
        return (
            <div className="vendor-layout">
                <VendorSidebar />
                <div className="page" style={{ padding: '40px' }}>
                    <div className="card skeleton" style={{ height: '200px' }} />
                </div>
            </div>
        );
    }

    if (!hunt) {
        return (
            <div className="vendor-layout">
                <VendorSidebar />
                <div className="page" style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Hunt not found</h2>
                    <button className="btn btn-secondary mt-4" onClick={() => navigate('/vendor/dashboard')}>Back to Dashboard</button>
                </div>
            </div>
        );
    }

    const completedCount = participants.filter(p => p.task_completed).length;

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
                    <h2>Manage: {hunt.title}</h2>
                    <span className={`badge badge-${hunt.status === 'active' ? 'active' : 'pending'}`}>{hunt.status}</span>
                </div>

                {/* Stats */}
                <div className="stat-grid mb-4 animate-fade-in">
                    <div className="stat-card">
                        <div className="stat-value">{participants.length}</div>
                        <div className="stat-label">Participants</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{completedCount}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{hunt.qr_scans}</div>
                        <div className="stat-label">QR Scans</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{Number(hunt.rewards_distributed).toFixed(2)}</div>
                        <div className="stat-label">USDC Distributed</div>
                    </div>
                </div>
                {/* Additional Stats Row */}
                <div className="stat-grid mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-card" style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))', borderColor: 'rgba(16,185,129,0.2)' }}>
                        <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--success)' }}>
                            {hunt.remaining_funds !== undefined ? Number(hunt.remaining_funds).toFixed(2) : '-.--'}
                        </div>
                        <div className="stat-label">Remaining Staked USDC (On-Chain)</div>
                    </div>
                </div>

                {/* Quick actions */}
                {withdrawError && (
                    <div className="card mb-4 mt-2" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
                        <p style={{ color: 'var(--error)', fontSize: '0.85rem' }}>⚠️ {withdrawError}</p>
                    </div>
                )}

                <div className="flex gap-2 mb-4 animate-slide-up" style={{ flexWrap: 'wrap' }}>
                    <button onClick={() => navigate(`/vendor/qr/${id}`)} className="btn btn-secondary btn-sm" style={{ flex: '1 1 auto' }}>📱 QR Code</button>
                    <button onClick={() => navigate(`/vendor/participants/${id}`)} className="btn btn-secondary btn-sm" style={{ flex: '1 1 auto' }}>👥 All Users</button>
                    <button onClick={() => navigate('/vendor/verify-task')} className="btn btn-primary btn-sm" style={{ flex: '1 1 auto' }}>✓ Verify Tasks</button>

                    {hunt.status === 'expired' && Number(hunt.remaining_funds) > 0 && (
                        <button
                            onClick={handleWithdraw}
                            disabled={isWithdrawing}
                            className="btn btn-sm"
                            style={{ flex: '1 1 auto', background: 'var(--error)', color: 'white', border: 'none' }}
                        >
                            {isWithdrawing ? '⏳ Withdrawing...' : '💸 Withdraw Funds'}
                        </button>
                    )}
                </div>

                {/* Recent participants */}
                <h3 className="mb-3">Recent Activity</h3>
                {participants.length === 0 ? (
                    <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No participants yet. Share your QR code!
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 stagger">
                        {participants.slice(0, 10).map((p, i) => (
                            <div key={p.id || i} className="card" style={{ padding: '14px 16px' }}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="wallet-address" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                                        {p.wallet_address.slice(0, 6)}...{p.wallet_address.slice(-4)}
                                    </span>
                                    <small>{new Date(p.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className={`badge ${p.task_completed ? 'badge-active' : 'badge-pending'}`}>
                                        {p.task_completed ? 'Task Done' : 'In Progress'}
                                    </span>
                                    {p.task_completed && !p.reward_tx_hash && (
                                        <button className="btn btn-success btn-sm" onClick={() => navigate('/vendor/verify-task')}>Verify</button>
                                    )}
                                    {p.reward_tx_hash && (
                                        <span className="badge badge-reward">Rewarded</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {participants.length > 10 && (
                            <button className="btn btn-secondary mt-2" onClick={() => navigate(`/vendor/participants/${id}`)}>View All Participants</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
