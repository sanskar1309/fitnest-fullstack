import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import defaultAnimationData from "../../../public/Box Breathing V6.json";
import { useTheme } from "@/components/theme/ThemeProvider";

interface LottieLoaderProps {
  animationData?: any;
}

export function LottieLoader({ animationData = defaultAnimationData }: LottieLoaderProps) {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDark(mediaQuery.matches);
    } else {
      setIsDark(theme === "dark");
    }
  }, [theme]);

  return (
    <div className="w-40 h-40 mx-auto">
      <Lottie
        animationData={animationData}
        loop={true}
        style={{
          filter: isDark ? "invert(1)" : "none",
        }}
      />
    </div>
  );
}
