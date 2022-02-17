import SpinnerLoading from '@/common/components/elements/SpinnerLoading'
import OAuth2State from '@/modules/auth/types/OAuth2State'
import Router from 'next/router'
import React, { useEffect } from 'react'

function verifyState(returned_state: string | null) {
  const stringifiedState = localStorage.getItem('state')
  if (!stringifiedState || !returned_state) return null
  const state: OAuth2State = JSON.parse(stringifiedState)
  state.expiredOn = new Date(state.expiredOn)

  new URL(state.redirectUrl)

  if (state.state !== returned_state || state.expiredOn.getTime() < Date.now())
    return null

  return state
}

export default function callback() {
  useEffect(() => {
    const urlArr = document.URL.split('#')
    const url = new URL(`${urlArr[0]}?${urlArr[1]}`)
    const access_token = url.searchParams.get('access_token')
    const returned_state = url.searchParams.get('state')

    try {
      const state = verifyState(returned_state)
      if (!access_token) throw new Error("access_token_can't_be_null")
      if (!state) throw new Error("state_can't_be_null")

      localStorage.setItem('token', access_token)
      localStorage.removeItem('state')
      Router.replace(state.redirectUrl)
    } catch (e) {
      Router.replace('/auth/error/state')
    }
  }, [])

  return (
    <div className="my-auto">
      <SpinnerLoading></SpinnerLoading>
    </div>
  )
}
