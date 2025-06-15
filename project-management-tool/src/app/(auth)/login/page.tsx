"use client";
import Loader from "@/components/loader/Loader";
import { toastError, toastSuccess } from "@/components/toast/toaster";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (res?.error) {
        toastError(res.error);
      } else {
        // Redirect to the desired page after successful sign-in
        toastSuccess("logged in successfully");
        window.location.href = "/"; // Adjust to your desired redirect URL
      }
    } catch (error) {
      toastError("Failed to sign in");
      console.error(error);
    }
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="panel-1 flex flex-col  p-6">
        <h1 className="text-4xl font-bold mb-4">Sign in</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              maxLength={30}
              id="email"
              type="email"
              name="email"
              className="input-box"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              maxLength={30}
              id="password"
              type="password"
              name="password"
              className="input-box"
              required
            />
          </div>
          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? <Loader /> : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
