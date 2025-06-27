"use client";
import { getTheme, setTheme } from "@/components/theme/action";
import { theme } from "@/components/theme/ThemeManager";
import { Image } from "lucide-react";
import React from "react";

export default function Theme() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center text-2xl">
        <Image size={32} />
        <span className="font-mono font-bold">Background</span>
      </div>

      <div className="flex flex-wrap gap-2  ">
        {theme.map((category) => (
          <div key={category.name} className=" min-w-[200px] grow">
            <h2 className=" font-semibold mb-2">{category.name}</h2>
            <div className="grid grid-cols-2 gap-1">
              {category.background.map((bg) => (
                <button
                  type="button"
                  onClick={() => setTheme(bg)}
                  key={bg}
                  className={`rounded aspect-[2/1] w-full  shadow-md background-base  background-${bg} cursor-pointer`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
