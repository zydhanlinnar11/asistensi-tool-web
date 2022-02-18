import useSWR, { Fetcher } from 'swr'
import DetailSoal from '../types/soal/DetailSoal'

const fetcher: Fetcher<DetailSoal> = (url: string) =>
  fetch(url, { credentials: 'same-origin' })
    .then((res) => res.json())
    .then((val) => val.data.soal)

export default function useSoal(contestSlug: string, slug: string) {
  const { data, error } = useSWR(
    `/api/asdos/detail-soal?contest-slug=${contestSlug}&slug=${slug}`,
    fetcher
  )

  return {
    soal: data,
    isError: error,
    isLoading: !data && !error,
  }
}
