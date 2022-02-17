import Router from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import OAuth2State from './types/OAuth2State'

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

  const expiredDate = new Date()
  expiredDate.setMinutes(expiredDate.getMinutes() + 5)
  const state: OAuth2State = {
    state: uuidv4(),
    expiredOn: expiredDate,
    redirectUrl: window.location.href,
  }
  url.searchParams.append('response_type', 'token')
  url.searchParams.append('scope', 'openid profile email')
  url.searchParams.append('state', state.state)

  localStorage.setItem('state', JSON.stringify(state))
  Router.push(url)
}
