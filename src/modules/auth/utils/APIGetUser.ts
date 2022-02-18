import { NextApiRequest } from 'next'
import GoogleUser from '../interface/GoogleUser'
import { User } from '../providers/UserProvider'

type AdditionalData = {
  nrp: string
  kelas: string
  role: 'asdos'
}

type Asdos = {
  kelas: string
  nama: string
  nrp: number | string
  nomor_hp: number | string
  email?: string
  hackerrank_profile_url?: string
  pj?: string
}

async function getAsdosData() {
  if (!process.env.ASDOS_DATASOURCE || !process.env.DATASOURCE_API_TOKEN)
    throw new Error()

  const response = await fetch(process.env.ASDOS_DATASOURCE, {
    headers: {
      Authorization: `token ${process.env.DATASOURCE_API_TOKEN}`,
    },
  })

  const { encoding, content }: { encoding: string; content: string } =
    await response.json()

  if (encoding !== 'base64') return null

  const data: Asdos[] = JSON.parse(Buffer.from(content, 'base64').toString())

  return data
}

async function getAdditionalAsdosDataByEmail(email: string) {
  const asdosData = await getAsdosData()
  if (!asdosData) return null
  const filteredData = asdosData.filter((asdos) => asdos.email === email)

  if (filteredData.length !== 1) return null

  const asdos = filteredData[0]
  const additionalData: AdditionalData = {
    kelas: asdos.kelas.toUpperCase(),
    nrp: `${asdos.nrp}`,
    role: 'asdos',
  }
  return additionalData
}

export async function getUser(req: NextApiRequest) {
  try {
    const token = req.cookies['access_token']
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`
    )
    if (response.status !== 200) {
      return null
    }
    const googleUser: GoogleUser = await response.json()
    const additionalData = await getAdditionalAsdosDataByEmail(googleUser.email)
    const user: User = {
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      kelas: additionalData?.kelas,
      nrp: additionalData?.nrp,
      role: additionalData?.role,
    }

    return user
  } catch (error) {
    return null
  }
}
