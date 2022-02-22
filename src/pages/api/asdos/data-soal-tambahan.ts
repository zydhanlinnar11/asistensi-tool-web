import { availableKelas, isValidKelas } from '@/common/data/Kelas'
import getContestSlugByModulAndKelas, {
  availableModul,
  isValidModul,
} from '@/common/data/PortalPraktikum'
import { AdditionalData } from '@/modules/asdos/types/soal/AdditionalData'
import { getUser } from '@/modules/auth/utils/APIGetUser'
import { NextApiRequest, NextApiResponse } from 'next'

interface HackerRankChallenge {
  model: {
    is_editorial_available: boolean
    author_name: string
  }
}

type Data = {
  status: 'success' | 'fail' | 'error'
  data?: {
    soal: AdditionalData | null
  }
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const slug = req.query['slug']
  const modul = req.query['modul']
  const user = await getUser(req)

  if (
    !user?.kelas ||
    !slug ||
    !modul ||
    Array.isArray(slug) ||
    Array.isArray(modul) ||
    !isValidModul(modul) ||
    !isValidKelas(user.kelas)
  ) {
    res.status(401).send({ status: 'fail', message: 'Unauthenticated.' })
    return
  }

  res.status(200).send({
    status: 'success',
    data: {
      soal: await getDataBySoal(slug, modul, user.kelas),
    },
  })
}

async function getDataBySoal(
  slug: string,
  modul: availableModul,
  kelas: availableKelas
) {
  try {
    const response = await fetch(
      `https://www.hackerrank.com/rest/contests/${getContestSlugByModulAndKelas(
        modul,
        kelas
      )}/challenges/${slug}`
    )

    if (!response.ok) {
      throw new Error()
    }

    const json: HackerRankChallenge = await response.json()
    const { author_name, is_editorial_available } = json.model
    const data: AdditionalData = {
      authorName: author_name,
      isEditorialAvailable: is_editorial_available,
    }

    return data
  } catch (e) {
    return null
  }
}
