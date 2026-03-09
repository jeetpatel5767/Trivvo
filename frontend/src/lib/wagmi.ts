import { http, createConfig } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Using Hardhat local network for development/testing
export const config = createConfig({
    chains: [hardhat],
    connectors: [
        injected(),
    ],
    transports: {
        [hardhat.id]: http('http://127.0.0.1:8545'),
    },
});
