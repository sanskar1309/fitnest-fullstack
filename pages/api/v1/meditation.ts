import { getMeditation } from '../../../lib/services'

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const data = await getMeditation()
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
    console.error('Error fetching meditation data from Supabase:', error);
    // Fallback to static data if Supabase is not available
    const staticData = [
      {
        "id": 1,
        "category_name": "Mindfulness Meditation",
        "category_description": "Cultivate present-moment awareness by observing thoughts, sensations, and feelings non-judgmentally.",
        "practices": [
          {
            "id": 1,
            "english_name": "Breath Awareness",
            "practice_benefits": "Reduces stress and anxiety, improves focus, enhances emotional regulation, and fosters relaxation.",
            "practice_description": "Sit comfortably. Close your eyes and focus on your breath, observing each inhale and exhale without trying to control it. When your mind wanders, gently bring your attention back to your breath.",
            "suggested_duration": "5–10 minutes"
          },
          {
            "id": 2,
            "english_name": "Body Scan",
            "practice_benefits": "Releases physical tension, increases self-awareness, and promotes deep relaxation.",
            "practice_description": "Lie down or sit comfortably. Bring awareness to each part of your body, moving from head to toes. Observe sensations without judgment or trying to change them.",
            "suggested_duration": "10–20 minutes"
          }
        ]
      },
      {
        "id": 2,
        "category_name": "Loving-Kindness Meditation",
        "category_description": "Develop compassion and positive emotions toward yourself and others through intentional phrases.",
        "practices": [
          {
            "id": 1,
            "english_name": "Traditional Loving-Kindness",
            "practice_benefits": "Increases empathy, reduces negative feelings, and promotes well-being.",
            "practice_description": "Sit comfortably and silently repeat phrases like 'May I be happy. May I be healthy. May I be safe.' Extend these wishes progressively to others.",
            "suggested_duration": "10–15 minutes"
          }
        ]
      },
      {
        "id": 3,
        "category_name": "Guided Visualization",
        "category_description": "Use detailed mental imagery to evoke calm and positivity.",
        "practices": [
          {
            "id": 1,
            "english_name": "Safe Place Visualization",
            "practice_benefits": "Reduces anxiety, fosters relaxation, and enhances emotional safety.",
            "practice_description": "Sit or lie comfortably and imagine a peaceful, safe environment. Use all senses to make the visualization vivid, noticing sights, sounds, and scents.",
            "suggested_duration": "5–15 minutes"
          }
        ]
      },
      {
        "id": 4,
        "category_name": "Mantra Meditation",
        "category_description": "Focus your mind by silently or softly repeating a word, phrase, or sound.",
        "practices": [
          {
            "id": 1,
            "english_name": "Mantra Repetition",
            "practice_benefits": "Improves concentration, calms the mind, and creates mental clarity.",
            "practice_description": "Sit quietly and repeat a chosen word or phrase, such as 'Om' or 'Peace.' Let thoughts go and return to the mantra when distracted.",
            "suggested_duration": "10–20 minutes"
          }
        ]
      },
      {
        "id": 5,
        "category_name": "Movement Meditation",
        "category_description": "Combine gentle movement with mindful attention to sensations and breath.",
        "practices": [
          {
            "id": 1,
            "english_name": "Walking Meditation",
            "practice_benefits": "Improves focus, grounds the body, and enhances present-moment awareness.",
            "practice_description": "Walk slowly in a quiet space, pay attention to the sensations in your feet and legs. Notice each step and breath, returning to these sensations whenever distracted.",
            "suggested_duration": "5–15 minutes"
          }
        ]
      },
      {
        "id": 6,
        "category_name": "Zen Meditation (Zazen)",
        "category_description": "Sit in stillness, observing thoughts and sensations without focus on objects or goals.",
        "practices": [
          {
            "id": 1,
            "english_name": "Zazen",
            "practice_benefits": "Enhances clarity, fosters equanimity, and cultivates mindfulness.",
            "practice_description": "Sit with upright posture, hands resting in lap, focus on breath or posture. Allow thoughts to arise and pass away without engagement or judgment.",
            "suggested_duration": "10–40 minutes"
          }
        ]
      }
    ];
    const response = {
      metadata: {
        version: "1.0.0",
        last_updated: "2025-11-08",
        supported_languages: ["en"],
        created_by: "Fitnest"
      },
      data: staticData
    };
    res.status(200).json(response)
  }
}
