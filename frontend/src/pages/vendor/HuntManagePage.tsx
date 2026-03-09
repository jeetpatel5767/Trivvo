import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { HUNT_ESCROW_ABI, CONTRACTS } from '../../lib/contracts';
import { getHunt, getParticipants, withdrawHunt } from '../../lib/api';
import LogoT from '../../assets/LogoT.png';

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
                    setHunt((prev: any) => ({ ...prev, status: 'ended', remaining_funds: '0.00' }));
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

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#FFFFFF',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
        borderRadius: 'var(--nb-radius-lg)',
        padding: '24px',
        marginBottom: '24px'
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: 'var(--nb-bg)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', border: '5px solid #000', borderTopColor: 'var(--nb-yellow)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ marginTop: '16px', fontWeight: 900 }}>LOADING HUNT...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (!hunt) {
        return (
            <div style={{ backgroundColor: 'var(--nb-bg)', minHeight: '100vh', padding: '40px', textAlign: 'center' }}>
                <h2 style={{ fontWeight: 900 }}>HUNT NOT FOUND</h2>
                <button
                    onClick={() => navigate('/vendor/dashboard')}
                    style={{ backgroundColor: '#FFFFFF', border: 'var(--nb-border)', boxShadow: 'var(--nb-shadow)', borderRadius: '12px', padding: '12px 24px', fontWeight: 900, cursor: 'pointer', marginTop: '24px' }}
                >BACK TO DASHBOARD</button>
            </div>
        );
    }

    const completedCount = participants.filter(p => p.task_completed).length;

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
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            fontSize: '24px',
                            fontWeight: 900,
                            fontStyle: 'italic',
                            textTransform: 'uppercase',
                            margin: 0,
                            lineHeight: '1'
                        }}>{hunt.title}</h1>
                        <span style={{
                            display: 'inline-block',
                            backgroundColor: hunt.status === 'active' ? 'var(--nb-mint)' : '#E5E7EB',
                            border: '2px solid #000',
                            borderRadius: '6px',
                            padding: '2px 8px',
                            fontSize: '10px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            marginTop: '8px'
                        }}>{hunt.status}</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ ...cardStyle, padding: '16px', marginBottom: 0, position: 'relative', overflow: 'hidden' }}>
                        <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#6B7280', margin: 0 }}>PARTICIPANTS</p>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, margin: '8px 0 0 0' }}>{participants.length}</h2>
                        <div style={{ position: 'absolute', right: '-5px', top: '5px', fontSize: '32px', opacity: 0.1 }}>👥</div>
                    </div>
                    <div style={{ ...cardStyle, padding: '16px', marginBottom: 0, position: 'relative', overflow: 'hidden' }}>
                        <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#6B7280', margin: 0 }}>COMPLETED</p>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--nb-mint)', margin: '8px 0 0 0' }}>{completedCount}</h2>
                        <div style={{ position: 'absolute', right: '-5px', top: '5px', fontSize: '32px', opacity: 0.1 }}>✓</div>
                    </div>
                    <div style={{ ...cardStyle, padding: '16px', marginBottom: 0, position: 'relative', overflow: 'hidden' }}>
                        <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#6B7280', margin: 0 }}>QR SCANS</p>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, margin: '8px 0 0 0' }}>{hunt.qr_scans}</h2>
                        <div style={{ position: 'absolute', right: '-5px', top: '5px', fontSize: '32px', opacity: 0.1 }}>📱</div>
                    </div>
                    <div style={{ ...cardStyle, padding: '16px', marginBottom: 0, border: 'var(--nb-border)', backgroundColor: '#FEFCE8', position: 'relative', overflow: 'hidden' }}>
                        <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#6B7280', margin: 0 }}>DISTRIBUTED</p>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '8px 0 0 0' }}>${Number(hunt.rewards_distributed).toFixed(1)}</h2>
                        <div style={{ position: 'absolute', right: '-5px', top: '5px', fontSize: '32px', opacity: 0.1 }}>💰</div>
                    </div>
                </div>

                {/* Remaining Funds Card */}
                <div style={{
                    backgroundColor: '#FFFFFF',
                    border: 'var(--nb-border)',
                    boxShadow: 'var(--nb-shadow)',
                    borderRadius: 'var(--nb-radius)',
                    padding: '24px',
                    marginBottom: '32px',
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    <p style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#6B7280', margin: '0 0 8px 0' }}>Remaining On-Chain Funds</p>

                    {hunt.contract_hunt_id === null ? (
                        <div style={{ padding: '10px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#EF4444', margin: '0 0 8px 0' }}>NOT FUNDED</h2>
                            <button
                                onClick={() => navigate(`/vendor/fund-hunt/${id}`)}
                                style={{ backgroundColor: 'var(--nb-yellow)', border: '2px solid #000', borderRadius: '8px', padding: '8px 16px', fontWeight: 900, cursor: 'pointer' }}
                            >FUND NOW 💰</button>
                        </div>
                    ) : hunt.remaining_funds === undefined ? (
                        <div>
                            <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#6B7280', margin: 0 }}>SYNCING...</h2>
                            <p style={{ fontSize: '10px', fontWeight: 700, marginTop: '8px' }}>FETCHING FROM BLOCKCHAIN</p>
                        </div>
                    ) : (
                        <>
                            <h2 style={{ fontSize: '36px', fontWeight: 900, color: Number(hunt.remaining_funds) > 0 ? 'var(--nb-mint)' : '#EF4444', margin: 0 }}>
                                {Number(hunt.remaining_funds).toFixed(2)} <span style={{ fontSize: '18px' }}>USDC</span>
                            </h2>
                            {Number(hunt.remaining_funds) === 0 && (
                                <p style={{ fontSize: '10px', fontWeight: 900, color: '#EF4444', marginTop: '8px', textTransform: 'uppercase' }}>
                                    ⚠ Funds depleted or contract reset
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
                    <button
                        onClick={() => navigate(`/vendor/qr/${id}`)}
                        style={{
                            backgroundColor: '#FFFFFF',
                            border: '2px solid #000',
                            borderRadius: '12px',
                            padding: '16px 8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            boxShadow: '4px 4px 0px #000'
                        }}
                    >
                        <span style={{ fontSize: '24px' }}>📱</span>
                        <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>QR CODE</span>
                    </button>
                    <button
                        onClick={() => navigate(`/vendor/participants/${id}`)}
                        style={{
                            backgroundColor: '#FFFFFF',
                            border: '2px solid #000',
                            borderRadius: '12px',
                            padding: '16px 8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            boxShadow: '4px 4px 0px #000'
                        }}
                    >
                        <span style={{ fontSize: '24px' }}>👥</span>
                        <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>USERS</span>
                    </button>
                    <button
                        onClick={() => navigate('/vendor/verify-task')}
                        style={{
                            backgroundColor: 'var(--nb-yellow)',
                            border: '2px solid #000',
                            borderRadius: '12px',
                            padding: '16px 8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            boxShadow: '4px 4px 0px #000'
                        }}
                    >
                        <span style={{ fontSize: '24px' }}>✓</span>
                        <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>VERIFY</span>
                    </button>
                </div>

                {/* Error Box */}
                {withdrawError && (
                    <div style={{ backgroundColor: '#FEE2E2', border: '2px solid #B91C1C', borderRadius: '12px', padding: '16px', marginBottom: '24px', color: '#B91C1C', fontWeight: 800 }}>
                        ⚠️ {withdrawError}
                    </div>
                )}

                {/* Withdraw Section */}
                {hunt.status === 'expired' && Number(hunt.remaining_funds) > 0 && (
                    <button
                        onClick={handleWithdraw}
                        disabled={isWithdrawing}
                        style={{
                            width: '100%',
                            backgroundColor: '#FCA5A5',
                            border: 'var(--nb-border)',
                            boxShadow: 'var(--nb-shadow)',
                            borderRadius: '12px',
                            padding: '20px',
                            fontSize: '18px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            cursor: isWithdrawing ? 'not-allowed' : 'pointer',
                            marginBottom: '32px'
                        }}
                    >
                        {isWithdrawing ? '⏳ WITHDRAWING...' : '💸 WITHDRAW REMAINING FUNDS'}
                    </button>
                )}

                {/* Recent Activity */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', margin: 0 }}>RECENT ACTIVITY</h3>
                </div>

                {participants.length === 0 ? (
                    <div style={{ ...cardStyle, padding: '32px', textAlign: 'center', backgroundColor: '#F3F4F6' }}>
                        <p style={{ fontWeight: 800, color: '#6B7280', margin: 0 }}>No participants yet. Give your code to someone!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {participants.slice(0, 10).map((p, i) => (
                            <div
                                key={p.id || i}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    border: 'var(--nb-border)',
                                    boxShadow: '4px 4px 0px #000',
                                    borderRadius: '16px',
                                    padding: '16px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div style={{
                                        backgroundColor: '#E5E7EB',
                                        border: '1px solid #000',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        fontSize: '10px',
                                        fontWeight: 900,
                                        fontFamily: 'monospace'
                                    }}>{p.wallet_address.slice(0, 6)}...{p.wallet_address.slice(-4)}</div>
                                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#6B7280' }}>
                                        {new Date(p.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        backgroundColor: p.task_completed ? 'var(--nb-mint)' : 'var(--nb-yellow)',
                                        border: '1px solid #000',
                                        borderRadius: '6px',
                                        padding: '4px 10px',
                                        fontSize: '10px',
                                        fontWeight: 900,
                                        textTransform: 'uppercase'
                                    }}>
                                        {p.task_completed ? '✓ TASK DONE' : '○ IN PROGRESS'}
                                    </div>
                                    {p.task_completed && !p.reward_tx_hash && (
                                        <button
                                            onClick={() => navigate('/vendor/verify-task')}
                                            style={{
                                                backgroundColor: '#000',
                                                color: '#FFF',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '6px 12px',
                                                fontSize: '10px',
                                                fontWeight: 900,
                                                cursor: 'pointer'
                                            }}
                                        >VERIFY</button>
                                    )}
                                    {p.reward_tx_hash && (
                                        <div style={{
                                            backgroundColor: 'var(--nb-yellow)',
                                            border: '1px solid #000',
                                            borderRadius: '6px',
                                            padding: '4px 10px',
                                            fontSize: '10px',
                                            fontWeight: 900,
                                            textTransform: 'uppercase'
                                        }}>💰 REWARDED</div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {participants.length > 10 && (
                            <button
                                onClick={() => navigate(`/vendor/participants/${id}`)}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#FFFFFF',
                                    border: '2px solid #000',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    fontWeight: 900,
                                    cursor: 'pointer',
                                    marginTop: '8px'
                                }}
                            >VIEW ALL PARTICIPANTS ({participants.length})</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
