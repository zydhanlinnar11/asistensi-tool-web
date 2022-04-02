import Team from '@/icpc/types/Team'
import Problem from '@/icpc/types/Problem'
import Contest from '@/icpc/types/Contest'

type ScoreboardData = {
  contest: Contest
  teams: Team[]
  problems: Problem[]
}

export default ScoreboardData
