// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import GoogleUser from '@/modules/auth/interface/GoogleUser'
import { User } from '@/modules/auth/providers/UserProvider'
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
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader) {
    res.status(401).json({ status: 'fail', data: { user: null } })
    return
  }

  try {
    const token = authorizationHeader.split(' ')[1]
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`
    )
    if (response.status !== 200) {
      res.status(401).json({ status: 'error', message: 'Unauthenticated.' })
      return
    }
    const googleUser: GoogleUser = await response.json()

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.name,
        },
      },
    })
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Unauthenticated.' })
  }
}
