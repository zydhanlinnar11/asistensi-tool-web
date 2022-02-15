import SpinnerLoading from '@/common/components/elements/SpinnerLoading'
import Router from 'next/router'
import React, { useEffect } from 'react'

export default function callback() {
  useEffect(() => {
    const urlArr = document.URL.split('#')
    const url = new URL(`${urlArr[0]}?${urlArr[1]}`)
    const access_token = url.searchParams.get('access_token')
    if (access_token) {
      localStorage.setItem('token', access_token)
    }

    Router.push('/')
  })

  return (
    <div className="my-auto">
      <SpinnerLoading></SpinnerLoading>
    </div>
  )
}
