import type { NextApiRequest, NextApiResponse } from "next";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

// List of free-tier models to try in order
const MODELS = [
  "openai/gpt-4o",
  // "openai/gpt-3.5-turbo",
  // "google/gemini-pro",
  // Add more free models here if needed
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const { cuisine, calories, goal, age, gender, allergies, meal_timing, diet_type, height, weight } = req.body;

    if (
      !calories || !goal || !age || !gender ||
      !Array.isArray(meal_timing) || meal_timing.length === 0 ||
      !height || !weight
    ) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    if (typeof calories !== 'number' || calories < 1000) {
      res.status(400).json({ message: "Calories value is too low. Please enter a realistic daily calorie target (minimum 1000)." });
      return;
    }

    if (typeof height !== 'number' || height < 50) {
      res.status(400).json({ message: "Height value is too low. Please enter a realistic height (minimum 50 cm)." });
      return;
    }

    if (typeof weight !== 'number' || weight < 20) {
      res.status(400).json({ message: "Weight value is too low. Please enter a realistic weight (minimum 20 kg)." });
      return;
    }

    const allergiesList = Array.isArray(allergies) ? allergies : [];

    let dietTypeText = "";
    if (diet_type === "veg") {
      dietTypeText = "The meal plan should be strictly vegetarian (no meat, fish, or eggs).";
    } else if (diet_type === "non-veg") {
      dietTypeText = "The meal plan can include both vegetarian and non-vegetarian dishes.";
    } else if (diet_type === "vegan") {
      dietTypeText = "The meal plan should be strictly vegan (no animal products, dairy, eggs, or meat).";
    } else if (diet_type === "eggs_only") {
      dietTypeText = "The meal plan should be vegetarian but can include eggs (no meat or fish).";
    }

    const prompt = `
      Generate a structured JSON meal plan for a ${age}-year-old ${gender} with a height of ${height} cm and weight of ${weight} kg, aiming for ${goal} with a daily intake of ${calories} calories.
      - Cuisine preference: ${cuisine || "any"}.
      - Diet type: ${diet_type || "any"}.
      ${dietTypeText}
      - Allergies: ${allergiesList.length ? allergiesList.join(", ") : "none"}.
      - Meals: ${meal_timing.join(", ")}.

      Each meal should include:
      - Name
      - Meal timing
      - Calories
      - Macronutrient breakdown (Protein, Carbs, Fats, Fiber)
      - Ingredients
      - Cooking instructions

      Return the response in JSON format. Also include the total (overall) protein, carbs, fats, and fiber for the entire day as "overall_macros" at the top level of the meal plan.
    `;

    let lastError: any = null;

    for (const model of MODELS) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": SITE_URL,
            "X-Title": "AI Meal Planner",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 2000,
          }),
        });

        const responseData = await response.json();

        // If rate-limited or error, try next model
        if (!response.ok) {
          if (response.status === 429 || (responseData.error && responseData.error.code === 429)) {
            lastError = responseData;
            continue; // Try next model
          }
          // Other errors: return immediately
          return res.status(response.status).json(responseData);
        }

        // Extract the content from the response
        const content = responseData.choices?.[0]?.message?.content;
        if (!content) {
          lastError = { message: "No content in response", details: responseData };
          continue;
        }

        // Clean and parse the content
        let cleanedResponse = content.trim();
        if (cleanedResponse.startsWith("```")) {
          cleanedResponse = cleanedResponse.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
        }

        try {
          const mealPlan = JSON.parse(cleanedResponse);

          // Calculate overall macros if meals are present
          if (mealPlan.meals && Array.isArray(mealPlan.meals)) {
            const overallMacros = { protein: 0, carbs: 0, fats: 0, fiber: 0 };
            mealPlan.meals.forEach((meal: any) => {
              if (meal.macronutrients) {
                // Handle both lowercase and capitalized keys
                const macros = meal.macronutrients;
                overallMacros.protein += typeof macros.protein === 'number' ? macros.protein : (typeof macros.Protein === 'number' ? macros.Protein : 0);
                overallMacros.carbs += typeof macros.carbs === 'number' ? macros.carbs : (typeof macros.Carbs === 'number' ? macros.Carbs : 0);
                overallMacros.fats += typeof macros.fats === 'number' ? macros.fats : (typeof macros.Fats === 'number' ? macros.Fats : 0);
                overallMacros.fiber += typeof macros.fiber === 'number' ? macros.fiber : (typeof macros.Fiber === 'number' ? macros.Fiber : 0);
              }
            });
            // Only include overall_macros if at least one value is non-zero
            if (overallMacros.protein > 0 || overallMacros.carbs > 0 || overallMacros.fats > 0 || overallMacros.fiber > 0) {
              mealPlan.overall_macros = {
                protein: `${overallMacros.protein}g`,
                carbs: `${overallMacros.carbs}g`,
                fats: `${overallMacros.fats}g`,
                fiber: `${overallMacros.fiber}g`,
              };
            }
          }

          return res.status(200).json(mealPlan);
        } catch (parseError) {
          // If parsing fails, try next model
          lastError = { message: "Failed to parse response", details: cleanedResponse };
          continue;
        }
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    // If all models fail
    res.status(503).json({
      message: "All AI providers are currently unavailable or rate-limited. Please try again later.",
      error: lastError,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error instanceof Error ? error.message : error });
  }
}
