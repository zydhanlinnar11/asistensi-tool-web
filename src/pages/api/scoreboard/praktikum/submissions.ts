import { NextApiRequest, NextApiResponse } from 'next'
import { compileAllPagesModels } from '@/hackerrank/utils/HackerrankUtil'
import getContestSlugByModulAndKelas, {
  isValidModul,
} from '@/common/data/PortalPraktikum'
import { isValidKelas } from '@/common/data/Kelas'
import { existsSync, writeFileSync } from 'fs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV === 'production') {
    res.status(400).send({ message: 'Only available on dev mode' })
    return
  }

  const modul = req.query.modul
  const kelas = req.query.kelas
  const token = req.query.token
  const force = req.query.force
  if (
    typeof modul !== 'string' ||
    !isValidModul(modul) ||
    typeof kelas !== 'string' ||
    !isValidKelas(kelas) ||
    typeof token !== 'string'
  ) {
    res.status(400).send({ message: 'Invalid request' })
    return
  }

  const slug = getContestSlugByModulAndKelas(modul, kelas)
  const filename = `./public/scoreboard/praktikum/submissions/${slug}.json`

  const fileExist = existsSync(filename)
  if (force != 'true' && fileExist) {
    res.send({ message: `Already generated ${filename}` })
    return
  }
  const data = await compileAllPagesModels(slug, token)

  writeFileSync(filename, JSON.stringify(data))

  res.send({ message: `Saved to ${filename}` })
}
