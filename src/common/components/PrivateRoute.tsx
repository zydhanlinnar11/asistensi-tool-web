import { signIn } from '@/modules/auth/auth'
import { useUser } from '@/modules/auth/providers/UserProvider'
import React, { FC } from 'react'
import SpinnerLoading from './elements/SpinnerLoading'

const PrivateRoute: FC = ({ children }) => {
  const { user, isUserFetched } = useUser()

  if (isUserFetched && !user) signIn()

  return (
    <div className="my-auto">
      {isUserFetched ? children : <SpinnerLoading />}
    </div>
  )
}

export default PrivateRoute
