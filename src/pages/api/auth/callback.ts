// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from '@/modules/auth/providers/UserProvider'
import OAuth2State from '@/modules/auth/types/OAuth2State'
import { join } from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'
import { readFileSync, unlinkSync } from 'fs'

function verifyState(returned_state: string) {
  try {
    const openIDStateFilePath = join(
      __dirname,
      '_files',
      'openid-state',
      `${returned_state}.json`
    )
    const openIDStateFile = readFileSync(openIDStateFilePath)
    const stringifiedState = openIDStateFile.toString()
    unlinkSync(openIDStateFilePath)
    if (!stringifiedState || !returned_state) return null

    const state: OAuth2State = JSON.parse(stringifiedState)
    state.expiredOn = new Date(state.expiredOn)
    new URL(state.redirectUrl)
    if (
      state.state !== returned_state ||
      state.expiredOn.getTime() < Date.now()
    )
      return null

    return state
  } catch (e) {
    return null
  }
}

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
  const returned_state = req.query['state']
  if (
    !code ||
    !returned_state ||
    Array.isArray(code) ||
    Array.isArray(returned_state)
  ) {
    res.redirect('/auth/error/state')
    return
  }

  const state = verifyState(returned_state)
  if (!state) {
    res.redirect('/auth/error/state')
    return
  }

  try {
    const oauthUrl = new URL('https://oauth2.googleapis.com/token')
    oauthUrl.searchParams.append('code', code)
    oauthUrl.searchParams.append(
      'client_id',
      process.env.GOOGLE_CLIENT_ID ?? ''
    )
    oauthUrl.searchParams.append(
      'client_secret',
      process.env.GOOGLE_CLIENT_SECRET ?? ''
    )
    oauthUrl.searchParams.append(
      'redirect_uri',
      process.env.GOOGLE_CALLBACK_URL ?? ''
    )
    oauthUrl.searchParams.append('grant_type', 'authorization_code')

    const response = await fetch(oauthUrl.toString(), {
      method: 'POST',
    })
    if (!response.ok) throw new Error()

    const json: { access_token: string; expires_in: number } =
      await response.json()

    const date = new Date()
    res.setHeader(
      'Set-Cookie',
      `access_token=${json.access_token}; Expires=${date.setSeconds(
        date.getSeconds() + json.expires_in
      )}; Path=/; Secure; HttpOnly; SameSite=Strict`
    )
    res.redirect(state.redirectUrl)
  } catch (e) {
    res.redirect('/auth/error/state')
    return
  }
}
