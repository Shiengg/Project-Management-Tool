import { Ellipsis, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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
    <div className="relative" ref={ref} >
      {open && (
        <div
          className="fixed bottom-2 right-2 sm:top-full sm:left-0 sm:bottom-auto sm:right-auto overflow-hidden sm:absolute  z-50 shadow-md rounded-lg  outline-1 text-inherit flex flex-col min-w-[200px]"
          style={{
            backgroundColor: `rgba(39, 39, 39, 1)`,
          }}
        >
          <div className="grid grid-cols-3 items-center gap-1 py-1 px-2 w-full h-auto">
            <div></div>
            <span className="font-semibold text-center">{name}</span>
            <button
              onClick={() => setOpen(false)}
              className="button-4 size-fit aspect-square ml-auto"
            >
              <X size={14} />
            </button>
          </div>
          {menu}
        </div>
      )}

      <span onClick={() => setOpen((prev) => !prev)}>{icon}</span>
    </div>
  );
}
