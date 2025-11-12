import { AppProps } from "next/app";
import Head from "next/head";
import Script from 'next/script'
import { NextWebVitalsMetric } from 'next/app'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../src/components/theme/ThemeProvider";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { Header } from "../src/components/layout/Header";
import { Footer } from "../src/components/layout/Footer";
import { AuthProvider } from "../src/contexts/AuthContext";
import "../src/index.css";

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  const isAuthPage = Component.name === 'Auth' || Component.name === 'Login' || Component.name === 'Signup' || Component.name === 'NotFound';

  return (
    <>
      <Head>
        <link rel="icon" href="/heart.svg" />
        <title>Fitness Buddy</title>
        <link rel="canonical" href="https://fitnest-fullstack.vercel.app" />
        <meta name="description" content="Fitnest — All-in-one fitness and wellness tools: BMI, BMR, nutrition, meal planning, meditation and yoga." />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </Head>
      {/* Google Analytics: gtag.js - will only run when NEXT_PUBLIC_GA_ID is provided */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: false });`}
          </Script>
        </>
      )}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="fitness-buddy-theme">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <div className="min-h-screen flex flex-col">
                {!isAuthPage && <Header />}
              <main className="flex-1">
                <Component {...pageProps} />
              </main>
              {!isAuthPage && <Footer />}
            </div>
          </TooltipProvider>
        </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

// Report web vitals to analytics if GA ID is present.
export function reportWebVitals(metric: NextWebVitalsMetric) {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return;
  // Only send relevant metrics
  // Uses gtag (analytics.js) event shape
  const { name, delta, id: metricId, value } = metric as any;
  try {
    const gtag = (window as any).gtag;
    if (typeof gtag === 'function') {
      // map CLS to value, LCP to value, FCP/FID to delta
      gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: metricId,
        value: Math.round(name === 'CLS' ? value * 1000 : delta),
        non_interaction: true,
      });
    }
  } catch (e) {
    // ignore
  }
}
