import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function RewardConfirmPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as any;

    const reward = state?.mainReward || '5';
    const txHash = state?.txHash || '0xdemo123456789abcdef';
    const explorerUrl = state?.explorerUrl || `https://snowtrace.io/tx/${txHash}`;

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            {/* Glow */}
            <div style={{
                position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '350px', height: '350px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(124, 58, 237, 0.1) 50%, transparent 70%)',
                filter: 'blur(50px)', pointerEvents: 'none',
            }} />

            {/* Trophy */}
            <div className="animate-scale-in" style={{ textAlign: 'center' }}>
                <div style={{
                    width: '100px', height: '100px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 0 60px rgba(245, 158, 11, 0.4)',
                    fontSize: '2.5rem',
                }}>
                    🏆
                </div>

                <h1 style={{ marginBottom: '8px' }}>Hunt Complete!</h1>
                <p style={{ fontSize: '0.95rem', marginBottom: '32px' }}>
                    Congratulations! You've earned your reward.
                </p>

                {/* Reward amount */}
                <div className="reward-burst" style={{
                    padding: '28px', borderRadius: 'var(--radius-xl)',
                    background: 'var(--bg-glass)', border: '1px solid rgba(245, 158, 11, 0.3)',
                    backdropFilter: 'blur(20px)', marginBottom: '24px',
                }}>
                    <div style={{
                        fontSize: '3.5rem', fontWeight: 900,
                        background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        +{reward} USDC
                    </div>
                    <p style={{ marginTop: '8px' }}>Main reward sent!</p>
                </div>

                {/* Transaction link */}
                <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
                    style={{ margin: '0 auto 16px' }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    View on Snowtrace
                </a>

                {/* TX Hash */}
                <div className="wallet-address" style={{ wordBreak: 'break-all', maxWidth: '300px', margin: '0 auto' }}>
                    {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
                </div>
            </div>

            {/* Actions */}
            <div className="animate-slide-up" style={{ width: '100%', marginTop: '40px' }}>
                <button onClick={() => navigate('/hunts')} className="btn btn-primary btn-lg btn-full mb-2">
                    Find More Hunts
                </button>
                <button onClick={() => navigate('/profile')} className="btn btn-secondary btn-full">
                    View Profile
                </button>
            </div>
        </div>
    );
}
