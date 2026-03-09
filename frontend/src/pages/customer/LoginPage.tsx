import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useConnect } from 'wagmi';
import { login } from '../../lib/api';
import huntBuilding from '../../assets/hunt_building.png';
import huntMap from '../../assets/hunt_map.png';

export default function LoginPage() {
    const { isConnected, address } = useAccount();
    const { connect, connectors, isPending } = useConnect();
    const navigate = useNavigate();

    useEffect(() => {
        if (isConnected && address) {
            login(address, 'user').catch(() => console.log('Backend not available — using demo mode'));
            navigate('/hunts');
        }
    }, [isConnected, address, navigate]);

    const handleConnect = () => {
        const connector = connectors.find(c => c.id === 'metaMask')
            || connectors.find(c => c.id === 'injected')
            || connectors[0];
        if (connector) connect({ connector });
    };

    return (
        <div style={{
            backgroundColor: 'var(--nb-bg)',
            color: 'var(--nb-text)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px',
            position: 'relative',
            overflowX: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Top Buttons Row */}
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '40px',
                zIndex: 10
            }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: 'var(--nb-yellow)',
                        border: 'var(--nb-border)',
                        boxShadow: 'var(--nb-shadow)',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '24px',
                        cursor: 'pointer'
                    }}
                >
                    ✕
                </button>
                <div style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: 'var(--nb-mint)',
                    border: 'var(--nb-border)',
                    boxShadow: 'var(--nb-shadow)',
                    borderRadius: '16px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '24px'
                }}>
                    🧭
                </div>
            </div>

            {/* Header Content */}
            <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-40px', fontSize: '32px' }}>🗝️</div>
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    color: '#000000',
                    lineHeight: '1',
                    margin: 0,
                    letterSpacing: '-1px'
                }}>
                    WELCOME<br />HUNTER
                </h1>
            </div>

            {/* Central Images Area */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginBottom: '60px',
                width: '100%',
                position: 'relative'
            }}>
                <div style={{ position: 'absolute', left: '-5px', bottom: '10px', fontSize: '32px', zIndex: 1 }}>🌟</div>

                {/* Image Card 1 */}
                <div style={{
                    width: '160px',
                    height: '160px',
                    backgroundColor: '#000',
                    border: 'var(--nb-border)',
                    boxShadow: 'var(--nb-shadow)',
                    borderRadius: 'var(--nb-radius)',
                    overflow: 'hidden'
                }}>
                    <img src={huntBuilding} alt="City Hunt" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Image Card 2 */}
                <div style={{
                    width: '160px',
                    height: '160px',
                    backgroundColor: '#000',
                    border: 'var(--nb-border)',
                    boxShadow: 'var(--nb-shadow)',
                    borderRadius: 'var(--nb-radius)',
                    overflow: 'hidden'
                }}>
                    <img src={huntMap} alt="Map Explorer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            </div>

            {/* Action Buttons Area */}
            <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                marginBottom: '40px'
            }}>
                {/* Connect MetaMask Button */}
                <button
                    onClick={handleConnect}
                    disabled={isPending}
                    style={{
                        width: '100%',
                        backgroundColor: 'var(--nb-yellow)',
                        border: 'var(--nb-border)',
                        boxShadow: 'var(--nb-shadow)',
                        borderRadius: 'var(--nb-radius-lg)',
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '20px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                    }}
                >
                    <span style={{ fontSize: '24px' }}>📁</span>
                    {isPending ? 'Connecting...' : 'CONNECT METAMASK'}
                </button>

                {/* Vendor Button */}
                <button
                    onClick={() => navigate('/vendor/dashboard')}
                    style={{
                        width: '100%',
                        backgroundColor: 'var(--nb-pink)',
                        border: '4px dashed #000',
                        boxShadow: 'var(--nb-shadow)',
                        borderRadius: 'var(--nb-radius-lg)',
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '20px',
                        fontWeight: 800,
                        cursor: 'pointer'
                    }}
                >
                    I am a Vendor 🏪
                </button>
            </div>

            {/* Footer Text Links */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <p style={{ color: '#6B7280', fontSize: '16px', margin: '0 0 8px 0' }}>New to the hunt?</p>
                <button style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: '4px solid var(--nb-yellow)',
                    fontSize: '18px',
                    fontWeight: 800,
                    padding: '0 0 2px 0',
                    cursor: 'pointer'
                }}>
                    Create an account
                </button>
            </div>

            {/* Footer Icons */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '32px',
                fontSize: '24px',
                opacity: 0.3
            }}>
                <span>📍</span>
                <span>📷</span>
                <span>🏆</span>
            </div>
        </div>
    );
}
