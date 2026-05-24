import React from "react";
import * as Icons from "lucide-react";

export default function LucideIcon({ name, className = "", size = 20 }) {
  // Safe mapping lookup
  const IconComponent = Icons[name] || Icons.HelpCircle;
  return <IconComponent className={className} size={size} />;
}
