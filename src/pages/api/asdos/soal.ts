import Soal from '@/modules/asdos/types/Soal'
import { getUser } from '@/modules/auth/utils/APIGetUser'
import { NextApiRequest, NextApiResponse } from 'next'

// TODO: sesuaikan sama kelasnya

interface HackerRankLeaderboardChallenge {
  name: string
  slug: string
  color?: string
  letter: string
}

type Data = {
  status: 'success' | 'fail' | 'error'
  data?: {
    soal: Soal[] | null
  }
  message?: string
}

const FINAL_SLUG = 'dasprog-fp-2021'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await getUser(req)

  if (!user?.kelas) {
    res.status(401).send({ status: 'fail', message: 'Unauthenticated.' })
    return
  }

  res.status(200).send({
    status: 'success',
    data: {
      soal: await getDaftarSoalSemuaModul(user.kelas),
    },
  })
}

async function getDaftarSoalSemuaModul(kelas: string) {
  const ret: Soal[] = []

  ret.push(...(await getDaftarSoalByModul(`sd${kelas}-m4-2021`, '4')))

  return [...ret, ...(await getDaftarSoalByModul(FINAL_SLUG, 'final'))]
}

async function getDaftarSoalByModul(
  slug: string,
  modul: '1' | '2' | '3' | '4' | 'final'
) {
  const ret: Soal[] = []

  try {
    const response = await fetch(
      `https://www.hackerrank.com/rest/contests/${slug}/leaderboard`
    )
    const json = await response.json()

    if (!response.ok) {
      throw new Error()
    }

    const contest_challenges: HackerRankLeaderboardChallenge[] =
      json['contest_challenges']

    contest_challenges.forEach((challenge) =>
      ret.push({
        slug: challenge.slug,
        name: challenge.name,
        modul,
        contestSlug: slug,
      })
    )
    return ret
  } catch (e) {
    return ret
  }
}
