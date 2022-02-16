import Header from '@/common/components/elements/Header'
import MataKuliah from '@/common/types/MataKuliah'
import { useUser } from '@/modules/auth/providers/UserProvider'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { FC } from 'react'
import PrivateRoute from './PrivateRoute'

type Props = {
  mataKuliah: MataKuliah
}

const DaftarSoal: FC<Props> = ({ mataKuliah }) => {
  const { user } = useUser()

  return (
    <>
      <Head>
        <title>
          Daftar Soal - {mataKuliah.nama} {mataKuliah.tahunAjar}
        </title>
      </Head>
      <PrivateRoute>
        <Header
          midText="Daftar Soal"
          bottomText={`${mataKuliah.nama} ${user?.kelas} ${mataKuliah.tahunAjar}`}
        ></Header>
      </PrivateRoute>
    </>
  )
}
export default DaftarSoal

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/mata-kuliah/info`)
  const mataKuliah: MataKuliah = await res.json()
  console.log(mataKuliah)

  return {
    props: {
      mataKuliah,
    },
  }
}
