import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Header from '@/common/components/elements/Header'
import { useUser } from '@/modules/auth/providers/UserProvider'
import PrivateRoute from '@/common/components/PrivateRoute'

const Dashboard: NextPage = () => {
  const { user } = useUser()

  return (
    <PrivateRoute>
      <div>
        <Head>
          <title>Dashboard Asisten - Struktur Data 2022</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header
          midText={`Dashboard Asisten`}
          bottomText={`Selamat datang, ${user?.name}!`}
        />

        <div className="text-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-12 mb-14">
          <a
            href="https://nextjs.org/docs"
            className="hover:text-sky-300 hover:border-sky-300
            focus:text-sky-300 focus:border-sky-300
            active:text-sky-300 active:border-sky-300
             m-4 p-6 text-left text-inherit border border-gray-50 rounded-[10px] transition-colors duration-150"
          >
            <h2 className="m-0 mb-4 text-2xl">Documentation &rarr;</h2>
            <p className="m-0 text-xl">
              Find in-depth information about Next.js features and API.
            </p>
          </a>
        </div>
      </div>
    </PrivateRoute>
  )
}

export default Dashboard
