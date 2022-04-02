import { NextApiRequest, NextApiResponse } from 'next'
import getContestSlugByModulAndKelas, {
  isValidModul,
} from '@/common/data/PortalPraktikum'
import { isValidKelas } from '@/common/data/Kelas'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import HackerRankSubmissionModel from '@/modules/hackerrank/types/HackerRankSubmissionModel'
import { getAsdosData } from '@/modules/auth/utils/APIGetUser'
import {
  convertToICPCScoreboardData,
  filterPraktikumOnly,
  getAllHackerName,
  getContestDataFromAPI,
  getScoreboardFromAPI,
} from '@/modules/hackerrank/utils/HackerrankUtil'
import ScoreboardData from '@/modules/icpc/types/ScoreboardData'
import HackerRankLeaderboardDataModel from '@/modules/hackerrank/types/HackerRankLeaderboardDataModel'
import { sortScoreboardData } from '@/modules/icpc/utils/ScoreboardUtils'
import HackerRankLeaderboardContestChallenge from '@/modules/hackerrank/types/HackerRankLeaderboardContestChallenge'

const PENALTY_IN_SECONDS = 20

type Team = {
  [index: string]: {
    hacker: string
    hacker_id: string
    solved_challenges: number
    time_taken: number
    challenges: {
      [index: string]: {
        slug: string
        submissions: number
        time_taken: number
        penalty: number
        isSolved: boolean
      }
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV === 'production') {
    res.status(400).send({ message: 'Only available on dev mode' })
    return
  }

  const modul = req.query.modul
  const kelas = req.query.kelas
  const force = req.query.force
  if (
    typeof modul !== 'string' ||
    !isValidModul(modul) ||
    typeof kelas !== 'string' ||
    !isValidKelas(kelas)
  ) {
    res.status(400).send({ message: 'Invalid request' })
    return
  }

  const slug = getContestSlugByModulAndKelas(modul, kelas)
  const filename = `./public/scoreboard/praktikum/${slug}.json`

  const fileExist = existsSync(filename)
  if (force != 'true' && fileExist) {
    res.send({ message: `Already generated ${filename}` })
    return
  }

  const scoreboard = await getICPCScoreboardData(slug)

  writeFileSync(
    filename,
    JSON.stringify({
      data: scoreboard,
      lastUpdated: new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour12: true,
      }),
    })
  )

  res.send({ message: `Saved to ${filename}` })
}

const getICPCScoreboardData = async (slug: string) => {
  const submissionsFilename = `./public/scoreboard/praktikum/submissions/${slug}.json`
  const allAsdosUsername = await getAllAsdosUserName()
  const data: HackerRankSubmissionModel[] = filterPraktikumOnly(
    removeAsdos(
      JSON.parse(readFileSync(submissionsFilename).toString()),
      allAsdosUsername
    )
  )

  data.sort((a, b) => a.id - b.id)
  const contest = await getContestDataFromAPI(slug)
  const hrScoreboard = await getScoreboardFromAPI(slug, 1)
  hrScoreboard.models = populateModelsFromSubmissions(
    data,
    hrScoreboard.contest_challenges
  )

  const names = await getAllHackerName(hrScoreboard)

  hrScoreboard.models = hrScoreboard.models.map((model) => ({
    ...model,
    hacker: model.hacker in names ? names[model.hacker] : model.hacker,
  }))

  const ICPCScoreboardData = convertToICPCScoreboardData(hrScoreboard, contest)

  return sortScoreboardData(ICPCScoreboardData)
}

const populateModelsFromSubmissions: (
  submissions: HackerRankSubmissionModel[],
  challenges: HackerRankLeaderboardContestChallenge[]
) => HackerRankLeaderboardDataModel[] = (submissions, challenges) => {
  const team: Team = {}

  submissions.forEach(
    ({ challenge, hacker_id, hacker_username, time_from_start, status }) => {
      if (!(hacker_username in team)) {
        team[hacker_username] = {
          challenges: {},
          hacker: hacker_username,
          hacker_id: JSON.stringify(hacker_id),
          solved_challenges: 0,
          time_taken: 0,
        }
        challenges.forEach((challenge) => {
          team[hacker_username].challenges[challenge.slug] = {
            isSolved: false,
            penalty: 0,
            slug: challenge.slug,
            submissions: 0,
            time_taken: 0,
          }
        })
      }
      const isAC = status === 'Accepted'
      team[hacker_username].challenges[challenge.slug].submissions++
      if (!isAC) {
        team[hacker_username].challenges[challenge.slug].penalty +=
          PENALTY_IN_SECONDS
        return
      }
      team[hacker_username].challenges[challenge.slug].isSolved = true
      team[hacker_username].challenges[challenge.slug].time_taken =
        time_from_start * 60
      team[hacker_username].solved_challenges++
      team[hacker_username].time_taken +=
        time_from_start * 60 +
        team[hacker_username].challenges[challenge.slug].penalty
    }
  )

  const models: HackerRankLeaderboardDataModel[] = []
  for (const hrUsername in team) {
    const model: HackerRankLeaderboardDataModel = {
      avatar: null,
      challenges: [],
      country: null,
      school: 'Institut Teknologi Sepuluh Nopember',
      index: 0,
      rank: 0,
      hacker: hrUsername,
      hacker_id: team[hrUsername].hacker_id,
      solved_challenges: team[hrUsername].solved_challenges,
      time_taken: team[hrUsername].time_taken,
    }

    for (const slug in team[hrUsername].challenges) {
      const { penalty, submissions, time_taken } =
        team[hrUsername].challenges[slug]

      model.challenges.push({
        penalty,
        slug,
        submissions,
        time_taken,
      })

      model.challenges.sort((a, b) =>
        getProblemLabelFromSlug(challenges, a.slug) <
        getProblemLabelFromSlug(challenges, b.slug)
          ? -1
          : 1
      )
    }

    models.push(model)
  }
  return models
}

const getProblemLabelFromSlug = (
  challenges: HackerRankLeaderboardContestChallenge[],
  slug: string
) => {
  const challenge = challenges.find((challenge) => challenge.slug === slug)
  if (!challenge) throw Error('invalid problem slug')
  return challenge.letter
}

const removeAsdos: (
  data: HackerRankSubmissionModel[],
  allAsdosUsername: string[]
) => HackerRankSubmissionModel[] = (data, allAsdosUsername) =>
  data.filter(
    (data) =>
      allAsdosUsername.findIndex((elem) => elem === data.hacker_username) === -1
  )

const getAllAsdosUserName: () => Promise<string[]> = async () => {
  const data = await getAsdosData()

  if (!data) throw Error('No asdos data')

  return data.map((asdos) => asdos.hackerrank_username)
}
