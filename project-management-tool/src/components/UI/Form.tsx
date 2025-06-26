"use client";
import { X } from "lucide-react";
import React, { useState } from "react";
import { createPortal } from "react-dom";

export default function Form({
  name,
  icon,
  form,
}: {
  name: string;
  icon: React.ReactNode;
  form: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const modal = (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div
        className="bg-black/70 rounded-lg max-w-2xl w-full h-fit max-h-screen p-2 flex flex-col gap-2"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center gap-2">
          <span className="font-mono text-xl">{name}</span>
          <button onClick={() => setIsOpen(false)} className="button-4 ml-auto">
            <X size={18} />
          </button>
        </div>

        {form}
      </div>
    </div>
  );
  return (
    <>
      {isOpen ? (
        createPortal(modal, document.body)
      ) : (
        <span onClick={() => setIsOpen(true)}>{icon}</span>
      )}
    </>
  );
}
