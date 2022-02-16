import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Header from '@/common/components/elements/Header'
import { useUser } from '@/modules/auth/providers/UserProvider'
import PrivateRoute from './PrivateRoute'
import Link from 'next/link'
import Card from '@/common/components/elements/Card'

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
          bottomText={`Selamat datang asisten kelas ${user?.kelas}, ${user?.name} (${user?.nrp})!`}
        />

        <div className="text-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-12 mb-14">
          <Card
            href="/asdos/daftar-soal"
            title="Daftar soal"
            description={`Lihat soal-soal pada praktikum kelas ${user?.kelas}.`}
          />
        </div>
      </div>
    </PrivateRoute>
  )
}

export default Dashboard
