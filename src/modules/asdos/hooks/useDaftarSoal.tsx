import { Fetcher } from 'swr'
import Soal from '../types/Soal'
import useSWRImmutable from 'swr/immutable'

const fetcher: Fetcher<Soal[]> = (url: string) =>
  fetch(url, { credentials: 'same-origin' })
    .then((res) => res.json())
    .then((val) => val.data.soal)

export default function useDaftarSoal() {
  const { data, error } = useSWRImmutable('/api/asdos/soal', fetcher)

  return {
    daftarSoal: data,
    isLoading: !error && !data,
    isError: error,
  }
}
