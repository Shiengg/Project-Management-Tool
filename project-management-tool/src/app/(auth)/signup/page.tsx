"use client";
import Loader from "@/components/loader/Loader";
import { toastWarning } from "@/components/toast/toaster";
import React, { useState } from "react";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const phone_number = formData.get("phone_number") as string;
    const password = formData.get("password") as string;
    const confirm_password = formData.get("confirm_password") as string;

    if (password.length < 8) {
      toastWarning("Password must be at least 8 letters long");
    } else if (password !== confirm_password) {
      toastWarning("Password does not match");
    }

    setTimeout(() => setIsLoading(false), 500);
  };
  return (
    <div className="flex items-center justify-center h-screen  ">
      <div className="panel-1 flex flex-col  p-6">
        <h1 className="text-4xl font-bold mb-4 text-right">Sign up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-4 ">
            <div className="flex flex-col base-1 grow">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                maxLength={20}
                id="username"
                name="username"
                className="input-box"
                required
              />
            </div>
            <div className="flex flex-col base-1 grow">
              <label htmlFor="fullname">Full name</label>
              <input
                type="text"
                maxLength={50}
                id="fullname"
                name="fullname"
                className="input-box"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 ">
            <div className="flex flex-col base-1 grow">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                maxLength={30}
                id="email"
                name="email"
                className="input-box"
                required
              />
            </div>
            <div className="flex flex-col base-1 grow">
              <label htmlFor="phonenumber">Phone Number</label>
              <input
                type="tel"
                maxLength={10}
                id="phone_number"
                name="phon_enumber"
                className="input-box"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 ">
            <div className="flex flex-col base-1 grow">
              <label htmlFor="password">Password</label>
              <input
                maxLength={30}
                type="password"
                id="password"
                name="password"
                className="input-box"
                required
              />
            </div>
            <div className="flex flex-col base-1 grow">
              <label htmlFor="confirm_password">Confirm Password</label>
              <input
                maxLength={30}
                type="password"
                id="confirm_password"
                name="confirm_password"
                className="input-box"
                required
              />
            </div>
          </div>
          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? <Loader /> : "Sign up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
