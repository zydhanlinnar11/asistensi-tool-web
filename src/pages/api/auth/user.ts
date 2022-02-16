// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import GoogleUser from '@/modules/auth/interface/GoogleUser'
import { User } from '@/modules/auth/providers/UserProvider'
import { getUser } from '@/modules/auth/utils/APIGetUser'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  status: 'success' | 'fail' | 'error'
  data?: {
    user: User | null
  }
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await getUser(req)
  if (!user) {
    res.status(401).json({ status: 'error', message: 'Unauthenticated.' })
    return
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  })
}
