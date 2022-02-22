import { availableKelas, isValidKelas } from '@/common/data/Kelas'
import getContestSlugByModulAndKelas, {
  availableModul,
} from '@/common/data/PortalPraktikum'
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await getUser(req)

  if (!user?.kelas || !isValidKelas(user.kelas)) {
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

async function getDaftarSoalSemuaModul(kelas: availableKelas) {
  const ret: Soal[] = []

  ret.push(
    ...(await getDaftarSoalByModul(
      getContestSlugByModulAndKelas('1', kelas),
      '1'
    ))
  )

  ret.push(
    ...(await getDaftarSoalByModul(
      getContestSlugByModulAndKelas('2', kelas),
      '2'
    ))
  )

  ret.push(
    ...(await getDaftarSoalByModul(
      getContestSlugByModulAndKelas('3', kelas),
      '3'
    ))
  )

  ret.push(
    ...(await getDaftarSoalByModul(
      getContestSlugByModulAndKelas('4', kelas),
      '4'
    ))
  )

  ret.push(
    ...(await getDaftarSoalByModul(
      getContestSlugByModulAndKelas('final', kelas),
      'final'
    ))
  )

  return ret
}

async function getDaftarSoalByModul(slug: string, modul: availableModul) {
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
      })
    )
    return ret
  } catch (e) {
    return ret
  }
}
