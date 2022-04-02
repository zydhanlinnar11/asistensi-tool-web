import { StaticImageData } from 'next/image'

type Institution = {
  name: string
  logo?: string | StaticImageData
}

export default Institution
