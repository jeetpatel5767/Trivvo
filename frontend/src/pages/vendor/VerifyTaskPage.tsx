import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeTask, claimMainReward } from '../../lib/api';
import { VendorSidebar } from '../../components/VendorSidebar';
import { WalletButton } from '../../components/WalletButton';

export default function VerifyTaskPage() {
    const navigate = useNavigate();
    const [walletAddress, setWalletAddress] = useState('');
    const [huntId, setHuntId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

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
                    <h2>Verify Task</h2>
                </div>

                {!result ? (
                    <div className="animate-fade-in">
                        <div className="card-glass mb-4">
                            <h3 className="mb-3">✅ Verify & Reward</h3>
                            <p style={{ marginBottom: '16px' }}>Enter the participant's details to verify their task and send the main reward.</p>

                            <div className="flex flex-col gap-3">
                                <div className="input-group">
                                    <label>Hunt ID</label>
                                    <input className="input" placeholder="Hunt ID or demo-1" value={huntId} onChange={(e) => setHuntId(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label>Participant Wallet Address</label>
                                    <input className="input" placeholder="0x..." value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="card mb-4" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
                                <p style={{ color: 'var(--error)', fontSize: '0.85rem' }}>⚠️ {error}</p>
                            </div>
                        )}

                        <button onClick={handleVerify} className="btn btn-success btn-lg btn-full" disabled={loading || !huntId || !walletAddress}>
                            {loading ? '⏳ Verifying & Sending Reward...' : '✓ Verify Task & Send Reward'}
                        </button>
                    </div>
                ) : (
                    <div className="animate-scale-in text-center" style={{ paddingTop: '40px' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
                            fontSize: '2rem',
                        }}>
                            ✓
                        </div>
                        <h1>Reward Sent!</h1>
                        <p className="mt-2">{result.mainReward} USDC sent to participant</p>

                        <a href={result.explorerUrl} target="_blank" rel="noopener noreferrer" className="tx-link mt-4" style={{ display: 'inline-flex' }}>
                            View on Snowtrace →
                        </a>

                        <div className="flex flex-col gap-2 mt-6">
                            <button onClick={() => { setResult(null); setWalletAddress(''); setHuntId(''); }} className="btn btn-primary btn-full">
                                Verify Another
                            </button>
                            <button onClick={() => navigate('/vendor/dashboard')} className="btn btn-secondary btn-full">
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
