import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useConnect } from 'wagmi';
import { login } from '../../lib/api';

export default function LoginPage() {
    const { isConnected, address } = useAccount();
    const { connect, connectors, isPending } = useConnect();
    const navigate = useNavigate();

    useEffect(() => {
        if (isConnected && address) {
            // Register user in backend database
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
        <div className="page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '40px 24px' }}>
            <div style={{
                position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
                width: '300px', height: '300px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
                filter: 'blur(60px)', pointerEvents: 'none',
            }} />

            <div className="animate-scale-in" style={{ textAlign: 'center', marginBottom: '48px', position: 'relative' }}>
                <div style={{
                    fontSize: '4rem', fontWeight: 900,
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', letterSpacing: '-0.04em', lineHeight: 1,
                }}>
                    Tr!vvo
                </div>
                <p style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Hunt. Explore. Earn.
                </p>
            </div>

            <div className="animate-slide-up flex flex-col gap-3" style={{ marginBottom: '48px', width: '100%' }}>
                {[
                    { icon: '🗺️', text: 'Discover quests near you' },
                    { icon: '📱', text: 'Scan QR codes at locations' },
                    { icon: '💰', text: 'Earn USDC crypto rewards' },
                ].map((item, i) => (
                    <div key={i} className="card-glass flex items-center gap-3" style={{ padding: '14px 18px', animationDelay: `${i * 0.1}s` }}>
                        <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.text}</span>
                    </div>
                ))}
            </div>

            <div style={{ width: '100%' }} className="animate-slide-up">
                <button onClick={handleConnect} disabled={isPending} className="btn btn-primary btn-lg btn-full">
                    {isPending ? <>⏳ Connecting...</> : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="6" width="20" height="12" rx="2" />
                                <path d="M22 10H2" />
                            </svg>
                            Connect MetaMask
                        </>
                    )}
                </button>

                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    🔺 Avalanche Fuji Testnet • Rewards in USDC
                </p>
            </div>

            <div className="card mt-6 animate-slide-up" style={{ width: '100%', animationDelay: '0.3s' }}>
                <h3 className="mb-2" style={{ fontSize: '0.85rem' }}>🔧 Testnet Setup</h3>
                <div className="flex flex-col gap-1">
                    <small>1. Install MetaMask browser extension</small>
                    <small>2. Add Avalanche Fuji network (auto-prompted)</small>
                    <small>3. Get free test AVAX from faucet</small>
                </div>
            </div>

            <div style={{ marginTop: '32px' }}>
                <button onClick={() => navigate('/vendor/dashboard')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem' }}>
                    I'm a vendor →
                </button>
            </div>
        </div>
    );
}
