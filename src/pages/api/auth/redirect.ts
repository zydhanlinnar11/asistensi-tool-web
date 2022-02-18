// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import OAuth2State from '@/modules/auth/types/OAuth2State'
import type { NextApiRequest, NextApiResponse } from 'next'
import { URL } from 'url'
import { v4 as uuidv4 } from 'uuid'
import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

type Data = {
  status: 'success' | 'fail' | 'error'
  data?: {
    redirectUrl: string
  } | null
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    if (!process.env.GOOGLE_CALLBACK_URL || !process.env.GOOGLE_CLIENT_ID) {
      throw new Error()
    }
    url.searchParams.append('redirect_uri', process.env.GOOGLE_CALLBACK_URL)
    url.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID)

    const redirectUrl = req.query['redirect_url']
    if (!redirectUrl || Array.isArray(redirectUrl)) {
      res.status(400).json({ status: 'fail', data: null })
      return
    }

    const expiredDate = new Date()
    expiredDate.setMinutes(expiredDate.getMinutes() + 5)
    const state: OAuth2State = {
      state: uuidv4(),
      expiredOn: expiredDate,
      redirectUrl: new URL(redirectUrl).toString(),
    }
    url.searchParams.append('response_type', 'code')
    url.searchParams.append('scope', 'openid profile email')
    url.searchParams.append('state', state.state)

    const db = new JsonDB(new Config('AuthDatabase', true, false, '/'))
    db.push(`/openid-state/${state.state}`, JSON.stringify(state))

    res
      .status(200)
      .json({ status: 'success', data: { redirectUrl: url.toString() } })
  } catch (e) {
    res.status(500).json({ status: 'error', message: 'Internal server error' })
    return
  }
}
