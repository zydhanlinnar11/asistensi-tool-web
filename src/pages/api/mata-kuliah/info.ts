import { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  mataKuliah: string
  tahunAjar: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).send({ mataKuliah: 'Struktur Data', tahunAjar: 2022 })
}
