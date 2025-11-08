import { getCategories, getCategoriesByParams } from '../../../lib/services'

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    let data
    if (Object.keys(req.query).length === 0) {
      data = await getCategories()
    } else {
      data = await getCategoriesByParams(req.query)
    }

    if (!data) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.setHeader('Cache-Control', 'no-cache')
    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
