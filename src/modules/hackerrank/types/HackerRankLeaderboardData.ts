import HackerRankLeaderboardDataModel from '@/hackerrank/types/HackerRankLeaderboardDataModel'
import HackerRankLeaderboardContestChallenge from '@/hackerrank/types/HackerRankLeaderboardContestChallenge'

type HackerRankLeaderboardData = {
  contest_challenges: HackerRankLeaderboardContestChallenge[]
  models: HackerRankLeaderboardDataModel[]
}

export default HackerRankLeaderboardData
