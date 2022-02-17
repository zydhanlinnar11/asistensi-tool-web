import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Header from '@/common/components/elements/Header'
import { useUser } from '@/modules/auth/providers/UserProvider'
import PrivateRoute from './PrivateRoute'
import Card from '@/common/components/elements/Card'
import MataKuliah from '@/common/types/MataKuliah'

type Props = {
  mataKuliah: MataKuliah
}

const Dashboard: NextPage<Props> = ({ mataKuliah }) => {
  const { user } = useUser()

  return (
    <PrivateRoute>
      <div>
        <Head>
          <title>
            Dashboard Asisten - {mataKuliah.nama} {mataKuliah.tahunAjar}
          </title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header
          midText={`Dashboard Asisten`}
          bottomText={`Selamat datang asisten kelas ${user?.kelas}, ${user?.name} (${user?.nrp})!`}
        />

        <div className="text-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-12 mb-14">
          <Card
            href="/asdos/soal"
            title="Daftar soal"
            description={`Lihat soal-soal pada praktikum kelas ${user?.kelas}.`}
          />
        </div>
      </div>
    </PrivateRoute>
  )
}

export default Dashboard

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/mata-kuliah/info`
  )
  const mataKuliah: MataKuliah = await res.json()

  return {
    props: {
      mataKuliah,
    },
  }
}
