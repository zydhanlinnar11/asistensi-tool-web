import Router from 'next/router'

export async function signIn() {
  try {
    const response = await fetch(
      `/api/auth/redirect?redirect_url=${window.location.href}`,
      {
        credentials: 'include',
      }
    )
    if (!response.ok) throw new Error()

    const json = await response.json()
    if (!json?.data?.redirectUrl) throw new Error()

    Router.push(json.data.redirectUrl)
  } catch (e) {
    Router.push('/500')
  }
}
