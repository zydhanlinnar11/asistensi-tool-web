import { availableModul } from '@/common/data/PortalPraktikum'

export default interface DetailSoal {
  slug: string
  name: string
  authorUsername: string
  bodyHtml: string
  modul: availableModul
  isEditorialAvailable: boolean
  editorialHtml?: string
  code?: string
}
