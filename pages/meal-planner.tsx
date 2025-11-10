"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChefHat, Utensils, ArrowLeft, Save, Trash2, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LottieLoader } from "@/components/ui/LottieLoader";
import cookingAnimation from "../public/Cooking.json";

export default function MealPlanner() {
  const [cuisine, setCuisine] = useState("");
  const [allergies, setAllergies] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [calories, setCalories] = useState("");
  const [goal, setGoal] = useState("");
  const [dietType, setDietType] = useState("veg");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [mealTimings, setMealTimings] = useState<string[]>(["breakfast", "lunch", "dinner"]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [showSavedPlans, setShowSavedPlans] = useState(false);

  useEffect(() => {
    const plans = localStorage.getItem("savedMealPlans");
    if (plans) {
      setSavedPlans(JSON.parse(plans));
    }
  }, []);

  const saveMealPlan = () => {
    if (!result) return;
    const planName = prompt("Enter a name for your meal plan:");
    if (!planName) return;
    const newPlan = {
      id: Date.now(),
      name: planName,
      data: result,
      timestamp: new Date().toISOString(),
    };
    const updatedPlans = [...savedPlans, newPlan];
    setSavedPlans(updatedPlans);
    localStorage.setItem("savedMealPlans", JSON.stringify(updatedPlans));
  };

  const loadMealPlan = (plan: any) => {
    setResult(plan.data);
    setShowSavedPlans(false);
  };

  const deleteMealPlan = (id: number) => {
    const updatedPlans = savedPlans.filter(plan => plan.id !== id);
    setSavedPlans(updatedPlans);
    localStorage.setItem("savedMealPlans", JSON.stringify(updatedPlans));
  };

  const resetPlanner = () => {
    setCuisine("");
    setAllergies("");
    setAge("");
    setGender("male");
    setCalories("");
    setGoal("");
    setDietType("veg");
    setHeight("");
    setWeight("");
    setMealTimings(["breakfast", "lunch", "dinner"]);
    setResult(null);
  };

  const generateMealPlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/meal-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cuisine,
          allergies: allergies.split(',').map(a => a.trim()).filter(a => a),
          age: Number(age),
          gender,
          calories: Number(calories),
          goal,
          diet_type: dietType,
          height: Number(height),
          weight: Number(weight),
          meal_timing: mealTimings,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Error generating meal plan.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            🥗 AI Meal Planner
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Meal&nbsp;
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Planner
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get a personalized meal plan based on your preferences and goals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* User Input Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-secondary">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Meal Planner</CardTitle>
                    <CardDescription>Enter your details for a custom meal plan</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-4">
                  <Input
                    type="text"
                    value={cuisine}
                    onChange={e => setCuisine(e.target.value)}
                    placeholder="Preferred Cuisine (e.g., Italian, Indian)"
                  />
                  <Input
                    type="text"
                    value={allergies}
                    onChange={e => setAllergies(e.target.value)}
                    placeholder="Allergies (comma separated)"
                  />
                  <Input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="Age"
                  />
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    placeholder="Height (cm)"
                  />
                  <Input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="Weight (kg)"
                  />
                  <Input
                    type="number"
                    value={calories}
                    onChange={e => setCalories(e.target.value)}
                    placeholder="Target Calories"
                  />
                  <Select value={dietType} onValueChange={setDietType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Diet Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="eggs_only">Vegetarian with Eggs</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                      <SelectItem value="fat_loss">Fat Loss</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meal Timings</label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { value: "breakfast", label: "Breakfast" },
                        { value: "lunch", label: "Lunch" },
                        { value: "dinner", label: "Dinner" },
                        { value: "snacks", label: "Snacks" },
                      ].map((meal) => (
                        <div key={meal.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={meal.value}
                            checked={mealTimings.includes(meal.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setMealTimings([...mealTimings, meal.value]);
                              } else {
                                setMealTimings(mealTimings.filter((t) => t !== meal.value));
                              }
                            }}
                          />
                          <label htmlFor={meal.value} className="text-sm">
                            {meal.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      className="flex-1 shadow-primary"
                      onClick={generateMealPlan}
                      disabled={loading}
                    >
                      {loading ? "Generating..." : "Generate Meal Plan"}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={resetPlanner}
                    >
                      Reset
                    </Button>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSavedPlans(!showSavedPlans)}
                      className="flex-1"
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      {showSavedPlans ? "Hide Saved Plans" : "View Saved Plans"}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-4 text-center">
                      {error}
                    </p>
                  )}
                  {showSavedPlans && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Saved Meal Plans</h3>
                      {savedPlans.length === 0 ? (
                        <p className="text-muted-foreground">No saved plans yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {savedPlans.map((plan) => (
                            <Card key={plan.id} className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold">{plan.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Saved on {new Date(plan.timestamp).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => loadMealPlan(plan)}
                                  >
                                    Load
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => deleteMealPlan(plan.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {loading ? (
              <Card className="shadow-secondary">
                <CardContent className="flex items-center justify-center h-full py-16">
                  <div className="text-center space-y-4">
                    <LottieLoader animationData={cookingAnimation} />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Generating Your Meal Plan
                      </h3>
                      <p className="text-muted-foreground">
                        Please wait while we create your personalized plan...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : result ? (
              <Card className="shadow-secondary border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>Your Meal Plan</CardTitle>
                        <CardDescription>Daily meal breakdown</CardDescription>
                      </div>
                    </div>
                    <Badge variant="default">
                      {goal ? goal.replace("_", " ") : ""}
                    </Badge>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={saveMealPlan}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Meal Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {result && (() => {
                    // Handle OpenRouter response structure
                    let parsed = result;
                    // If result is a string, clean and parse it
                    if (typeof result === "string") {
                      let cleaned = result.trim();
                      if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
                      if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
                      if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
                      try {
                        parsed = JSON.parse(cleaned);
                      } catch (e) {
                        return (
                          <pre className="whitespace-pre-wrap mt-4 bg-gray-100 p-4 rounded text-sm">
                            {result}
                          </pre>
                        );
                      }
                    }
                    // If result is from OpenRouter, extract content
                    if (
                      parsed &&
                      parsed.choices &&
                      parsed.choices[0] &&
                      parsed.choices[0].message &&
                      parsed.choices[0].message.content
                    ) {
                      let content = parsed.choices[0].message.content.trim();
                      if (content.startsWith("```json")) content = content.slice(7);
                      if (content.startsWith("```")) content = content.slice(3);
                      if (content.endsWith("```")) content = content.slice(0, -3);
                      try {
                        parsed = JSON.parse(content);
                      } catch (e) {
                        return (
                          <pre className="whitespace-pre-wrap mt-4 bg-gray-100 p-4 rounded text-sm">
                            {content}
                          </pre>
                        );
                      }
                    }
                    const mealPlan = parsed && parsed.meal_plan;
                    const mealArr = mealPlan && typeof mealPlan === 'object' && !Array.isArray(mealPlan)
                      ? Object.values(mealPlan)
                      : Array.isArray(mealPlan)
                      ? mealPlan
                      : parsed && Array.isArray(parsed.meals)
                      ? parsed.meals
                      : null;
                    if (mealArr) {
                      return (
                        <div className="mt-6">
                          <h2 className="text-lg font-semibold mb-2">Meal Plan</h2>
                          {parsed.overall_macros && (
                            <div className="mb-4 p-4 rounded bg-blue-50 border border-blue-200">
                              <h3 className="font-semibold mb-1">Overall Macros</h3>
                              <p>
                                Protein:{" "}
                                <span className="font-semibold">
                                  {parsed.overall_macros.protein}
                                </span>
                                , Carbs:{" "}
                                <span className="font-semibold">
                                  {parsed.overall_macros.carbs}
                                </span>
                                , Fats:{" "}
                                <span className="font-semibold">
                                  {parsed.overall_macros.fats}
                                </span>
                                , Fiber:{" "}
                                <span className="font-semibold">
                                  {parsed.overall_macros.fiber}
                                </span>
                              </p>
                            </div>
                          )}
                          <div className="space-y-4">
                            {mealArr.map((meal: any, idx: number) => (
                              <Card key={idx} className="border p-4 rounded">
                                <CardHeader>
                                  <CardTitle className="text-lg font-bold">{meal.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-gray-500 capitalize mb-1">Timing: {meal.meal_timing}</p>
                                  <p className="mb-1">Calories: {meal.calories}</p>
                                  {meal.macronutrients && (
                                    <p className="mb-1">
                                      Macronutrients: Protein: {meal.macronutrients.protein}, Carbs: {meal.macronutrients.carbs}, Fats: {meal.macronutrients.fats}, Fiber: {meal.macronutrients.fiber}
                                    </p>
                                  )}
                                  {meal.macronutrient_breakdown && (
                                    <p className="mb-1">
                                      Macronutrients: Protein: {meal.macronutrient_breakdown.protein}, Carbs: {meal.macronutrient_breakdown.carbs}, Fats: {meal.macronutrient_breakdown.fats}, Fiber: {meal.macronutrient_breakdown.fiber}
                                    </p>
                                  )}
                                  {meal.ingredients && (
                                    <div className="mb-1">
                                      <h4 className="font-semibold mt-2">Ingredients:</h4>
                                      <ul className="list-disc ml-5">
                                        {meal.ingredients.map((ingredient: string, i: number) => (
                                          <li key={i}>{ingredient}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {meal.cooking_instructions && (
                                    <div>
                                      <h4 className="font-semibold mt-2">Cooking Instructions:</h4>
                                      <p>
                                        {Array.isArray(meal.cooking_instructions)
                                          ? meal.cooking_instructions.join(" ")
                                          : meal.cooking_instructions}
                                      </p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    // fallback
                    return (
                      <pre className="whitespace-pre-wrap mt-4 bg-gray-100 p-4 rounded text-sm">
                        {JSON.stringify(parsed, null, 2)}
                      </pre>
                    );
                  })()}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-secondary">
                <CardContent className="flex items-center justify-center h-full py-16">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                      <ChefHat className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Enter Your Details
                      </h3>
                      <p className="text-muted-foreground">
                        Fill in your information to get a personalized meal plan
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">About Meal Planning</CardTitle>
              <CardDescription className="text-center">
                How personalized meal plans help you reach your goals
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Balanced Nutrition</h4>
                  <p>Meal plans ensure you get the right mix of protein, carbs, and fats for your goal.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Variety & Enjoyment</h4>
                  <p>Choose cuisines and preferences to keep your meals interesting and enjoyable.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Goal-Oriented</h4>
                  <p>Plans are tailored for muscle gain, fat loss, or maintenance, supporting your journey.</p>
                </div>
              </div>
              <p className="text-muted-foreground mt-6">
                <strong>Note:</strong> This tool provides sample meal plans. For medical or dietary advice, consult a registered dietitian.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <div className="mt-8 flex justify-center">
          <Button asChild className="shadow-primary">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
