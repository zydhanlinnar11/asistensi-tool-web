type HackerRankSubmissionModel = {
  id: number
  hacker_id: number
  status: string
  hacker_username: string
  in_contest_bounds: boolean
  time_from_start: number
  challenge: {
    name: string
    slug: string
  }
}

export default HackerRankSubmissionModel
