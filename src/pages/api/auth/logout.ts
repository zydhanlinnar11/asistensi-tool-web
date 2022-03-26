import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.cookies['access_token']
    const response = await fetch(
      `https://oauth2.googleapis.com/revoke?token=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
      }
    )
    if (!response.ok) {
      return res
        .status(response.status)
        .send({
          message:
            (await response.json())?.error_description ?? 'Log out failed',
        })
    }
    return res.status(200).send({ message: 'Log out success' })
  } catch (e) {
    return res.status(500).send({ message: 'Log out failed' })
  }
}
