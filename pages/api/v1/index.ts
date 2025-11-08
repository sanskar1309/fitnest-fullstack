import { NextApiRequest, NextApiResponse } from 'next'
import { getBaseURL } from '../../../lib/services'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const data = await getBaseURL()
    res.status(200).json(data)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
