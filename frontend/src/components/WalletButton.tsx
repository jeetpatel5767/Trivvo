import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function WalletButton() {
    const { address, isConnected } = useAccount();
    const { connect, connectors, isPending } = useConnect();
    const { disconnect } = useDisconnect();

    if (!isConnected) {
        return (
            <button
                onClick={() => {
                    const connector = connectors.find(c => c.id === 'metaMask')
                        || connectors.find(c => c.id === 'injected')
                        || connectors[0];
                    if (connector) connect({ connector });
                }}
                disabled={isPending}
                className="btn btn-primary btn-sm"
            >
                {isPending ? '⏳...' : '🔗 Connect'}
            </button>
        );
    }

    return (
        <div className="flex gap-2 items-center">
            <span className="wallet-address" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
                {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''}
            </span>
            <button onClick={() => disconnect()} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                ✕
            </button>
        </div>
    );
}
