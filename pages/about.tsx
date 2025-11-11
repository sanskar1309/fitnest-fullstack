import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
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
              <Info className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">
              About Us
            </CardTitle>
            <CardDescription>
              At Fitnest, we believe in the power of fitness to transform lives. Our platform is dedicated to providing you with the resources and guidance you need to achieve your health and wellness goals. Whether you're a beginner or a seasoned fitness enthusiast, we are here to inspire and motivate you on your journey.
              <br />
              This project is built by a fellow fitness enthusiast who understands the challenges and triumphs of maintaining a healthy lifestyle. Our mission is to create a space where everyone can find their path to fitness and celebrate their progress together.
              <br />
              Join us as we embark on this journey towards better health and well-being. Together, we can make fitness a part of our everyday lives! 
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <Button asChild className="shadow-primary">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
