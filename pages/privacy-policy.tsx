import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
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
              <Shield className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Privacy Policy
            </CardTitle>
            <CardDescription className="text-lg">
              Last updated: {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 text-left">
            <div className="prose prose-lg max-w-none text-foreground">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-6">
                At FitNest, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and share your information when you use our services.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Information Collection</h2>
              <p className="text-muted-foreground mb-4">
                We collect information from you when you:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li>Register on our site</li>
                <li>Use our services</li>
                <li>Interact with our content</li>
              </ul>
              <p className="text-muted-foreground mb-6">
                The types of information we may collect include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li>Personal identification information (name, email address, etc.)</li>
                <li>Usage data (how you use our services)</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Use of Information</h2>
              <p className="text-muted-foreground mb-4">
                We may use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To notify you about changes to our services</li>
                <li>To allow you to participate in interactive features of our services when you choose to do so</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our services</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Sharing of Information</h2>
              <p className="text-muted-foreground mb-6">
                We do not sell or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li>Service providers who assist us in operating our website</li>
                <li>Law enforcement or regulatory authorities if required by law</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
              <p className="text-muted-foreground mb-6">
                We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or method of electronic storage is 100% secure.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">User Rights</h2>
              <p className="text-muted-foreground mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of any inaccurate information</li>
                <li>Request deletion of your personal information</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies</h2>
              <p className="text-muted-foreground mb-6">
                Our website may use cookies to enhance your experience. You can control cookie settings through your browser preferences.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground mb-6">
                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to the Privacy Policy</h2>
              <p className="text-muted-foreground mb-6">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about this Privacy Policy, please contact us at [your contact email].
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
