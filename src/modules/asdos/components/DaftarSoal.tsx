import Header from '@/common/components/elements/Header'
import SpinnerLoading from '@/common/components/elements/SpinnerLoading'
import MataKuliah from '@/common/types/MataKuliah'
import { useUser } from '@/modules/auth/providers/UserProvider'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { FC } from 'react'
import useDaftarSoal from '@/modules/asdos/hooks/useDaftarSoal'
import PrivateRoute from '@/modules/asdos/components/PrivateRoute'
import Soal from '../types/Soal'
import DaftarSoalCard from './DaftarSoalCard'

type Props = {
  mataKuliah: MataKuliah
}

const DaftarSoal: FC<Props> = ({ mataKuliah }) => {
  const { user } = useUser()
  const daftarSoal = useDaftarSoal()

  return (
    <div>
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
        {daftarSoal === undefined ? (
          <div className="my-auto">
            <SpinnerLoading />
          </div>
        ) : daftarSoal.length === 0 ? (
          <div className="my-auto text-center">
            <h1 className="text-4xl">Tidak ada soal</h1>
            <p className="mt-3 text-gray-400">
              Belum ada soal / praktikum di kelas ini
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {daftarSoal.map((soal) => (
              <DaftarSoalCard soal={soal} key={soal.slug} />
            ))}
          </div>
        )}
      </PrivateRoute>
    </div>
  )
}
export default DaftarSoal

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
