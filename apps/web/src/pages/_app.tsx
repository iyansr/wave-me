import '../styles/app.css'
import type { AppProps } from 'next/app'

import { WagmiConfig, createClient, configureChains, goerli } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import { publicProvider } from 'wagmi/providers/public'

const { chains, provider, webSocketProvider } = configureChains([goerli], [publicProvider()])

const wagmiClient = createClient({
  autoConnect: false,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
export default MyApp
