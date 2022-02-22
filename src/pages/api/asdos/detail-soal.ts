import { availableKelas, isValidKelas } from '@/common/data/Kelas'
import getContestSlugByModulAndKelas, {
  availableModul,
  isValidModul,
} from '@/common/data/PortalPraktikum'
import DetailSoal from '@/modules/asdos/types/soal/DetailSoal'
import { getUser } from '@/modules/auth/utils/APIGetUser'
import { NextApiRequest, NextApiResponse } from 'next'

interface HackerRankDetailSoal {
  model: {
    is_editorial_available: boolean
    author_name: string
    slug: string
    name: string
    contest_slug: string
    body_html: string
  }
}

interface HackerRankEditorial {
  model?: {
    approach?: string
    setter_code_markdown?: string
  }
}

type Data = {
  status: 'success' | 'fail' | 'error'
  data?: {
    soal: DetailSoal | null
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
  const contestSlug = getContestSlugByModulAndKelas(modul, kelas)
  try {
    const response = await fetch(
      `https://www.hackerrank.com/rest/contests/${contestSlug}/challenges/${slug}`
    )

    if (!response.ok) {
      throw new Error()
    }

    const detail_soal: HackerRankDetailSoal = await response.json()
    const { author_name, is_editorial_available, body_html, name } =
      detail_soal.model

    const responseEditorial = await fetch(
      `https://www.hackerrank.com/rest/contests/${contestSlug}/challenges/${slug}/editorial`
    )

    if (!responseEditorial.ok) {
      throw new Error()
    }

    const hackerrank_editorial: HackerRankEditorial =
      await responseEditorial.json()

    const data: DetailSoal = {
      authorUsername: author_name,
      isEditorialAvailable: is_editorial_available,
      bodyHtml: body_html,
      name,
      slug,
      code: hackerrank_editorial.model?.setter_code_markdown,
      editorialHtml: hackerrank_editorial.model?.approach,
    }

    return data
  } catch (e) {
    return null
  }
}
