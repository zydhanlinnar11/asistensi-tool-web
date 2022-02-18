import Header from '@/common/components/elements/Header'
import SpinnerLoading from '@/common/components/elements/SpinnerLoading'
import { useUser } from '@/modules/auth/providers/UserProvider'
import Head from 'next/head'
import React, { FC } from 'react'
import useDaftarSoal from '@/modules/asdos/hooks/useDaftarSoal'
import PrivateRoute from '@/modules/asdos/components/PrivateRoute'
import DaftarSoalCard from './DaftarSoalCard'
import mataKuliah from '@/common/data/MataKuliah'

const DaftarSoal: FC = () => {
  const { user } = useUser()
  const { daftarSoal, isError, isLoading } = useDaftarSoal()

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
        {isLoading ? (
          <div className="my-auto">
            <SpinnerLoading />
          </div>
        ) : isError ? (
          <div className="my-auto text-center">
            <h1 className="text-4xl">Terdapat kesalahan</h1>
            <p className="mt-3 text-gray-400">Silahkan refresh halaman ini</p>
          </div>
        ) : daftarSoal?.length === 0 ? (
          <div className="my-auto text-center">
            <h1 className="text-4xl">Tidak ada soal</h1>
            <p className="mt-3 text-gray-400">
              Belum ada soal / praktikum di kelas ini
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-5">
            {daftarSoal?.map((soal) => (
              <DaftarSoalCard soal={soal} key={soal.slug} />
            ))}
          </div>
        )}
      </PrivateRoute>
    </div>
  )
}
export default DaftarSoal
