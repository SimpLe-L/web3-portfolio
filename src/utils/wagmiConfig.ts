import { http, createConfig } from '@wagmi/core'
import { sepolia } from '@wagmi/core/chains'
export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/-SRymV4bA08HcL1DulqFxNPTgMftEopr")
    // [sepolia.id]: http()
  },
})