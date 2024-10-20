'use client'

import React from 'react'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, mainnet, optimism, anvil } from 'wagmi/chains'
import { http, createConfig } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'
import '@rainbow-me/rainbowkit/styles.css'

// const config = getDefaultConfig({
//   appName: 'blog',
//   projectId: 'a60155477140bb3311aa47cbae29e423',
//   chains: [base, mainnet, optimism],
//   ssr: true,
// })
const projectId = 'a60155477140bb3311aa47cbae29e423'
const config = createConfig({
  chains: [mainnet, base, optimism, anvil],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    // metaMask(),
    // safe(),
  ],
  transports: {
    [anvil.id]: http(),
    [mainnet.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
  },
})

const queryClient = new QueryClient()

export default function WagmiConfigProvider(props: { children?: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{props.children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
