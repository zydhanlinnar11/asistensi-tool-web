import SpinnerLoading from '@/common/components/elements/SpinnerLoading'
import { signIn } from '@/modules/auth/auth'
import { useUser } from '@/modules/auth/providers/UserProvider'
import Router from 'next/router'
import React, { FC, useEffect } from 'react'

const PrivateRoute: FC = ({ children }) => {
  const { user, isUserFetched } = useUser()

  useEffect(() => {
    if (isUserFetched && !user) signIn()
    else if (isUserFetched && user?.role !== 'asdos') Router.push('/403')
  }, [isUserFetched, user])

  return (
    <div className="my-auto">
      {isUserFetched && user?.role === 'asdos' ? children : <SpinnerLoading />}
    </div>
  )
}

export default PrivateRoute
