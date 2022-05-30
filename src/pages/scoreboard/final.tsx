import ICPCScoreboardTable from '@/icpc/components/elements/ICPCScoreboardTable'
import ScoreboardData from '@/icpc/types/ScoreboardData'
import { GetStaticProps } from 'next'
import { FC, useEffect } from 'react'
import getContestSlugByModulAndKelas from '@/common/data/PortalPraktikum'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import {
  convertToICPCScoreboardData,
  getAllHackerName,
  getContestDataFromAPI,
  getScoreboardFromAPI,
} from '@/modules/hackerrank/utils/HackerrankUtil'

type Props = {
  data: ScoreboardData
  lastUpdated: string
}

const PraktikumScoreboard: FC<Props> = ({ data, lastUpdated }) => {
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/scoreboard/[modul]/[kelas]/[session]')
  })

  return (
    <>
      <NextSeo
        title={`Scoreboard ${data.contest.name}`}
        description={`Scoreboard ${data.contest.name}`}
        openGraph={{
          title: `Scoreboard ${data.contest.name}`,
          images: [
            {
              url: 'https://zydhan.xyz/logo.webp',
              height: 1080,
              width: 1080,
              alt: 'Animated photo of Zydhan Linnar Putra',
            },
          ],
          locale: 'id-ID',
        }}
      />
      <header
        style={{
          textAlign: 'center',
          paddingTop: '48px',
          paddingBottom: '48px',
        }}
      >
        <h1 className="text-2xl font-semibold">
          {data ? data.contest.name : 'Loading'}
        </h1>
        <p className="text-slate-400 mt-2">Last updated: {lastUpdated}</p>
      </header>
      <main className="max-w-full">
        <div className="w-fit mx-auto">
          <ICPCScoreboardTable
            problems={data ? data.problems : []}
            teams={data ? data.teams : []}
          />
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const slug = getContestSlugByModulAndKelas('final', 'a')

    const scoreboard = await getScoreboardFromAPI(slug, 100)
    const contest = await getContestDataFromAPI(slug)
    const names = await getAllHackerName(scoreboard)
    scoreboard.models = scoreboard.models.map((model) => ({
      ...model,
      hacker: model.hacker in names ? names[model.hacker] : model.hacker,
      school: 'Institut Teknologi Sepuluh Nopember',
    }))

    const lastUpdated = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour12: true,
    })
    const data = {
      data: convertToICPCScoreboardData(scoreboard, contest),
      lastUpdated,
    }

    return {
      props: { ...data },
      revalidate: 600,
    }
  } catch (e) {
    return { notFound: true }
  }
}

export default PraktikumScoreboard
