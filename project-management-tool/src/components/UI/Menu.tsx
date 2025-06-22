"use client";
import { Ellipsis, X } from "lucide-react";
import React, { useEffect, useReducer, useRef, useState } from "react";

export default function Menu({
  name,
  icon,
  menu,
}: {
  name: string;
  icon: React.ReactNode;
  menu: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const menuEl = menuRef.current;
    if (!menuEl) return;

    // Reset position first (important if user opens/closes repeatedly)
    menuEl.style.position = "absolute";
    menuEl.style.left = "";
    menuEl.style.right = "";
    menuEl.style.top = "";
    menuEl.style.bottom = "";

    const rect = menuEl.getBoundingClientRect();

    const overflowLeft = rect.left < 0;
    const overflowRight = rect.right > window.innerWidth;
    const overflowBottom = rect.bottom > window.innerHeight;

    if (overflowLeft || overflowRight || overflowBottom) {
      menuEl.style.position = "fixed";
    }

    if (overflowBottom) {
      menuEl.style.bottom = "0";
      menuEl.style.top = "auto";
      menuEl.style.right = "auto";
      menuEl.style.left = "0";
    } 
    if (overflowLeft) {
      menuEl.style.left = "0";
      menuEl.style.right = "auto";
    } else if (overflowRight) {
      menuEl.style.right = "0";
      menuEl.style.left = "auto";
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="relative" ref={ref}>
      {open && (
        <div
          ref={menuRef}
          className="absolute top-[100%] right-0  overflow-hidden  z-50 shadow-md rounded-lg  outline-1 outline-gray-500/50  flex flex-col min-w-[250px] text-gray-400"
          style={{
            backgroundColor: `rgba(39, 39, 39, 1)`,
          }}
        >
          <div className="grid grid-cols-3 items-center gap-1 p-2 w-full h-auto">
            <div></div>
            <span className="font-semibold text-center">{name}</span>
            <button
              onClick={() => setOpen(false)}
              className="button-4 size-fit aspect-square ml-auto"
            >
              <X size={14} />
            </button>
          </div>
          <div className="max-h-[85vh] overflow-x-auto">{menu}</div>
        </div>
      )}

      <span onClick={() => setOpen((prev) => !prev)}>{icon}</span>
    </div>
  );
}
