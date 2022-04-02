import HackerRankLeaderboardData from '@/hackerrank/types/HackerRankLeaderboardData'
import HackerRankContest from '@/hackerrank/types/HackerRankContest'
import ScoreboardData from '@/icpc/types/ScoreboardData'
import HackerRankSubmissionModel from '@/hackerrank/types/HackerRankSubmissionModel'
import HackerRankSubmission from '@/hackerrank/types/HackerRankSubmission'

type GetScoreboardFromAPI = (
  contestSlug: string,
  paginationLimit?: number
) => Promise<HackerRankLeaderboardData>

type GetContestDataFromAPI = (contestSlug: string) => Promise<HackerRankContest>

type ConvertToICPCScoreboardData = (
  data: HackerRankLeaderboardData,
  contest: HackerRankContest
) => ScoreboardData

export const getScoreboardFromAPI: GetScoreboardFromAPI = async (
  contestSlug,
  paginationLimit = 100
) => {
  const res = await fetch(
    `https://www.hackerrank.com/rest/contests/${contestSlug}/leaderboard?limit=${paginationLimit}`
  )
  const json = await res.json()

  return json
}

export const getContestDataFromAPI: GetContestDataFromAPI = async (
  contestSlug
) => {
  const res = await fetch(
    `https://www.hackerrank.com/rest/contests/${contestSlug}`
  )
  const json = await res.json()

  return json.model
}

export const compileAllPagesModels: (
  slug: string,
  token: string
) => Promise<HackerRankSubmissionModel[]> = async (slug, token) => {
  const pagesCount = await getSubmissionNumberOfPages(slug, token)
  const ret: HackerRankSubmissionModel[] = []
  for (let i = 0; i < pagesCount; i++) {
    const submissions = await getSubmissions(slug, token, i * 10)
    ret.push(...submissions.models)
  }

  return ret
}

export const filterPraktikumOnly: (
  submissions: HackerRankSubmissionModel[]
) => HackerRankSubmissionModel[] = (submissions) => {
  const PRAKTIKUM_DURATION_IN_MINUTES = 1440

  return submissions.filter(
    ({ in_contest_bounds, time_from_start }) =>
      in_contest_bounds && time_from_start <= PRAKTIKUM_DURATION_IN_MINUTES
  )
}

const getSubmissions: (
  slug: string,
  token: string,
  offset: number
) => Promise<HackerRankSubmission> = async (slug, token, offset) => {
  const res = await fetch(
    `https://www.hackerrank.com/rest/contests/${slug}/judge_submissions?limit=10&offset=${offset}`,
    {
      headers: {
        Cookie: `remember_hacker_token=${token}`,
      },
    }
  )
  const json: HackerRankSubmission = await res.json()
  return json
}

const getSubmissionNumberOfPages: (
  slug: string,
  token: string
) => Promise<number> = async (slug, token) => {
  const res = await fetch(
    `https://www.hackerrank.com/rest/contests/${slug}/judge_submissions?limit=10&offset=0`,
    {
      headers: {
        Cookie: `remember_hacker_token=${token}`,
      },
    }
  )

  const json: HackerRankSubmission = await res.json()
  const total: number = json.total

  return Math.ceil(total / 10)
}

export const convertToICPCScoreboardData: ConvertToICPCScoreboardData = (
  data,
  contest
) => {
  const { contest_challenges, models } = data

  return {
    contest: {
      name: contest.name,
      startTime: contest.get_starttimeiso,
      endTime: contest.get_endtimeiso,
    },
    problems: contest_challenges.map(({ letter, name, slug }) => ({
      label: letter,
      name,
    })),
    teams: models.map(
      ({
        hacker_id,
        hacker,
        challenges,
        solved_challenges,
        time_taken,
        school,
      }) => ({
        id: hacker_id,
        institution: {
          name: school ?? '-',
        },
        name: hacker,
        problems: challenges.map(
          ({ penalty, slug, submissions, time_taken }) => {
            const isSolved = submissions > 0 && time_taken > 0

            return {
              problem: {
                name: slug,
                label: slug,
              },
              tryCount: submissions,
              pendingCount: 0,
              isSolved,
              firstToSolve: false,
              time: !isSolved ? null : Math.round(time_taken / 60),
            }
          }
        ),
        score: {
          penalty: Math.round(time_taken / 60),
          solvedCount: solved_challenges,
        },
      })
    ),
  }
}

export const getHackerName: (username: string) => Promise<string> = async (
  username
) => {
  const res = await fetch(
    `https://www.hackerrank.com/rest/contests/master/hackers/${username}/profile`
  )
  const json = await res.json()

  return json.model.name
}

export const getAllHackerName: (
  data: HackerRankLeaderboardData
) => Promise<{ [index: string]: string }> = async (data) => {
  const { models } = data
  const ret: { [index: string]: string } = {}
  for (let i = 0; i < models.length; i++) {
    ret[models[i].hacker] = await getHackerName(models[i].hacker)
  }

  return ret
}
