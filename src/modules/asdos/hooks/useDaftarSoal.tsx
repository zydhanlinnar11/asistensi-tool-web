import { useEffect, useState } from 'react'
import Soal from '../types/Soal'

export default function useDaftarSoal() {
  const [daftarSoal, setDaftarSoal] = useState<Soal[]>()

  async function fetchDaftarSoal() {
    const ret: Soal[] = []
    try {
      const response = await fetch('/api/asdos/soal', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) throw new Error()

      const soal: Soal[] = (await response.json()).data.soal
      setDaftarSoal(soal)
    } catch (e) {
      setDaftarSoal(ret)
    }
  }

  useEffect(() => {
    fetchDaftarSoal()
  }, [])

  return daftarSoal
}
