import Header from '@/common/components/elements/Header'
import Markdown from '@/common/components/elements/Markdown'
import SpinnerLoading from '@/common/components/elements/SpinnerLoading'
import mataKuliah from '@/common/data/MataKuliah'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'
import useSoal from '../hooks/useSoal'
import DetailSoal from '../types/soal/DetailSoal'
import EditorialAlert from './DetailSoal/EditorialAlert'
import PrivateRoute from './PrivateRoute'

const DetailSoal: FC = () => {
  const router = useRouter()
  const contestSlug = router.query['contest-slug'] as unknown as string
  const slug = router.query['slug'] as unknown as string

  const { isError, isLoading, soal } = useSoal(contestSlug, slug)

  return (
    <>
      <Head>
        <title>
          {soal ? soal.name : 'Detail Soal'} - {mataKuliah.nama}{' '}
          {mataKuliah.tahunAjar}
        </title>
      </Head>
      <PrivateRoute>
        {isLoading ? (
          <div className="my-auto">
            <SpinnerLoading />
          </div>
        ) : !soal || isError ? (
          <></>
        ) : (
          <>
            <Header
              midText={soal.name}
              bottomText={`Ditulis oleh ${soal.authorUsername}`}
            />
            <div>
              <div className="bg-white/[0.24] h-px w-full"></div>
              <div className={`text-left pb-2 px-2 max-w-full break-words`}>
                <EditorialAlert soal={soal} />
                <h2 className="border-b border-b-white/[0.24] mt-6 mb-4 text-2xl pb-2 font-bold">
                  Description
                </h2>
                <div dangerouslySetInnerHTML={{ __html: soal.bodyHtml }}></div>

                <h2 className="border-b border-b-white/[0.24] mt-6 mb-4 text-2xl pb-2 font-bold">
                  Editorial
                </h2>
                {soal.editorialHtml && (
                  <div
                    className="editorial"
                    dangerouslySetInnerHTML={{ __html: soal.editorialHtml }}
                  ></div>
                )}
                {(!soal.isEditorialAvailable || !soal.editorialHtml) && (
                  <div className="h-40 flex items-center justify-center">
                    <p>Editorial saat ini belum dapat diakses</p>
                  </div>
                )}

                <h2 className="border-b border-b-white/[0.24] mt-6 mb-4 text-2xl pb-2 font-bold">
                  Source code
                </h2>
                {soal.code && <Markdown markdown={soal.code}></Markdown>}
                {(!soal.isEditorialAvailable || !soal.code) && (
                  <div className="h-40 flex items-center justify-center">
                    <p>
                      <em>Source code</em> saat ini belum dapat diakses
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </PrivateRoute>
    </>
  )
}

export default DetailSoal
