import { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../src/components/theme/ThemeProvider";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { Header } from "../src/components/layout/Header";
import { Footer } from "../src/components/layout/Footer";
import "../src/index.css";

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  const isAuthPage = Component.name === 'Auth' || Component.name === 'Login' || Component.name === 'Signup' || Component.name === 'NotFound';

  return (
    <>
      <Head>
        <link rel="icon" href="/heart.svg" />
        <title>Fitness Buddy</title>
      </Head>
      <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
    </>
  );
}
