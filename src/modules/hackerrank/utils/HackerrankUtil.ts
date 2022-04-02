import HackerRankLeaderboardData from '@/hackerrank/types/HackerRankLeaderboardData'
import HackerRankContest from '@/hackerrank/types/HackerRankContest'
import ScoreboardData from '@/icpc/types/ScoreboardData'

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
            const isSolved = submissions > 0 && (penalty > 0 || time_taken > 0)

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
