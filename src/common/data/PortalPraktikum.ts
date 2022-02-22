import { availableKelas } from './Kelas'

export type availableModul = '1' | '2' | '3' | '4' | 'final'

export function isValidModul(modul: string): modul is availableModul {
  switch (modul) {
    case '1':
    case '2':
    case '3':
    case '4':
    case 'final':
      return true
  }
  return false
}

export default function getContestSlugByModulAndKelas(
  modul: availableModul,
  kelas: availableKelas
) {
  if (modul !== 'final') return `sd${kelas.toLowerCase()}-m${modul}-2021`
  else return 'dasprog-fp-2021'
}
