import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BottomNav } from '../../components/BottomNav';

export default function TasksPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as any;

    const tasks: string[] = state?.tasks || ['Complete the assigned task', 'Get verified by vendor'];
    const [completed, setCompleted] = useState<boolean[]>(tasks.map(() => false));

    const toggleTask = (index: number) => {
        const newCompleted = [...completed];
        newCompleted[index] = !newCompleted[index];
        setCompleted(newCompleted);
    };

    const allDone = completed.every(Boolean);

    return (
        <div className="page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/hunts')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <div style={{ flex: 1 }}>
                    <h2>Tasks</h2>
                    {state?.huntTitle && <small>{state.huntTitle}</small>}
                </div>
            </div>

            {/* Progress */}
            <div className="card-glass mb-4 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                    <small>Progress</small>
                    <small style={{ color: 'var(--primary-light)' }}>{completed.filter(Boolean).length}/{tasks.length}</small>
                </div>
                <div style={{
                    height: '6px', borderRadius: '3px',
                    background: 'var(--bg-card)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${(completed.filter(Boolean).length / tasks.length) * 100}%`,
                        background: 'var(--gradient-primary)',
                        borderRadius: '3px',
                        transition: 'width 0.5s ease',
                    }} />
                </div>
            </div>

            {/* Task list */}
            <div className="flex flex-col gap-3 stagger">
                {tasks.map((task, i) => (
                    <div
                        key={i}
                        className={`task-item ${completed[i] ? 'completed' : ''}`}
                        onClick={() => toggleTask(i)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="task-checkbox">
                            {completed[i] ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{i + 1}</span>
                            )}
                        </div>
                        <span style={{
                            fontSize: '0.9rem',
                            textDecoration: completed[i] ? 'line-through' : 'none',
                            opacity: completed[i] ? 0.6 : 1,
                        }}>
                            {task}
                        </span>
                    </div>
                ))}
            </div>

            {/* Info card */}
            <div className="card mt-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: '1.1rem' }}>ℹ️</span>
                    <h3>How it works</h3>
                </div>
                <p>
                    Complete all tasks, then show your progress to the vendor.
                    They'll verify your completion and you'll receive your main reward of{' '}
                    <strong style={{ color: 'var(--success)' }}>{state?.mainReward || '5'} USDC</strong>.
                </p>
            </div>

            {/* Submit */}
            {allDone && (
                <div className="animate-scale-in mt-4">
                    <div className="card-glass" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', textAlign: 'center', padding: '24px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
                        <h3>All tasks done!</h3>
                        <p style={{ marginBottom: '16px' }}>Show this screen to the vendor for verification</p>
                        <button className="btn btn-success btn-full btn-lg">
                            Ready for Verification
                        </button>
                    </div>
                </div>
            )}

            <div style={{ height: '80px' }} />
            <BottomNav />
        </div>
    );
}
