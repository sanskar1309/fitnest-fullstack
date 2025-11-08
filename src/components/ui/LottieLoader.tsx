import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../public/Run Forrest Run.json";

export function LottieLoader() {
  return (
    <div className="w-40 h-40 mx-auto">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
}
