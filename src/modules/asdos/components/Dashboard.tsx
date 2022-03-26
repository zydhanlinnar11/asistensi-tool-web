import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '@/common/components/elements/Header'
import { useUser } from '@/modules/auth/providers/UserProvider'
import PrivateRoute from './PrivateRoute'
import Card from '@/common/components/elements/Card'
import mataKuliah from '@/common/data/MataKuliah'

const Dashboard: NextPage = () => {
  const { user } = useUser()

  return (
    <PrivateRoute>
      <div>
        <Head>
          <title>
            Dashboard Asisten - {mataKuliah.nama} {mataKuliah.tahunAjar}
          </title>
        </Head>

        <Header
          midText={`Dashboard Asisten`}
          bottomText={`Selamat datang asisten kelas ${user?.kelas?.toUpperCase()}, ${
            user?.name
          } (${user?.nrp})!`}
        />

        <div className="text-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-12 mb-14">
          <Card
            href="/asdos/soal"
            title="Daftar soal"
            description={`Lihat soal-soal pada praktikum kelas ${user?.kelas?.toUpperCase()}.`}
          />
        </div>
      </div>
    </PrivateRoute>
  )
}

export default Dashboard
