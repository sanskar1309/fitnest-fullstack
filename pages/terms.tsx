import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-primary border-border/50">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Terms of Service
            </CardTitle>
            <CardDescription className="text-lg">
              Last updated: {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 text-left">
            <div className="prose prose-lg max-w-none text-foreground">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-6">
                Welcome to FitNest. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using FitNest, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-6">
                By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Description of Service</h2>
              <p className="text-muted-foreground mb-6">
                FitNest provides health and fitness tools including BMI and BMR calculators, nutrition guides, meal planning, yoga poses, meditation practices, and wellness resources. Our services are intended for informational purposes only and are not a substitute for professional medical advice.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">User Accounts</h2>
              <p className="text-muted-foreground mb-4">
                To access certain features, you may need to create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and up-to-date information</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Use of Service</h2>
              <p className="text-muted-foreground mb-4">
                You agree to use our services only for lawful purposes and in accordance with these Terms. You shall not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li>Use our services in any way that violates applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our services</li>
                <li>Use our services to transmit harmful or malicious content</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground mb-6">
                All content, features, and functionality on FitNest are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">User-Generated Content</h2>
              <p className="text-muted-foreground mb-6">
                If you submit content to our services, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, display, and distribute such content in connection with our services.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Termination</h2>
              <p className="text-muted-foreground mb-6">
                We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimer of Warranties</h2>
              <p className="text-muted-foreground mb-6">
                Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, error-free, or secure.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground mb-6">
                In no event shall FitNest be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our services.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Governing Law</h2>
              <p className="text-muted-foreground mb-6">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground mb-6">
                We reserve the right to modify these Terms at any time. We will notify users of any changes by posting the updated Terms on this page. Your continued use of our services after such changes constitutes acceptance of the new Terms.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about these Terms, please contact us at rmaharwade@gmail.com.
              </p>
            </div>

            <div className="text-center pt-6 border-t border-border/50">
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
