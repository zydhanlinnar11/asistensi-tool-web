import Header from '@/common/components/elements/Header'
import Markdown from '@/common/components/elements/Markdown'
import MataKuliah from '@/common/types/MataKuliah'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import React, { FC, useState } from 'react'
import DetailSoal from '../types/soal/DetailSoal'
import PrivateRoute from './PrivateRoute'

type Props = {
  mataKuliah: MataKuliah
  detailSoal: DetailSoal
}

const DetailSoal: FC<Props> = ({ mataKuliah, detailSoal }) => {
  const [soal, setSoal] = useState<DetailSoal>(detailSoal)

  return (
    <>
      <Head>
        <title>
          {detailSoal.name} - {mataKuliah.nama} {mataKuliah.tahunAjar}
        </title>
      </Head>
      <PrivateRoute>
        <Header
          midText={soal.name}
          bottomText={`Ditulis oleh ${soal.authorUsername}`}
        ></Header>
        <div>
          <div className="bg-white/[0.24] h-px w-full"></div>
          {!soal.isEditorialAvailable && (
            <div
              className="flex gap-x-2 py-2 px-4 rounded-md
            text-red-500 bg-red-300/[0.15] mt-4"
            >
              <FontAwesomeIcon
                className="my-auto"
                icon={faCircleExclamation}
              ></FontAwesomeIcon>
              <p>
                Soal ini belum memiliki editorial, mohon menambahkan editorial
              </p>
            </div>
          )}
          <div className={`text-left pb-2 px-2 max-w-full break-words`}>
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
      </PrivateRoute>
    </>
  )
}

export default DetailSoal

export const getStaticProps: GetStaticProps = async (req) => {
  const contestSlug = req.params?.['contest-slug']
  const slug = req.params?.['slug']

  if (typeof slug !== 'string' || typeof contestSlug !== 'string')
    return {
      notFound: true,
    }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/mata-kuliah/info`
  )
  const mataKuliah: MataKuliah = await res.json()

  const resDetailSoal = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/asdos/detail-soal?contest-slug=${contestSlug}&slug=${slug}`
  )
  const detailSoal: DetailSoal = (await resDetailSoal.json()).data.soal
  if (!resDetailSoal.ok || !detailSoal) return { notFound: true }

  return {
    props: {
      mataKuliah,
      detailSoal,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
