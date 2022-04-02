import Institution from '@/icpc/types/Institution'
import TeamProblem from '@/icpc/types/TeamProblem'
import TeamScore from '@/icpc/types/TeamScore'

type Team = {
  id: string
  name: string
  institution: Institution
  problems: TeamProblem[]
  score: TeamScore
}

export default Team
