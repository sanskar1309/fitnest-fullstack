import { useState } from "react";
import Head from 'next/head'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Zap, Info, Activity, Flame, Utensils } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface BMRResult {
  bmr: number;
  tdee: {
    sedentary: number;
    light: number;
    moderate: number;
    active: number;
    veryActive: number;
  };
  selectedActivity: string;
  dailyCalories: number;
}

const activityLevels = {
  sedentary: { multiplier: 1.2, label: "Sedentary", description: "Little to no exercise" },
  light: { multiplier: 1.375, label: "Lightly Active", description: "Light exercise 1-3 days/week" },
  moderate: { multiplier: 1.55, label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
  active: { multiplier: 1.725, label: "Very Active", description: "Hard exercise 6-7 days/week" },
  veryActive: { multiplier: 1.9, label: "Extremely Active", description: "Very hard exercise, physical job" }
};

export default function BMR() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityLevel, setActivityLevel] = useState<keyof typeof activityLevels>("moderate");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [result, setResult] = useState<BMRResult | null>(null);

  const calculateBMR = () => {
    if (!height || !weight || !age) return;

    let heightInCm: number;
    let weightInKg: number;

    if (unit === "metric") {
      heightInCm = parseFloat(height);
      weightInKg = parseFloat(weight);
    } else {
      heightInCm = parseFloat(height) * 2.54; // inches to cm
      weightInKg = parseFloat(weight) * 0.453592; // lbs to kg
    }

    // Harris-Benedict Equation (Revised)
    let bmr: number;
    if (gender === "male") {
      bmr = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * parseFloat(age));
    } else {
      bmr = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * parseFloat(age));
    }

    const tdee = {
      sedentary: bmr * activityLevels.sedentary.multiplier,
      light: bmr * activityLevels.light.multiplier,
      moderate: bmr * activityLevels.moderate.multiplier,
      active: bmr * activityLevels.active.multiplier,
      veryActive: bmr * activityLevels.veryActive.multiplier
    };

    setResult({
      bmr,
      tdee,
      selectedActivity: activityLevel,
      dailyCalories: tdee[activityLevel]
    });
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setAge("");
    setResult(null);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-hero">
      <Head>
        <title>BMR Calculator — Fitnest</title>
        <meta name="description" content="Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to estimate daily calorie needs." />
        <link rel="canonical" href="https://fitnest-fullstack.vercel.app/bmr" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Fitnest BMR Calculator",
          "url": "https://fitnest-fullstack.vercel.app/bmr",
          "description": "BMR calculator to estimate basal metabolic rate and calorie needs.",
          "applicationCategory": "HealthApplication"
        }) }} />
      </Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            ⚡ Metabolism Calculator
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            BMR{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Calculate your Basal Metabolic Rate and daily calorie needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Calculator Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="shadow-secondary">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>BMR Calculator</CardTitle>
                    <CardDescription>Enter your details below</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Unit Selector */}
                <div className="flex space-x-2">
                  <Button
                    variant={unit === "metric" ? "default" : "outline"}
                    onClick={() => setUnit("metric")}
                    className="flex-1"
                    size="sm"
                  >
                    Metric
                  </Button>
                  <Button
                    variant={unit === "imperial" ? "default" : "outline"}
                    onClick={() => setUnit("imperial")}
                    className="flex-1"
                    size="sm"
                  >
                    Imperial
                  </Button>
                </div>

                {/* Gender */}
                <div className="space-y-3">
                  <Label>Gender</Label>
                  <RadioGroup value={gender} onValueChange={(value: "male" | "female") => setGender(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <Label htmlFor="height">
                    Height {unit === "metric" ? "(cm)" : "(inches)"}
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder={unit === "metric" ? "170" : "67"}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight">
                    Weight {unit === "metric" ? "(kg)" : "(lbs)"}
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder={unit === "metric" ? "70" : "154"}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>

                {/* Activity Level */}
                <div className="space-y-2">
                  <Label htmlFor="activity">Activity Level</Label>
                  <Select value={activityLevel} onValueChange={(value: keyof typeof activityLevels) => setActivityLevel(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(activityLevels).map(([key, level]) => (
                        <SelectItem key={key} value={key}>
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-xs text-muted-foreground">{level.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={calculateBMR}
                    disabled={!height || !weight || !age}
                    className="flex-1 shadow-primary"
                  >
                    Calculate BMR
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetCalculator}
                    disabled={!height && !weight && !age && !result}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {result ? (
              <>
                {/* BMR Result */}
                <Card className="shadow-secondary border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Flame className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>Your BMR Result</CardTitle>
                        <CardDescription>Basal Metabolic Rate</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6 bg-gradient-hero rounded-lg">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {Math.round(result.bmr)}
                      </div>
                      <div className="text-muted-foreground">Calories per day at rest</div>
                    </div>
                  </CardContent>
                </Card>

                {/* TDEE Results */}
                <Card className="shadow-secondary">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>Daily Calorie Needs (TDEE)</CardTitle>
                        <CardDescription>Total Daily Energy Expenditure</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(activityLevels).map(([key, level]) => (
                        <div
                          key={key}
                          className={`p-4 rounded-lg border transition-colors ${
                            key === result.selectedActivity
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-foreground">{level.label}</h4>
                            <Badge variant={key === result.selectedActivity ? "default" : "outline"}>
                              {Math.round(result.tdee[key as keyof typeof result.tdee])} cal/day
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Goal Recommendations */}
                <Card className="shadow-secondary">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="w-5 h-5 mr-2" />
                      Goal-Based Recommendations
                    </CardTitle>
                    <CardDescription>
                      Calorie targets based on your selected activity level
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-hero rounded-lg">
                        <div className="text-2xl font-bold text-destructive mb-1">
                          {Math.round(result.dailyCalories - 500)}
                        </div>
                        <div className="text-sm text-muted-foreground">Weight Loss</div>
                        <div className="text-xs text-muted-foreground mt-1">-1 lb/week</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-hero rounded-lg">
                        <div className="text-2xl font-bold text-success mb-1">
                          {Math.round(result.dailyCalories)}
                        </div>
                        <div className="text-sm text-muted-foreground">Maintenance</div>
                        <div className="text-xs text-muted-foreground mt-1">Current weight</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-hero rounded-lg">
                        <div className="text-2xl font-bold text-energy mb-1">
                          {Math.round(result.dailyCalories + 500)}
                        </div>
                        <div className="text-sm text-muted-foreground">Weight Gain</div>
                        <div className="text-xs text-muted-foreground mt-1">+1 lb/week</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-secondary border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Try AI Meal Planner</CardTitle>
                      <CardDescription>Use your BMR & TDEE to craft a meal plan</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Want individualized meal plans tailored to your calculated daily calorie needs? Our AI Meal Planner can create tasty, balanced options.
                  </p>
                  <Link href="/meal-planner">
                    <Button className="shadow-primary">Open AI Meal Planner</Button>
                  </Link>
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
              <CardTitle className="text-center">About BMR & TDEE</CardTitle>
              <CardDescription className="text-center">
                Understanding your metabolism and energy needs
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">BMR (Basal Metabolic Rate)</h4>
                  <p className="text-muted-foreground text-sm">
                    The number of calories your body needs to maintain basic physiological functions 
                    like breathing, circulation, and cell production while at rest.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">TDEE (Total Daily Energy Expenditure)</h4>
                  <p className="text-muted-foreground text-sm">
                    Your BMR plus the calories burned through physical activity, exercise, and 
                    daily movement. This represents your total calorie needs per day.
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mt-4">
                <strong>Note:</strong> These calculations are estimates based on general formulas. 
                Individual metabolic rates can vary. Consult with healthcare providers for personalized advice.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
