// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
  const code = req.query['code']
  const state = req.query['state']
  if (!code || !state || Array.isArray(code) || Array.isArray(state)) {
    res.redirect('/auth/error/state')
    return
  }

  const clientCallbackURL = new URL(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-state`
  )
  clientCallbackURL.searchParams.append('code', code)
  clientCallbackURL.searchParams.append('state', state)

  res.redirect(clientCallbackURL.toString())
}
