import SpinnerLoading from '@/common/components/elements/SpinnerLoading'
import { GetServerSideProps } from 'next'
import Router from 'next/router'
import React, { FC, useEffect } from 'react'

interface Props {
  code?: string
  state?: string
}

const VerifyState: FC<Props> = ({ code, state }) => {
  useEffect(() => {
    Router.push(`/api/auth/verify-state?code=${code}&state=${state}`)
  }, [])

  return (
    <div className="my-auto">
      <SpinnerLoading />
    </div>
  )
}

export default VerifyState

export const getServerSideProps: GetServerSideProps<Props> = async (req) => {
  const code = req.query['code']
  const state = req.query['state']

  if (!code || !state || Array.isArray(code) || Array.isArray(state)) {
    return {
      props: {},
    }
  }
  return {
    props: { code, state },
  }
}
