import { getPoses, getPosesByParams } from '../../../lib/services'

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    let data
    if (Object.keys(req.query).length === 0) {
      data = await getPoses()
    } else {
      data = await getPosesByParams(req.query)
    }

    if (!data) {
      return res.status(404).json({ message: 'Pose not found' })
    }

    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching poses:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
