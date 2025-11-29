import { useState } from "react";
import Head from 'next/head'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Info, TrendingUp, Utensils } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface BMIResult {
  bmi: number;
  category: string;
  status: "underweight" | "normal" | "overweight" | "obese";
  recommendations: string[];
}

const getBMICategory = (bmi: number): BMIResult => {
  if (bmi < 18.5) {
    return {
      bmi,
      category: "Underweight",
      status: "underweight",
      recommendations: [
        "Consider consulting with a healthcare provider",
        "Focus on nutrient-dense foods",
        "Include strength training in your routine",
        "Consider healthy weight gain strategies"
      ]
    };
  } else if (bmi >= 18.5 && bmi < 25) {
    return {
      bmi,
      category: "Normal Weight",
      status: "normal",
      recommendations: [
        "Maintain your current healthy lifestyle",
        "Continue regular physical activity",
        "Keep a balanced diet",
        "Regular health check-ups"
      ]
    };
  } else if (bmi >= 25 && bmi < 30) {
    return {
      bmi,
      category: "Overweight",
      status: "overweight",
      recommendations: [
        "Focus on gradual weight loss",
        "Increase physical activity",
        "Consider portion control",
        "Consult with a nutritionist"
      ]
    };
  } else {
    return {
      bmi,
      category: "Obese",
      status: "obese",
      recommendations: [
        "Consult with healthcare professionals",
        "Create a structured weight loss plan",
        "Focus on sustainable lifestyle changes",
        "Consider professional nutritional guidance"
      ]
    };
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "underweight": return "text-energy";
    case "normal": return "text-success";
    case "overweight": return "text-warning";
    case "obese": return "text-destructive";
    default: return "text-muted-foreground";
  }
};

const getBadgeVariant = (status: string) => {
  switch (status) {
    case "normal": return "default";
    case "underweight": return "secondary";
    case "overweight": return "secondary";
    case "obese": return "destructive";
    default: return "secondary";
  }
};

export default function BMI() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculateBMI = () => {
    if (!height || !weight) return;

    let heightInMeters: number;
    let weightInKg: number;

    if (unit === "metric") {
      heightInMeters = parseFloat(height) / 100; // cm to m
      weightInKg = parseFloat(weight);
    } else {
      heightInMeters = parseFloat(height) * 0.0254; // inches to m
      weightInKg = parseFloat(weight) * 0.453592; // lbs to kg
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters);
    setResult(getBMICategory(bmi));
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setResult(null);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-hero">
      <Head>
        <title>BMI Calculator — Fitnest</title>
        <meta name="description" content="Calculate your Body Mass Index (BMI) and get personalized recommendations to improve health." />
        <link rel="canonical" href="https://fitnest-fullstack.vercel.app/bmi" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Fitnest BMI Calculator",
          "url": "https://fitnest-fullstack.vercel.app/bmi",
          "description": "BMI calculator to estimate body mass index and provide health recommendations.",
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
            📏 Health Calculator
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            BMI{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Calculate your Body Mass Index and get personalized health recommendations
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
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>BMI Calculator</CardTitle>
                    <CardDescription>Enter your measurements below</CardDescription>
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
                  >
                    Metric (cm/kg)
                  </Button>
                  <Button
                    variant={unit === "imperial" ? "default" : "outline"}
                    onClick={() => setUnit("imperial")}
                    className="flex-1"
                  >
                    Imperial (in/lbs)
                  </Button>
                </div>

                {/* Height Input */}
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
                    className="text-lg"
                  />
                </div>

                {/* Weight Input */}
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
                    className="text-lg"
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={calculateBMI}
                    disabled={!height || !weight}
                    className="flex-1 shadow-primary"
                  >
                    Calculate BMI
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetCalculator}
                    disabled={!height && !weight && !result}
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
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>Your BMI Result</CardTitle>
                        <CardDescription>Based on your measurements</CardDescription>
                      </div>
                    </div>
                    <Badge variant={getBadgeVariant(result.status)}>
                      {result.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* BMI Score */}
                  <div className="text-center p-6 bg-gradient-hero rounded-lg">
                    <div className={`text-4xl font-bold ${getStatusColor(result.status)} mb-2`}>
                      {result.bmi.toFixed(1)}
                    </div>
                    <div className="text-muted-foreground">BMI Score</div>
                  </div>

                  {/* BMI Categories */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      BMI Categories
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Underweight</span>
                        <span className="text-energy">Below 18.5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Normal weight</span>
                        <span className="text-success">18.5 - 24.9</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overweight</span>
                        <span className="text-warning">25.0 - 29.9</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Obese</span>
                        <span className="text-destructive">30.0 and above</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Recommendations</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-secondary border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Try AI Meal Planner</CardTitle>
                      <CardDescription>Get personalized meal plans based on your results</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Want meal recommendations tailored to your BMI and goals? Use our AI Meal Planner to generate simple, balanced meal plans and recipes.
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
              <CardTitle className="text-center">About BMI</CardTitle>
              <CardDescription className="text-center">
                Understanding Body Mass Index and its limitations
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-muted-foreground">
                BMI is a measure of body fat based on height and weight. While it's a useful screening tool,
                it doesn't directly measure body fat percentage and may not be accurate for athletes,
                pregnant women, or elderly individuals. It's best used in conjunction with other health assessments.
              </p>
              <p className="text-muted-foreground mt-4">
                <strong>Note:</strong> This calculator is for educational purposes only and should not replace
                professional medical advice. Always consult with healthcare providers for personalized health guidance.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
