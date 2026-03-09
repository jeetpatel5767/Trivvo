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
                <div style={{
                    backgroundColor: '#FFFFFF',
                    border: 'var(--nb-border)',
                    boxShadow: 'var(--nb-shadow)',
                    borderRadius: 'var(--nb-radius-lg)',
                    padding: '32px'
                }}>
                    <h2 style={{ fontWeight: 900, marginBottom: '24px' }}>NO REWARD DATA FOUND</h2>
                    <button
                        onClick={() => navigate('/hunts')}
                        style={{
                            backgroundColor: 'var(--nb-yellow)',
                            border: 'var(--nb-border)',
                            boxShadow: '4px 4px 0px #000',
                            borderRadius: '12px',
                            padding: '16px 32px',
                            fontSize: '18px',
                            fontWeight: 900,
                            cursor: 'pointer'
                        }}
                    >BACK TO HUNTS</button>
                </div>
            </div>
        );
    }

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#FFFFFF',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
        borderRadius: 'var(--nb-radius-lg)',
        padding: '24px',
        width: '100%',
        maxWidth: '400px',
        position: 'relative'
    };

    return (
        <div style={{
            backgroundColor: 'var(--nb-bg)',
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif",
            color: '#000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px 24px',
            overflowX: 'hidden'
        }}>
            {/* Success Celebration Content */}
            <div style={{
                textAlign: 'center',
                opacity: showReward ? 1 : 0,
                transform: showReward ? 'scale(1)' : 'scale(0.9)',
                transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Reward Badge */}
                <div style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'var(--nb-mint)',
                    border: 'var(--nb-border)',
                    boxShadow: '8px 8px 0px #000',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '32px',
                    fontSize: '48px'
                }}>
                    🎉
                </div>

                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    margin: '0 0 8px 0',
                    lineHeight: '1'
                }}>ARRIVAL REWARD!</h1>

                <p style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#6B7280',
                    marginBottom: '32px'
                }}>
                    Welcome to <span style={{ color: '#000' }}>{state.businessName}</span>
                </p>

                {/* Reward Amount Card */}
                <div style={{
                    ...cardStyle,
                    backgroundColor: 'var(--nb-yellow)',
                    textAlign: 'center',
                    padding: '40px 24px',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        fontSize: '48px',
                        fontWeight: 900,
                        lineHeight: '1',
                        marginBottom: '8px'
                    }}>
                        +{state.arrivalReward} USDC
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>SENT TO YOUR WALLET 💸</div>
                </div>

                {/* Explorer Link */}
                <a
                    href={state.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #000',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 900,
                        color: '#000',
                        textDecoration: 'none',
                        boxShadow: '4px 4px 0px #000',
                        marginBottom: '48px'
                    }}
                >
                    <span>🔗</span> VIEW ON SNOWTRACE
                </a>
            </div>

            {/* Tasks Unlocked Section */}
            {state.tasks && state.tasks.length > 0 && showReward && (
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    opacity: showReward ? 1 : 0,
                    transform: showReward ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease-out 0.3s'
                }}>
                    <div style={{
                        ...cardStyle,
                        backgroundColor: '#FFFFFF',
                        padding: '32px 24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '24px' }}>🔓</span>
                            <h3 style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>TASKS UNLOCKED!</h3>
                        </div>

                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#6B7280', marginBottom: '24px' }}>
                            Complete these missions to earn the BIG reward from <span style={{ color: '#000' }}>{state.businessName}</span>.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                            {state.tasks.map((task: string, i: number) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'center',
                                    backgroundColor: '#F3F4F6',
                                    border: '2px solid #000',
                                    padding: '12px',
                                    borderRadius: '12px'
                                }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: '#000',
                                        color: '#FFF',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '12px',
                                        fontWeight: 900,
                                        flexShrink: 0
                                    }}>{i + 1}</div>
                                    <span style={{ fontSize: '14px', fontWeight: 800 }}>{task}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate(`/tasks/${state.huntId}`, { state })}
                            style={{
                                width: '100%',
                                backgroundColor: 'var(--nb-yellow)',
                                border: 'var(--nb-border)',
                                boxShadow: 'var(--nb-shadow)',
                                borderRadius: 'var(--nb-radius)',
                                padding: '20px',
                                fontSize: '20px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            START TASKS <span>→</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
