import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/common/components/elements/Navbar'
import Footer from '@/common/components/elements/Footer'
import UserProvider from '@/modules/auth/providers/UserProvider'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <UserProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </UserProvider>
    </>
  )
}

export default MyApp
