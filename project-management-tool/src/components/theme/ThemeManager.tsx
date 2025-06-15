import React from "react";
import { getTheme } from "./action";

export default async function ThemeManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();
  return (
    <div id="ThemeManager" className={`background-${theme}`}>
      {children}
    </div>
  );
}
