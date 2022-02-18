import useSWR, { Fetcher } from 'swr'
import Soal from '../types/Soal'

const fetcher: Fetcher<Soal[]> = (url: string) =>
  fetch(url, { credentials: 'same-origin' })
    .then((res) => res.json())
    .then((val) => val.data.soal)

export default function useDaftarSoal() {
  const { data, error } = useSWR('/api/asdos/soal', fetcher)

  return {
    daftarSoal: data,
    isLoading: !error && !data,
    isError: error,
  }
}
