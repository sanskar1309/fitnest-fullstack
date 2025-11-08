import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Target, TrendingUp, Utensils } from "lucide-react";
import { motion } from "framer-motion";

interface NutritionResult {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  bmr: number;
  tdee: number;
}

interface UserData {
  gender: "male" | "female";
  age: string;
  height: string;
  weight: string;
  activity: string;
  goal: string;
  unit: "metric" | "imperial";
}

const activityLevels = [
  { value: "1.2", label: "Sedentary (little/no exercise)" },
  { value: "1.375", label: "Light activity (light exercise 1-3 days/week)" },
  { value: "1.55", label: "Moderate activity (moderate exercise 3-5 days/week)" },
  { value: "1.725", label: "Very active (hard exercise 6-7 days/week)" },
  { value: "1.9", label: "Super active (very hard exercise, physical job)" }
];

const fitnessGoals = [
  { value: "weight-loss", label: "Weight Loss", modifier: -0.2 },
  { value: "maintenance", label: "Maintenance", modifier: 0 },
  { value: "muscle-gain", label: "Muscle Gain", modifier: 0.15 }
];

const calculateNutrition = (userData: UserData): NutritionResult => {
  const { gender, age, height, weight, activity, goal, unit } = userData;
  
  let heightInCm: number;
  let weightInKg: number;
  
  if (unit === "metric") {
    heightInCm = parseFloat(height);
    weightInKg = parseFloat(weight);
  } else {
    heightInCm = parseFloat(height) * 2.54; // inches to cm
    weightInKg = parseFloat(weight) * 0.453592; // lbs to kg
  }
  
  const ageNum = parseFloat(age);
  const activityMultiplier = parseFloat(activity);
  
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === "male") {
    bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageNum + 5;
  } else {
    bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageNum - 161;
  }
  
  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * activityMultiplier;
  
  // Apply goal modifier
  const goalData = fitnessGoals.find(g => g.value === goal);
  const goalModifier = goalData?.modifier || 0;
  const targetCalories = tdee * (1 + goalModifier);
  
  // Calculate macros based on goal
  let proteinRatio: number, carbRatio: number, fatRatio: number;
  
  switch (goal) {
    case "weight-loss":
      proteinRatio = 0.4; // Higher protein for satiety and muscle preservation
      carbRatio = 0.3;
      fatRatio = 0.3;
      break;
    case "muscle-gain":
      proteinRatio = 0.3; // Adequate protein for muscle building
      carbRatio = 0.45; // Higher carbs for energy
      fatRatio = 0.25;
      break;
    default: // maintenance
      proteinRatio = 0.25;
      carbRatio = 0.45;
      fatRatio = 0.3;
      break;
  }
  
  const protein = (targetCalories * proteinRatio) / 4; // 4 calories per gram
  const carbs = (targetCalories * carbRatio) / 4; // 4 calories per gram
  const fats = (targetCalories * fatRatio) / 9; // 9 calories per gram
  
  return {
    calories: Math.round(targetCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee)
  };
};

