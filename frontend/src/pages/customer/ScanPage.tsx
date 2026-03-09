import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { scanQR } from '../../lib/api';
import { BottomNav } from '../../components/BottomNav';

export default function ScanPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const hunt = location.state?.hunt;
    const { address } = useAccount();
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState('');
    const [manualInput, setManualInput] = useState('');

    const handleScan = async (data: string) => {
        if (scanning) return;
        setScanning(true);
        setError('');

        try {
            // Parse QR data: expected format "huntId:qrSecret"
            const parts = data.split(':');
            if (parts.length !== 2) {
                setError('Invalid QR code format');
                setScanning(false);
                return;
            }

            const [huntId, qrSecret] = parts;
            const walletAddress = address || '0xdemo';

            const res = await scanQR(huntId, qrSecret, walletAddress);

            if (res.data.success) {
                // Navigate to arrival reward page with scan results
                navigate('/arrival-reward', {
                    state: {
                        arrivalReward: res.data.arrivalReward,
                        txHash: res.data.arrivalTxHash,
                        explorerUrl: res.data.explorerUrl,
                        tasks: res.data.tasks,
                        huntTitle: res.data.huntTitle,
                        businessName: res.data.businessName,
                        huntId,
                    },
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Scan failed. Please try again.');
            setScanning(false);
        }
    };

    const handleManualSubmit = () => {
        if (manualInput.trim()) {
            handleScan(manualInput.trim());
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
        padding: '12px 16px',
        backgroundColor: '#FFFFFF',
        border: '3px solid #000',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 700,
        outline: 'none',
        boxShadow: '4px 4px 0px #000'
    };

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
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    margin: 0
                }}>SCAN QR CODE 📷</h1>
            </div>

            <div style={{ padding: '0 24px' }}>
                {/* Scanner Placeholder */}
                <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '4px solid #000',
                    boxShadow: 'var(--nb-shadow)',
                    borderRadius: '24px',
                    position: 'relative',
                    aspectRatio: '1',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '20px',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        right: '20px',
                        bottom: '20px',
                        border: '2px dashed #000',
                        opacity: 0.2,
                        borderRadius: '12px'
                    }}></div>

                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7V5a2 2 0 012-2h2" /><path d="M17 3h2a2 2 0 012 2v2" /><path d="M21 17v2a2 2 0 01-2 2h-2" /><path d="M7 21H5a2 2 0 01-2-2v-2" />
                        <rect x="7" y="7" width="10" height="10" rx="1" />
                    </svg>

                    <p style={{
                        fontWeight: 900,
                        marginTop: '24px',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>Initializing Camera...</p>

                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '4px',
                        backgroundColor: 'var(--nb-yellow)',
                        animation: 'scanLine 3s linear infinite'
                    }}></div>
                    <style>{`
                        @keyframes scanLine {
                            0% { top: 0; }
                            50% { top: 100%; }
                            100% { top: 0; }
                        }
                    `}</style>
                </div>

                {/* Status/Error */}
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

                {/* Manual Entry */}
                <div style={cardStyle}>
                    <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🔧</span> MANUAL ENTRY
                    </h3>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', marginBottom: '16px' }}>
                        If the camera isn't working, enter the QR data manually.
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                            type="text"
                            style={{ ...inputStyle, flex: 1, padding: '10px 16px', fontSize: '14px' }}
                            placeholder="e.g. 12:secret_key"
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                        />
                        <button
                            onClick={handleManualSubmit}
                            disabled={scanning || !manualInput.trim()}
                            style={{
                                backgroundColor: 'var(--nb-yellow)',
                                border: '2px solid #000',
                                borderRadius: '12px',
                                padding: '0 20px',
                                fontWeight: 900,
                                cursor: scanning || !manualInput.trim() ? 'not-allowed' : 'pointer',
                                boxShadow: '2px 2px 0px #000',
                                opacity: scanning || !manualInput.trim() ? 0.7 : 1
                            }}
                        >
                            {scanning ? '...' : 'GO'}
                        </button>
                    </div>
                </div>

                {/* Quick Demo */}
                <div style={{ ...cardStyle, backgroundColor: '#FFFFFF' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '12px' }}>QUICK DEMO ⚡</h3>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', marginBottom: '20px' }}>
                        Simulate a successful scan to continue your hunt.
                    </p>
                    <button
                        onClick={() => {
                            if (hunt) {
                                handleScan(`${hunt.hunt_id}:${hunt.qr_secret}`);
                            } else {
                                setError('Please select a hunt from the list first');
                            }
                        }}
                        disabled={scanning}
                        style={{
                            width: '100%',
                            backgroundColor: 'var(--nb-mint)',
                            border: 'var(--nb-border)',
                            boxShadow: 'var(--nb-shadow)',
                            borderRadius: '12px',
                            padding: '16px',
                            fontSize: '16px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            cursor: 'pointer'
                        }}
                    >
                        {scanning ? 'SCANNING...' : 'SIMULATE HUNT SCAN'}
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
