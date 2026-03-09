import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ArrivalRewardPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as any;
    const [showReward, setShowReward] = useState(false);

    useEffect(() => {
        // Trigger reward animation after mount
        const timer = setTimeout(() => setShowReward(true), 500);
        return () => clearTimeout(timer);
    }, []);

    if (!state) {
        return (
            <div className="page text-center" style={{ paddingTop: '100px' }}>
                <h2>No reward data</h2>
                <button onClick={() => navigate('/hunts')} className="btn btn-primary mt-4">Back to Hunts</button>
            </div>
        );
    }

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            {/* Glow background */}
            <div style={{
                position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '350px', height: '350px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(124, 58, 237, 0.1) 50%, transparent 70%)',
                filter: 'blur(40px)', pointerEvents: 'none',
                animation: showReward ? 'glow 2s infinite' : 'none',
            }} />

            {/* Reward content */}
            <div className={showReward ? 'animate-scale-in' : ''} style={{ textAlign: 'center', position: 'relative', opacity: showReward ? 1 : 0, transition: 'opacity 0.5s' }}>
                {/* Check icon */}
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>

                <h1 style={{ marginBottom: '8px' }}>Arrival Reward!</h1>
                <p style={{ fontSize: '0.95rem', marginBottom: '24px' }}>
                    Welcome to <strong style={{ color: 'var(--text-primary)' }}>{state.businessName}</strong>
                </p>

                {/* Reward amount */}
                <div className="reward-burst" style={{
                    padding: '24px', borderRadius: 'var(--radius-xl)',
                    background: 'var(--bg-glass)', border: '1px solid rgba(16, 185, 129, 0.3)',
                    backdropFilter: 'blur(20px)', marginBottom: '24px',
                }}>
                    <div style={{
                        fontSize: '3rem', fontWeight: 900,
                        background: 'linear-gradient(135deg, #10B981, #22D3EE)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        +{state.arrivalReward} USDC
                    </div>
                    <p style={{ marginTop: '8px' }}>Sent to your wallet</p>
                </div>

                {/* Transaction link */}
                <a
                    href={state.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
                    style={{ margin: '0 auto' }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    View on Snowtrace
                </a>
            </div>

            {/* Tasks unlocked */}
            {state.tasks && state.tasks.length > 0 && showReward && (
                <div className="animate-slide-up" style={{ width: '100%', marginTop: '32px', animationDelay: '0.5s' }}>
                    <div className="card-glass">
                        <div className="flex items-center gap-2 mb-3">
                            <span style={{ fontSize: '1.2rem' }}>🔓</span>
                            <h3>Tasks Unlocked!</h3>
                        </div>
                        <p style={{ marginBottom: '12px' }}>Complete these tasks to earn your main reward:</p>
                        <div className="flex flex-col gap-2">
                            {state.tasks.map((task: string, i: number) => (
                                <div key={i} className="task-item">
                                    <div className="task-checkbox">
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{i + 1}</span>
                                    </div>
                                    <span style={{ fontSize: '0.85rem' }}>{task}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate(`/tasks/${state.huntId}`, { state })}
                            className="btn btn-primary btn-full mt-4"
                        >
                            Start Tasks →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