export default function Nutrition() {
  const [userData, setUserData] = useState<UserData>({
    gender: "male",
    age: "",
    height: "",
    weight: "",
    activity: "",
    goal: "",
    unit: "metric"
  });
  const [result, setResult] = useState<NutritionResult | null>(null);

  const handleCalculate = () => {
    if (!userData.age || !userData.height || !userData.weight || !userData.activity || !userData.goal) {
      return;
    }
    const nutritionResult = calculateNutrition(userData);
    setResult(nutritionResult);
  };

  const resetCalculator = () => {
    setUserData({
      gender: "male",
      age: "",
      height: "",
      weight: "",
      activity: "",
      goal: "",
      unit: "metric"
    });
    setResult(null);
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
            🍎 Nutrition Tracker
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Nutrition{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get personalized macro targets based on your goals and lifestyle
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Calculator Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-secondary">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Nutrition Calculator</CardTitle>
                    <CardDescription>Enter your details for personalized macros</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Unit Selector */}
                <div className="flex space-x-2">
                  <Button
                    variant={userData.unit === "metric" ? "default" : "outline"}
                    onClick={() => setUserData(prev => ({ ...prev, unit: "metric" }))}
                    className="flex-1"
                  >
                    Metric (cm/kg)
                  </Button>
                  <Button
                    variant={userData.unit === "imperial" ? "default" : "outline"}
                    onClick={() => setUserData(prev => ({ ...prev, unit: "imperial" }))}
                    className="flex-1"
                  >
                    Imperial (in/lbs)
                  </Button>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={userData.gender} onValueChange={(value: "male" | "female") => setUserData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={userData.age}
                    onChange={(e) => setUserData(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <Label htmlFor="height">
                    Height {userData.unit === "metric" ? "(cm)" : "(inches)"}
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder={userData.unit === "metric" ? "170" : "67"}
                    value={userData.height}
                    onChange={(e) => setUserData(prev => ({ ...prev, height: e.target.value }))}
                  />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight">
                    Weight {userData.unit === "metric" ? "(kg)" : "(lbs)"}
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder={userData.unit === "metric" ? "70" : "154"}
                    value={userData.weight}
                    onChange={(e) => setUserData(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </div>

                {/* Activity Level */}
                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <Select value={userData.activity} onValueChange={(value) => setUserData(prev => ({ ...prev, activity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fitness Goal */}
                <div className="space-y-2">
                  <Label>Fitness Goal</Label>
                  <Select value={userData.goal} onValueChange={(value) => setUserData(prev => ({ ...prev, goal: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {fitnessGoals.map((goal) => (
                        <SelectItem key={goal.value} value={goal.value}>
                          {goal.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={handleCalculate}
                    disabled={!userData.age || !userData.height || !userData.weight || !userData.activity || !userData.goal}
                    className="flex-1 shadow-primary"
                  >
                    Calculate Nutrition
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetCalculator}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {result ? (
              <Card className="shadow-secondary border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>Your Nutrition Plan</CardTitle>
                        <CardDescription>Daily macro targets</CardDescription>
                      </div>
                    </div>
                    <Badge variant="default">
                      {fitnessGoals.find(g => g.value === userData.goal)?.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Daily Calories */}
                  <div className="text-center p-6 bg-gradient-hero rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {result.calories}
                    </div>
                    <div className="text-muted-foreground">Daily Calories</div>
                  </div>

                  {/* Macros Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <div className="text-2xl font-bold text-energy mb-1">
                        {result.protein}g
                      </div>
                      <div className="text-sm text-muted-foreground">Protein</div>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <div className="text-2xl font-bold text-warning mb-1">
                        {result.carbs}g
                      </div>
                      <div className="text-sm text-muted-foreground">Carbs</div>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <div className="text-2xl font-bold text-success mb-1">
                        {result.fats}g
                      </div>
                      <div className="text-sm text-muted-foreground">Fats</div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Metabolic Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>BMR (Basal Metabolic Rate)</span>
                        <span className="font-medium">{result.bmr} calories</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TDEE (Total Daily Energy)</span>
                        <span className="font-medium">{result.tdee} calories</span>
                      </div>
                    </div>
                  </div>

                  {/* Macro Percentages */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Macro Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Protein</span>
                        <span>{Math.round((result.protein * 4 / result.calories) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-energy h-2 rounded-full" 
                          style={{ width: `${Math.round((result.protein * 4 / result.calories) * 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Carbohydrates</span>
                        <span>{Math.round((result.carbs * 4 / result.calories) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-warning h-2 rounded-full" 
                          style={{ width: `${Math.round((result.carbs * 4 / result.calories) * 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Fats</span>
                        <span>{Math.round((result.fats * 9 / result.calories) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-success h-2 rounded-full" 
                          style={{ width: `${Math.round((result.fats * 9 / result.calories) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-secondary">
                <CardContent className="flex items-center justify-center h-full py-16">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                      <Calculator className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Enter Your Details
                      </h3>
                      <p className="text-muted-foreground">
                        Fill in your information to get personalized nutrition targets
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
              <CardTitle className="text-center">About Nutrition Tracking</CardTitle>
              <CardDescription className="text-center">
                Understanding macros and their role in achieving your fitness goals
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Protein</h4>
                  <p>Essential for muscle building, repair, and maintenance. Helps with satiety and metabolic function.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Carbohydrates</h4>
                  <p>Primary energy source for your body and brain. Important for workout performance and recovery.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Fats</h4>
                  <p>Support hormone production, nutrient absorption, and provide sustained energy.</p>
                </div>
              </div>
              <p className="text-muted-foreground mt-6">
                <strong>Note:</strong> These calculations are estimates based on established formulas. Individual needs may vary. 
                Consult with a registered dietitian for personalized nutrition advice.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
