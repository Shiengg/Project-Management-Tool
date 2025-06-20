import React from "react";
import { getTheme } from "./action";

export const theme = [
  {
    name: "color",
    background: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  },
  {
    name: "gradient",
    background: ["grad-1", "grad-2", "grad-3", "grad-4"],
  },
  {
    name: "image",
    background: ["img-1", "img-2", "img-3", "img-4"],
  },
];


export default async function ThemeManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();
  return (
    <div id="ThemeManager" className={`background-${theme} background-base`}>
      {children}
    </div>
  );
}
