import { signIn } from '@/modules/auth/auth'
import { useUser } from '@/modules/auth/providers/UserProvider'
import React, { FC } from 'react'
import SpinnerLoading from './elements/SpinnerLoading'

const PrivateRoute: FC = ({ children }) => {
  const { user, isUserFetched } = useUser()

  if (isUserFetched && !user) signIn()

  return (
    <div>
      {isUserFetched && user ? (
        children
      ) : (
        <div className="my-24">
          <SpinnerLoading />
        </div>
      )}
    </div>
  )
}

export default PrivateRoute
