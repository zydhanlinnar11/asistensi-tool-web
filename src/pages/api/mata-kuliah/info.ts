import MataKuliah from '@/common/types/MataKuliah'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MataKuliah>
) {
  res.status(200).send({ nama: 'Struktur Data', tahunAjar: 2022 })
}
