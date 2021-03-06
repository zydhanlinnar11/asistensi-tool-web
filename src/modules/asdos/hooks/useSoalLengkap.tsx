import Soal from '../types/Soal'
import { AdditionalData } from '../types/soal/AdditionalData'
import useSWRImmutable from 'swr/immutable'
import { Fetcher } from 'swr'

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
  modul,
  name,
  slug,
}: Soal): ReturnValue {
  const { data, error } = useSWRImmutable(
    `/api/asdos/data-soal-tambahan?modul=${modul}&slug=${slug}`,
    fetcher
  )

  return {
    soalLengkap: {
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
