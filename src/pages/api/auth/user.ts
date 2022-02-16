// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import GoogleUser from '@/modules/auth/interface/GoogleUser'
import { User } from '@/modules/auth/providers/UserProvider'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  status: 'success' | 'fail' | 'error'
  data?: {
    user: User | null
  }
  message?: string
}

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader) {
    res.status(401).json({ status: 'fail', data: { user: null } })
    return
  }

  try {
    const token = authorizationHeader.split(' ')[1]
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`
    )
    if (response.status !== 200) {
      res.status(401).json({ status: 'error', message: 'Unauthenticated.' })
      return
    }
    const googleUser: GoogleUser = await response.json()
    const additionalData = await getAdditionalAsdosDataByEmail(googleUser.email)

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          kelas: additionalData?.kelas,
          nrp: additionalData?.nrp,
          role: additionalData?.role,
        },
      },
    })
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Unauthenticated.' })
  }
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
