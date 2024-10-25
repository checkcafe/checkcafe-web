import { Loader2 } from "lucide-react";
import React from "react";
export default function LoadingSpinner({
  size = "default",
  color = "text-white",
}: {
  size?: "small" | "default" | "large";
  color?: string;
}) {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin ${sizeClasses[size]} ${color}`} />
    </div>
  );
}
