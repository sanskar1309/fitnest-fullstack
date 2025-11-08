import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Zap,
  Apple,
  Brain,
  Heart,
  Users,
  ChevronRight,
  Star,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Calculator,
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index and Basal Metabolic Rate instantly",
    href: "/bmi",
    color: "text-primary"
  },
  {
    icon: Calculator,
    title: "BMR Calculator",
    description: "Determine your daily calorie needs based on your metabolism",
    href: "/bmr",
    color: "text-accent"
  },
  {
    icon: Apple,
    title: "Nutrition Calculator",
    description: "Track calories, macros, and nutrients for optimal health",
    href: "/nutrition",
    color: "text-success"
  },
  {
    icon: Brain,
    title: "AI Meal Planner",
    description: "Personalized meal plans powered by artificial intelligence",
    href: "/meal-planner",
    color: "text-energy"
  },
  {
    icon: Heart,
    title: "Yoga & Meditation",
    description: "Guided yoga sessions and mindfulness practices",
    href: "/yoga",
    color: "text-warning"
  },
  // {
  //   icon: Users,
  //   title: "Mental Health",
  //   description: "Resources and tools for mental wellness support",
  //   href: "/mental-health",
  //   color: "text-accent"
  // },
  // {
  //   icon: Zap,
  //   title: "Fitness Tracking",
  //   description: "Monitor your progress and stay motivated",
  //   href: "/",
  //   color: "text-primary"
  // }
];

const benefits = [
  "All-in-one health platform",
  "AI-powered recommendations",
  // "Professional guidance",
  "Track your progress",
  // "Community support"
];

const stats = [
  { number: "50K+", label: "Active Users" },
  { number: "1M+", label: "Workouts Completed" },
  { number: "98%", label: "User Satisfaction" },
  { number: "24/7", label: "Support Available" }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img
            src="/fitness-hero.jpg"
            alt="Fitness lifestyle"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
                🎯 Your Complete Health Companion
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Your{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Fitness Buddy
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Everything you need for a healthier lifestyle in one platform.
                BMI calculations, meal planning, yoga and more.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="shadow-primary" asChild>
                  <Link href="/bmi">
                    Get Started Free
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>

              {/* <div className="flex items-center justify-center lg:justify-start mt-8 space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-background" />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-semibold">4.9</span>
                    <span>from 50K+ users</span>
                  </div>
                </div>
              </div> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="w-full h-96 bg-gradient-primary rounded-2xl shadow-primary" />
                <div className="absolute inset-4 bg-background rounded-xl flex items-center justify-center">
                  <div className="text-center ">
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">“Once you are exercising regularly, the hardest thing is to stop it.” </h3>
                    <p className="text-muted-foreground">– Erin Gray</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              🚀 Comprehensive Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need for{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Optimal Health
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with proven health methodologies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-secondary transition-all duration-300 group cursor-pointer border-border/50">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button variant="ghost" asChild className="group-hover:bg-primary/10">
                      <Link href={feature.href}>
                        Explore Feature
                        <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-4">
                ✨ Why Choose Us
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Your Health Journey{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Simplified
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We believe health should be accessible, enjoyable, and sustainable.
                That's why we've created a platform that brings together everything
                you need in one beautiful, easy-to-use interface.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-full h-80 bg-gradient-secondary rounded-2xl shadow-secondary opacity-70" />
              <div className="absolute inset-8 bg-background rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Smart Analytics</h3>
                  <p className="text-muted-foreground">AI-powered insights for better results</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-hero rounded-3xl p-12 shadow-primary"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to Start Your{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Health Journey?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their lives with Your Fitness Buddy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="shadow-primary" asChild>
                <Link href="/signup">
                  Start Free Today
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/bmi">Try BMI Calculator</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

