import { AdditionalData } from '@/modules/asdos/types/soal/AdditionalData'
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
    approach_markdown?: string
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
  const contestSlug = req.query['contest-slug']
  const user = await getUser(req)

  if (
    // !user?.kelas ||
    !slug ||
    !contestSlug ||
    Array.isArray(slug) ||
    Array.isArray(contestSlug)
  ) {
    res.status(401).send({ status: 'fail', message: 'Unauthenticated.' })
    return
  }

  res.status(200).send({
    status: 'success',
    data: {
      soal: await getDataBySoal(slug, contestSlug),
    },
  })
}

async function getDataBySoal(slug: string, contestSlug: string) {
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
    console.log(hackerrank_editorial)

    const data: DetailSoal = {
      authorUsername: author_name,
      isEditorialAvailable: is_editorial_available,
      bodyHtml: body_html,
      contestSlug: contestSlug,
      name,
      slug,
      code: hackerrank_editorial.model?.setter_code_markdown,
      editorialMarkdown: hackerrank_editorial.model?.approach_markdown,
    }

    return data
  } catch (e) {
    return null
  }
}
