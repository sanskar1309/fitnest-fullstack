import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route"
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-primary border-border/50">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-white">404</span>
            </div>
            <CardTitle className="text-2xl font-bold">
              Oops! Page not found
            </CardTitle>
            <CardDescription>
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Don't worry, let's get you back on track with your fitness journey!
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1 shadow-primary">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => window.history.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold text-foreground mb-3">Popular Pages</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Link
                  href="/bmi"
                  className="text-primary hover:underline p-2 rounded hover:bg-primary/5 transition-colors"
                >
                  BMI Calculator
                </Link>
                <Link
                  href="/bmr"
                  className="text-primary hover:underline p-2 rounded hover:bg-primary/5 transition-colors"
                >
                  BMR Calculator
                </Link>
                <Link
                  href="/nutrition"
                  className="text-primary hover:underline p-2 rounded hover:bg-primary/5 transition-colors"
                >
                  Nutrition Guide
                </Link>
                <Link
                  href="/meal-planner"
                  className="text-primary hover:underline p-2 rounded hover:bg-primary/5 transition-colors"
                >
                  Meal Planner
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;
