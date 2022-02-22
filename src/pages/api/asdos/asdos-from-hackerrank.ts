import { isValidKelas } from '@/common/data/Kelas'
import {
  getAsdosKelasNRPNamaByHackerRankUsername,
  getUser,
} from '@/modules/auth/utils/APIGetUser'
import { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  status: 'success' | 'fail' | 'error'
  data?: {
    asdos: {
      nama: string
      kelas: string
      nrp: string
    }
  }
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await getUser(req)
  const username = req.query['username']

  if (
    !user?.kelas ||
    !isValidKelas(user.kelas) ||
    !username ||
    Array.isArray(username)
  ) {
    res.status(401).send({ status: 'fail', message: 'Unauthenticated.' })
    return
  }

  const asdos = await getAsdosKelasNRPNamaByHackerRankUsername(username)
  if (!asdos) {
    res.status(404).send({ status: 'fail', message: 'Asdos tidak ditemukan.' })
    return
  }

  res.status(200).send({
    status: 'success',
    data: {
      asdos,
    },
  })
}
