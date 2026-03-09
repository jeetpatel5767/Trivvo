import React, { useState } from 'react';
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

    return (
        <div className="page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate('/hunts')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <h2>Scan QR Code</h2>
            </div>

            {/* Scanner */}
            <div className="qr-scanner-container animate-scale-in" style={{ marginTop: '20px' }}>
                <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(6, 182, 212, 0.05))',
                }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--primary-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                        <path d="M3 7V5a2 2 0 012-2h2" /><path d="M17 3h2a2 2 0 012 2v2" /><path d="M21 17v2a2 2 0 01-2 2h-2" /><path d="M7 21H5a2 2 0 01-2-2v-2" />
                        <rect x="7" y="7" width="10" height="10" rx="1" />
                    </svg>
                    <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', padding: '0 20px' }}>
                        Point your camera at the hunt QR code
                    </p>
                </div>
                <div className="scanner-line" />
            </div>

            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Camera access required for QR scanning
            </p>

            {/* Manual entry (for demo) */}
            <div className="card mt-6 animate-slide-up">
                <h3 className="mb-2">🔧 Manual Entry (Demo)</h3>
                <p style={{ marginBottom: '12px' }}>Enter QR data as <code>huntId:qrSecret</code></p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="input"
                        placeholder="huntId:qrSecret"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button
                        onClick={handleManualSubmit}
                        className="btn btn-primary btn-sm"
                        disabled={scanning || !manualInput.trim()}
                    >
                        {scanning ? '...' : 'Go'}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="card mt-4" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
                    <p style={{ color: 'var(--error)', fontSize: '0.85rem' }}>⚠️ {error}</p>
                </div>
            )}

            {/* Demo buttons */}
            <div className="mt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="mb-2">Quick Demo</h3>
                <p style={{ marginBottom: '12px' }}>Simulate a successful scan:</p>
                <button
                    onClick={() => {
                        if (hunt) {
                            handleScan(`${hunt.hunt_id}:${hunt.qr_secret}`);
                        } else {
                            setError('Please navigate from a specific hunt to use the quick demo');
                        }
                    }}
                    className="btn btn-secondary btn-full"
                    disabled={scanning}
                >
                    {scanning ? '...' : '⚡ Simulate QR Scan'}
                </button>
            </div>

            <div style={{ height: '80px' }} />
            <BottomNav />
        </div>
    );
}
