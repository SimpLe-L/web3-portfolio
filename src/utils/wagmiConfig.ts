import { http, createConfig } from '@wagmi/core'
import { sepolia } from '@wagmi/core/chains'
export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_ALCHEMY_SEPOLIA)
    // [sepolia.id]: http()
  },
})