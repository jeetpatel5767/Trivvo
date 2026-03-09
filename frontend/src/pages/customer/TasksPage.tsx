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

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#FFFFFF',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
        borderRadius: 'var(--nb-radius-lg)',
        padding: '20px',
        marginBottom: '20px'
    };

    const taskItemStyle = (isCompleted: boolean): React.CSSProperties => ({
        backgroundColor: isCompleted ? 'var(--nb-mint)' : '#FFFFFF',
        border: 'var(--nb-border)',
        boxShadow: isCompleted ? '2px 2px 0px #000' : '4px 4px 0px #000',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isCompleted ? 'translate(2px, 2px)' : 'none',
        marginBottom: '16px'
    });

    const checkboxStyle = (isCompleted: boolean): React.CSSProperties => ({
        width: '32px',
        height: '32px',
        backgroundColor: isCompleted ? '#000' : '#FFF',
        border: '2px solid #000',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    });

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
                alignItems: 'center',
                gap: '16px',
                position: 'sticky',
                top: 0,
                backgroundColor: 'var(--nb-bg)',
                zIndex: 10
            }}>
                <button
                    onClick={() => navigate('/hunts')}
                    style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #000',
                        boxShadow: '2px 2px 0px #000',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '18px',
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
                    }}>MISSION TASKS 🎯</h1>
                    {state?.huntTitle && (
                        <span style={{
                            fontSize: '10px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            color: '#6B7280',
                            marginTop: '4px',
                            display: 'block'
                        }}>{state.huntTitle}</span>
                    )}
                </div>
            </div>

            <div style={{ padding: '0 24px' }}>
                {/* Progress Board */}
                <div style={{
                    ...cardStyle,
                    backgroundColor: 'var(--nb-yellow)',
                    padding: '16px 20px',
                    marginBottom: '32px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>PROGRESS</span>
                        <span style={{ fontSize: '12px', fontWeight: 900 }}>{completed.filter(Boolean).length}/{tasks.length} DONE</span>
                    </div>
                    <div style={{
                        height: '16px',
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #000',
                        borderRadius: '20px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${(completed.filter(Boolean).length / tasks.length) * 100}%`,
                            backgroundColor: 'var(--nb-mint)',
                            borderRight: completed.filter(Boolean).length > 0 ? '2px solid #000' : 'none',
                            transition: 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }} />
                    </div>
                </div>

                {/* Task List */}
                <div style={{ marginBottom: '32px' }}>
                    {tasks.map((task, i) => (
                        <div
                            key={i}
                            style={taskItemStyle(completed[i])}
                            onClick={() => toggleTask(i)}
                        >
                            <div style={checkboxStyle(completed[i])}>
                                {completed[i] && (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                            <span style={{
                                fontSize: '15px',
                                fontWeight: 800,
                                textDecoration: completed[i] ? 'line-through' : 'none',
                                opacity: completed[i] ? 0.7 : 1,
                                lineHeight: '1.4'
                            }}>
                                {task}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Instructions Board */}
                <div style={{ ...cardStyle }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📋</span> HOW IT WORKS
                    </h3>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#4B5563', margin: 0, lineHeight: '1.6' }}>
                        Finish all missions above, then show your screen to the vendor.
                        Once verified, you'll receive your final reward of <span style={{ color: '#000', fontWeight: 900 }}>{state?.mainReward || '5'} USDC</span> directly to your wallet.
                    </p>
                </div>

                {/* Success Banner */}
                {allDone && (
                    <div style={{
                        ...cardStyle,
                        backgroundColor: 'var(--nb-mint)',
                        textAlign: 'center',
                        padding: '32px 24px',
                        marginTop: '12px'
                    }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎊</div>
                        <h3 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>GO GET 'EM!</h3>
                        <p style={{ fontSize: '14px', fontWeight: 800, marginBottom: '24px' }}>All tasks are complete. Find the vendor to claim your prize.</p>
                        <button
                            disabled
                            style={{
                                width: '100%',
                                backgroundColor: '#000',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '16px',
                                fontSize: '18px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                cursor: 'default'
                            }}
                        >READY FOR CLAIM</button>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
