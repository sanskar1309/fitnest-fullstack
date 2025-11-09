import { getMoods } from '../../../lib/services'

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const data = await getMoods()
    const response = {
      metadata: {
        version: "1.0.0",
        last_updated: "2025-11-08",
        supported_languages: ["en"],
        created_by: "Fitnest"
      },
      data: data
    };
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching moods data from Supabase:', error);
    // Fallback to static data if Supabase is not available
    const fs = require('fs')
    const path = require('path')
    try {
      const filePath = path.join(process.cwd(), 'moods.json')
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const moodsData = JSON.parse(fileContents)
      const response = {
        metadata: {
          version: "1.0.0",
          last_updated: "2025-11-08",
          supported_languages: ["en"],
          created_by: "Fitnest"
        },
        data: moodsData.moods.map((mood: any, index: number) => ({
          id: index + 1,
          ...mood
        }))
      };
      res.status(200).json(response);
    } catch (fallbackError) {
      console.error('Error fetching fallback moods data:', fallbackError);
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
