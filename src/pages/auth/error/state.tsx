import Header from '@/common/components/elements/Header'
import React from 'react'

export default function StateError() {
  return (
    <div className="my-auto">
      <Header
        midText="401 - Unauthenticated"
        bottomText="Verifikasi state gagal. Silahkan coba masuk kembali."
      ></Header>
    </div>
  )
}
