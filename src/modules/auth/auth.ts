import { NextApiRequest, NextApiResponse } from 'next'
import Router from 'next/router'

export function signIn() {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')

  if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    url.searchParams.append(
      'client_id',
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    )

  if (process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL)
    url.searchParams.append(
      'redirect_uri',
      process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL
    )

  url.searchParams.append('response_type', 'token')
  url.searchParams.append('scope', 'openid profile email')

  Router.push(url)
}

export async function handleCallback() {
  const urlArr = document.URL.split('#')
  const url = new URL(`${urlArr[0]}?${urlArr[1]}`)
  const access_token = url.searchParams.get('access_token')
  if (access_token) {
    localStorage.setItem('token', access_token)
  }

  // Router.push('/')
}