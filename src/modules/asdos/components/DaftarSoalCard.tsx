import React, { FC, useEffect, useState } from 'react'
import Soal from '@/modules/asdos/types/Soal'
import { AdditionalData } from '@/modules/asdos/types/soal/AdditionalData'
import Link from 'next/link'

interface Props {
  soal: Soal
}

const DaftarSoalCard: FC<Props> = ({ soal }) => {
  const [soalLengkap, setSoalLengkap] = useState<Soal>(soal)

  async function getAdditionalData() {
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/asdos/data-soal-tambahan`
      )
      url.searchParams.append('contest-slug', soal.contestSlug)
      url.searchParams.append('slug', soal.slug)

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) throw new Error()

      const json: AdditionalData = (await response.json())['data']['soal']
      const { contestSlug, modul, name, slug } = soal
      setSoalLengkap({
        contestSlug,
        modul,
        name,
        slug,
        isEditorialAvailable: json.isEditorialAvailable,
        authorEmail: json.authorName,
      })
    } catch (e) {}
  }

  useEffect(() => {
    getAdditionalData()
  }, [])

  return (
    <Link href={`/asdos/praktikum/${soal.contestSlug}/${soal.slug}`}>
      <a className="border border-white/20 hover:border-white/50 shadow rounded-md p-4 w-full mx-auto">
        <div className="flex space-x-4">
          <div className="text-center flex items-center">
            <h2 className="text-xl w-16">{soalLengkap.modul.toUpperCase()}</h2>
          </div>
          <div className="flex-1 space-y-6 py-1">
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="col-span-1 sm:col-span-2 flex flex-col gap-y-1">
                  <p>{soalLengkap.name}</p>
                  {soalLengkap.authorEmail === undefined ? (
                    <div className="h-2 bg-slate-700 rounded animate-pulse"></div>
                  ) : soalLengkap.authorEmail ? (
                    <small className="text-gray-500">
                      {soalLengkap.authorEmail}
                    </small>
                  ) : (
                    <small className="text-red-500">
                      Gagal mendapatkan data pembuat soal
                    </small>
                  )}
                </div>
                <div className="col-span-1 h-full flex items-center justify-start sm:justify-end">
                  <p>
                    {soalLengkap.isEditorialAvailable === undefined ? (
                      <span className="block h-2 w-32 bg-slate-700 rounded animate-pulse"></span>
                    ) : soalLengkap.isEditorialAvailable ? (
                      <span className="text-green-500">Ada editorial</span>
                    ) : (
                      <span className="text-red-500">Belum ada editorial</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default DaftarSoalCard
