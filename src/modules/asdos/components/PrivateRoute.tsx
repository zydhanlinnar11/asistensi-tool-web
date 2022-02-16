import SpinnerLoading from '@/common/components/elements/SpinnerLoading'
import { signIn } from '@/modules/auth/auth'
import { useUser } from '@/modules/auth/providers/UserProvider'
import Router from 'next/router'
import React, { FC } from 'react'

const PrivateRoute: FC = ({ children }) => {
  const { user, isUserFetched } = useUser()

  if (isUserFetched && !user) signIn()
  if (isUserFetched && user?.role !== 'asdos') Router.push('/403')

  return (
    <div className="my-auto">
      {isUserFetched && user?.role === 'asdos' ? children : <SpinnerLoading />}
    </div>
  )
}

export default PrivateRoute
