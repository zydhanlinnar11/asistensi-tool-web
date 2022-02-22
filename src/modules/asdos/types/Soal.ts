import { availableModul } from '@/common/data/PortalPraktikum'

export default interface Soal {
  slug: string
  name: string
  authorEmail?: string
  modul: availableModul
  isEditorialAvailable?: boolean
}
