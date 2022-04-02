type HackerRankLeaderboardDataModel = {
  rank: number
  hacker_id: string
  solved_challenges: number
  time_taken: number
  challenges: {
    slug: string
    submissions: number
    time_taken: number
    penalty: number
  }[]
  index: number
  hacker: string
  avatar: string | null
  country: string | null
  school: string | null
}

export default HackerRankLeaderboardDataModel
