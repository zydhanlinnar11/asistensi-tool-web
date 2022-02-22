import { availableKelas } from '@/common/data/Kelas'
import { Fetcher } from 'swr'
import useSWRImmutable from 'swr/immutable'

type Data = {
  nama: string
  nrp: string
  kelas: availableKelas
}

const fetcher: Fetcher<Data> = (url: string) =>
  fetch(url, { credentials: 'same-origin' })
    .then((res) => res.json())
    .then((val) => val.data.asdos)

export default function useAsdosFromHackerRank(username?: string) {
  const { data, error } = useSWRImmutable(
    `/api/asdos/asdos-from-hackerrank?username=${username}`,
    fetcher
  )

  return {
    asdos: data,
    isAsdosLoading: !error && !data,
    isAsdosError: error,
  }
}
