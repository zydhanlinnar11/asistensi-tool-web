import ScoreboardData from '@/icpc/types/ScoreboardData'

type SortScoreboardData = (scoreboardData: ScoreboardData) => ScoreboardData

export const sortScoreboardData: SortScoreboardData = (scoreboardData) => {
  const { teams } = scoreboardData

  return {
    ...scoreboardData,
    teams: teams.sort((a, b) => {
      const scoreDiff = b.score.solvedCount - a.score.solvedCount
      if (scoreDiff !== 0) return scoreDiff

      return a.score.penalty - b.score.penalty
    }),
  }
}
