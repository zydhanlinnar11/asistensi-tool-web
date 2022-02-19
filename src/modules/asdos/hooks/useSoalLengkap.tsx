import useSWR, { Fetcher } from 'swr'
import Soal from '../types/Soal'
import { AdditionalData } from '../types/soal/AdditionalData'

const fetcher: Fetcher<AdditionalData> = (url: string) =>
  fetch(url, { credentials: 'same-origin' })
    .then((res) => res.json())
    .then((val) => val.data.soal)

interface ReturnValue {
  soalLengkap: Soal
  isError: any
  isLoading: boolean
}

export default function useSoalLengkap({
  contestSlug,
  modul,
  name,
  slug,
}: Soal): ReturnValue {
  const { data, error } = useSWR(
    `/api/asdos/data-soal-tambahan?contest-slug=${contestSlug}&slug=${slug}`,
    fetcher
  )

  return {
    soalLengkap: {
      contestSlug,
      modul,
      name,
      slug,
      authorEmail: data?.authorName,
      isEditorialAvailable: data?.isEditorialAvailable,
    },
    isError: error,
    isLoading: !data && !error,
  }
}