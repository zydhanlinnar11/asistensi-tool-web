import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/common/components/elements/Navbar'
import Footer from '@/common/components/elements/Footer'
import UserProvider from '@/modules/auth/providers/UserProvider'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <UserProvider>
        <Navbar />
        <main className="flex flex-col mx-auto grow w-full max-w-5xl px-6">
          <Component {...pageProps} />
        </main>
        <Footer />
      </UserProvider>
    </div>
  )
}

export default MyApp
