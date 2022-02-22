export type availableKelas = 'a' | 'b' | 'c' | 'e' | 'f' | 'iup'

export function isValidKelas(kelas: string): kelas is availableKelas {
  switch (kelas) {
    case 'a':
    case 'b':
    case 'c':
    case 'e':
    case 'f':
    case 'iup':
      return true
  }
  return false
}
