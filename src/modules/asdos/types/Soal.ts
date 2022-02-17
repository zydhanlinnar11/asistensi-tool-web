export default interface Soal {
  slug: string
  name: string
  authorEmail?: string
  contestSlug: string
  modul: '1' | '2' | '3' | '4' | 'final'
  isEditorialAvailable?: boolean
}
