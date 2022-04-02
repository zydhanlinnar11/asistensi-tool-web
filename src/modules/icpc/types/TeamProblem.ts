import Problem from '@/icpc/types/Problem'

type TeamProblem = {
  problem: Problem
  tryCount: number
  pendingCount: number
  isSolved: boolean
  firstToSolve: boolean
  time: number | null
}

export default TeamProblem
