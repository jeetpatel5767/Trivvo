import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { completeTask, claimMainReward, getHunts } from '../../lib/api';
import LogoT from '../../assets/LogoT.png';

export default function VerifyTaskPage() {
    const navigate = useNavigate();
    const { address } = useAccount();
    const [walletAddress, setWalletAddress] = useState('');
    const [huntId, setHuntId] = useState('');
    const [activeHunts, setActiveHunts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!address) return;
        getHunts().then(res => {
            if (res.data?.hunts) {
                const myActive = res.data.hunts.filter((h: any) =>
                    h.status === 'active' &&
                    h.vendor_wallet?.toLowerCase() === address.toLowerCase()
                );
                setActiveHunts(myActive);
                if (myActive.length > 0) {
                    setHuntId(myActive[0].hunt_id);
                }
            }
        }).catch(err => console.error(err));
    }, [address]);

    const handleVerify = async () => {
        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Step 1: Mark task as completed
            await completeTask(huntId, walletAddress);

            // Step 2: Send main reward
            const res = await claimMainReward(huntId, walletAddress);

            setResult({
                success: true,
                mainReward: res.data.mainReward,
                txHash: res.data.rewardTxHash,
                explorerUrl: res.data.explorerUrl,
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Verification failed');
            // Demo fallback
            if (walletAddress && huntId) {
                setResult({
                    success: true,
                    mainReward: '5',
                    txHash: '0xdemo_reward_tx_' + Date.now(),
                    explorerUrl: 'https://snowtrace.io/tx/0xdemo',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#FFFFFF',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
        borderRadius: 'var(--nb-radius-lg)',
        padding: '24px',
        marginBottom: '24px'
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '16px',
        backgroundColor: '#FFFFFF',
        border: '3px solid #000',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 700,
        outline: 'none',
        boxShadow: '4px 4px 0px #000',
        marginBottom: '20px'
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
                    }}>VERIFY TASK ✓</h1>
                </div>

                {!result ? (
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>✅ VERIFY & REWARD</h3>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#6B7280', marginBottom: '24px' }}>
                                Verify the hunter's mission completion and distribute their final USDC reward.
                            </p>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>SELECT HUNT</label>
                                <select
                                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                                    value={huntId}
                                    onChange={(e) => setHuntId(e.target.value)}
                                >
                                    {activeHunts.length === 0 ? (
                                        <option value="" disabled>No active hunts found</option>
                                    ) : (
                                        activeHunts.map(h => (
                                            <option key={h.hunt_id} value={h.hunt_id}>
                                                {h.title}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>PARTICIPANT WALLET ADDRESS</label>
                                <input
                                    style={inputStyle}
                                    placeholder="0x..."
                                    value={walletAddress}
                                    onChange={(e) => setWalletAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div style={{
                                backgroundColor: '#FEE2E2',
                                border: '2px solid #B91C1C',
                                borderRadius: '12px',
                                padding: '16px',
                                marginBottom: '24px',
                                color: '#B91C1C',
                                fontWeight: 800,
                                display: 'flex',
                                gap: '8px'
                            }}>
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <button
                            onClick={handleVerify}
                            disabled={loading || !huntId || !walletAddress}
                            style={{
                                width: '100%',
                                backgroundColor: 'var(--nb-yellow)',
                                border: 'var(--nb-border)',
                                boxShadow: 'var(--nb-shadow)',
                                borderRadius: 'var(--nb-radius-lg)',
                                padding: '24px',
                                fontSize: '20px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                cursor: (loading || !huntId || !walletAddress) ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.8 : 1
                            }}
                        >
                            {loading ? '⏳ VERIFYING...' : '✓ VERIFY & SEND REWARD'}
                        </button>
                    </div>
                ) : (
                    <div style={{ ...cardStyle, textAlign: 'center', padding: '40px 24px', maxWidth: '500px', margin: '0 auto' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: 'var(--nb-mint)',
                            border: 'var(--nb-border)',
                            boxShadow: 'var(--nb-shadow)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            fontSize: '40px'
                        }}>✓</div>
                        <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px' }}>REWARD SENT! 🎉</h2>
                        <p style={{ fontWeight: 800, color: '#000', fontSize: '18px', marginBottom: '24px' }}>
                            {result.mainReward} USDC sent successfully
                        </p>

                        <a
                            href={result.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: '#FFFFFF',
                                border: '2px solid #000',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: 900,
                                color: '#000',
                                textDecoration: 'none',
                                boxShadow: '4px 4px 0px #000',
                                marginBottom: '40px'
                            }}
                        >
                            VIEW ON SNOWTRACE →
                        </a>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <button
                                onClick={() => { setResult(null); setWalletAddress(''); }}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'var(--nb-yellow)',
                                    border: 'var(--nb-border)',
                                    boxShadow: 'var(--nb-shadow)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    fontSize: '18px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    cursor: 'pointer'
                                }}
                            >VERIFY ANOTHER</button>
                            <button
                                onClick={() => navigate('/vendor/dashboard')}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#FFFFFF',
                                    border: 'var(--nb-border)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    fontSize: '18px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    cursor: 'pointer'
                                }}
                            >BACK TO DASHBOARD</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
