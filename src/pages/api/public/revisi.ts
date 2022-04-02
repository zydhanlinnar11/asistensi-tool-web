import { NextApiRequest, NextApiResponse } from 'next'
import {
  convertToICPCScoreboardData,
  getAllHackerName,
  getContestDataFromAPI,
  getScoreboardFromAPI,
} from '@/hackerrank/utils/HackerrankUtil'
import getContestSlugByModulAndKelas, {
  isValidModul,
} from '@/common/data/PortalPraktikum'
import { isValidKelas } from '@/common/data/Kelas'
import { writeFileSync } from 'fs'

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
  if (
    typeof modul !== 'string' ||
    !isValidModul(modul) ||
    typeof kelas !== 'string' ||
    !isValidKelas(kelas)
  ) {
    res.status(400).send({ message: 'Invalid request' })
    return
  }

  const slug = getContestSlugByModulAndKelas(modul, kelas)
  const scoreboard = await getScoreboardFromAPI(slug, 100)
  const contest = await getContestDataFromAPI(slug)
  const names = await getAllHackerName(scoreboard)
  scoreboard.models = scoreboard.models.map((model) => ({
    ...model,
    hacker: model.hacker in names ? names[model.hacker] : model.hacker,
    school: 'Institut Teknologi Sepuluh Nopember',
  }))

  const lastUpdated = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour12: true,
  })
  const data = {
    data: convertToICPCScoreboardData(scoreboard, contest),
    lastUpdated,
  }
  const filename = `./public/scoreboard/revisi/${slug}.json`
  writeFileSync(filename, JSON.stringify(data))

  res.send({ message: `Saved to ${filename}` })
}
