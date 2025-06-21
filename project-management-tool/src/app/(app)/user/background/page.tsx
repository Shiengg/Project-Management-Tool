'use client'
import { setTheme } from "@/components/theme/action";
import { theme } from "@/components/theme/ThemeManager";
import { Image } from "lucide-react";
import React from "react";

export default function Theme() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center text-2xl">
        <Image size={32}  />
        <span className="font-mono font-bold">Background</span>
      </div>

      <div className="flex flex-col gap-4 ">
        {theme.map((category) => (
          <div key={category.name}>
            <h2 className="text-lg  mb-2">{category.name}</h2>
            <div className="flex flex-wrap gap-3">
              {category.background.map((bg) => (
                <button
                  onClick={()=>setTheme(bg)}
                  key={bg}
                  className={`rounded-xl aspect-[2/1] max-w-[150px] grow min-w-[100px]  shadow-md background-base  background-${bg}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
