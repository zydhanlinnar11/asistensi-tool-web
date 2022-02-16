import Header from '@/common/components/elements/Header'
import SpinnerLoading from '@/common/components/elements/SpinnerLoading'
import MataKuliah from '@/common/types/MataKuliah'
import { useUser } from '@/modules/auth/providers/UserProvider'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { FC } from 'react'
import useDaftarSoal from '@/modules/asdos/hooks/useDaftarSoal'
import PrivateRoute from '@/modules/asdos/components/PrivateRoute'

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
              <div
                key={soal.slug}
                className="border border-white/20 hover:border-white/50 shadow rounded-md p-4 w-full mx-auto"
              >
                <div className="flex space-x-4">
                  <div className="text-center flex items-center">
                    <h2 className="text-xl w-16">{soal.modul.toUpperCase()}</h2>
                  </div>
                  <div className="flex-1 space-y-6 py-1">
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="col-span-1 sm:col-span-2 flex flex-col gap-y-3">
                          <p>{soal.name}</p>
                          <div className="h-2 bg-slate-700 rounded animate-pulse"></div>
                        </div>
                        <div className="col-span-1 h-full flex items-center justify-start sm:justify-end">
                          <p className="text-red-500">Belum ada editorial</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PrivateRoute>
    </div>
  )
}
export default DaftarSoal

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/mata-kuliah/info`)
  const mataKuliah: MataKuliah = await res.json()

  return {
    props: {
      mataKuliah,
    },
  }
}
