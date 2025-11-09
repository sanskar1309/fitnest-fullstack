import { getMeditation } from '../../../lib/services'

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const data = await getMeditation()
    const processedData = data.map(category => ({
      ...category,
      practices: category.practices.map((practice: any) => {
        const { url_png, url_svg, url_svg_alt, ...rest } = practice
        return rest
      })
    }))
    const response = {
      metadata: {
        version: "1.0.0",
        last_updated: "2025-11-08",
        supported_languages: ["en"],
        created_by: "Fitnest"
      },
      data: processedData
    };
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching meditation data from Supabase:', error);
    // Fallback to static data if Supabase is not available
    const fs = require('fs')
    const path = require('path')
    try {
      const filePath = path.join(process.cwd(), 'meditations.json')
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const meditationsData = JSON.parse(fileContents)

      // Remove media URLs from practices
      const cleanedData = meditationsData.categories.map((category: any) => ({
        ...category,
        practices: category.practices.map((practice: any) => {
          const { url_png, url_svg, url_svg_alt, ...cleanedPractice } = practice
          return cleanedPractice
        })
      }))

      const response = {
        metadata: {
          version: "1.0.0",
          last_updated: "2025-11-08",
          supported_languages: ["en"],
          created_by: "Fitnest"
        },
        data: cleanedData
      };
      res.status(200).json(response)
    } catch (fallbackError) {
      console.error('Error fetching fallback meditation data:', fallbackError);
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
