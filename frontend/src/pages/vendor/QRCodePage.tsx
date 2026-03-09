import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { VendorSidebar } from '../../components/VendorSidebar';
import { WalletButton } from '../../components/WalletButton';

export default function QRCodePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const qrData = `${id}:demo_secret_${id}`;

    const handleDownload = () => {
        const svg = document.querySelector('.qr-download-target svg') as SVGSVGElement;
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = 400;
            canvas.height = 400;
            if (ctx) {
                ctx.fillStyle = '#12121A';
                ctx.fillRect(0, 0, 400, 400);
                ctx.drawImage(img, 50, 50, 300, 300);
            }
            const link = document.createElement('a');
            link.download = `trivvo-hunt-${id}.png`;
            link.href = canvas.toDataURL();
            link.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    return (
        <div className="vendor-layout">
            <div className="vendor-header">
                <div className="logo logo-sm">Tr!vvo</div>
                <WalletButton />
            </div>
            <VendorSidebar />

            <div className="page">
                <div className="page-header">
                    <button className="back-btn" onClick={() => navigate('/vendor/dashboard')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <h2>Hunt QR Code</h2>
                </div>

                <div className="card-glass animate-scale-in" style={{ textAlign: 'center', padding: '32px' }}>
                    <div className="qr-download-target" style={{
                        display: 'inline-block',
                        padding: '24px',
                        background: 'white',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: '20px',
                    }}>
                        <QRCodeSVG
                            value={qrData}
                            size={220}
                            bgColor="#FFFFFF"
                            fgColor="#12121A"
                            level="H"
                        />
                    </div>

                    <h3 className="mb-2">Scan to Join Hunt</h3>
                    <p style={{ marginBottom: '16px' }}>Print this QR and display it at your location.</p>

                    <div className="wallet-address" style={{ wordBreak: 'break-all', marginBottom: '20px' }}>
                        QR Data: {qrData}
                    </div>

                    <div className="flex flex-col gap-2">
                        <button onClick={handleDownload} className="btn btn-primary btn-full">
                            📥 Download QR Code
                        </button>
                        <button onClick={() => navigate(`/vendor/fund/${id}`)} className="btn btn-success btn-full">
                            💰 Fund This Hunt
                        </button>
                    </div>
                </div>

                <div className="card mt-4 animate-slide-up">
                    <h3 className="mb-2">📋 Instructions</h3>
                    <div className="flex flex-col gap-2">
                        <p>1. Download and print the QR code</p>
                        <p>2. Display it prominently at your location</p>
                        <p>3. Fund the hunt with AUSD tokens</p>
                        <p>4. Users scan → earn arrival reward → complete tasks</p>
                        <p>5. Verify tasks and distribute main rewards</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
