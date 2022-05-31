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
import db from '@/modules/icpc/utils/db'

type Props = {
  data: ScoreboardData
  lastUpdated: string
  prevRank: { [key: string]: number }
}

const PraktikumScoreboard: FC<Props> = ({ data, lastUpdated, prevRank }) => {
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
        <p className="text-slate-400 mt-2">
          Updated every 10 minutes (sorry for bad CSS skill, XD)
        </p>
      </header>
      <ICPCScoreboardTable
        problems={data ? data.problems : []}
        teams={data ? data.teams : []}
        prevRank={prevRank}
      />
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

    const { problems } = data.data
    const problemsFirstSolverTime: { [key: string]: number } = {}
    problems.forEach((problem, index) => {
      const teams = [...data.data.teams]
      problemsFirstSolverTime[index] =
        teams.sort((a, b) => {
          const aTime = a.problems[index].time || 1000000000
          const bTime = b.problems[index].time || 1000000000
          return aTime - bTime
        })[0].problems[index].time ?? -1
    })

    const prevRank: { [key: string]: number } = {}
    const batch = db.batch()
    ;(await db.collection('ds_2022_scoreboard_last_rank').get()).docs.forEach(
      (doc) => {
        prevRank[doc.data().id] = doc.data().rank
        batch.delete(doc.ref)
      }
    )

    data.data.teams.forEach((team, rank) => {
      team.problems.forEach((problem, index) => {
        problem.firstToSolve = problemsFirstSolverTime[index] === problem.time
      })
      const docRef = db.collection('ds_2022_scoreboard_last_rank').doc()
      batch.set(docRef, { id: team.id, rank })
    })
    batch.commit().catch((e) => console.error(e))

    return {
      props: {
        ...data,
        prevRank,
      },
      revalidate: 600,
    }
  } catch (e) {
    return { notFound: true }
  }
}

export default PraktikumScoreboard
