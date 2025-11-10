import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../public/Run Forrest Run.json";
import { useTheme } from "@/components/theme/ThemeProvider";

export function LottieLoader() {
  const { theme } = useTheme();

  // Determine if dark mode is active
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

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
