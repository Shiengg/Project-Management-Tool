"use client";
import Loader from "@/components/loader/Loader";
import { toastError, toastSuccess } from "@/components/toast/toaster";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/card"
import { Input } from "@/components/UI/input"
import { Label } from "@/components/UI/label"
import { Button } from "@/components/UI/button"
import { Mail, Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex items-center justify-center min-h-screen w-full p-4 md:p-8">
      <div className="panel-1 flex flex-col w-full max-w-[420px] p-4 sm:p-6 md:p-8 backdrop-blur-sm bg-black/30 rounded-xl sm:rounded-2xl shadow-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">Sign in</h1>
        <p className="text-gray-100 text-sm sm:text-base mb-4 sm:mb-6">Welcome back! Please enter your details.</p>
        <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-white block">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-white/70 group-hover:text-blue-300 transition-colors duration-200" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="pl-10 h-10 sm:h-12 w-full text-sm sm:text-base rounded-lg border-2 border-white/20 bg-black/20 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder:text-gray-300"
                    maxLength={30}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-white block">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-white/70 group-hover:text-blue-300 transition-colors duration-200" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-10 sm:h-12 w-full text-sm sm:text-base rounded-lg border-2 border-white/20 bg-black/20 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder:text-gray-300"
                    maxLength={30}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-white/70 hover:text-blue-300 transition-colors duration-200 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-full w-full" />
                    ) : (
                      <Eye className="h-full w-full" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 sm:h-12 bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm text-gray-200">
                Don't have an account?{" "}
                <Link href="/signup" className="font-semibold text-blue-300 hover:text-blue-200 transition-colors">
                  Create account
                </Link>
              </p>
            </div>

            {/* Additional Features */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-200">
                <span className="flex items-center space-x-1.5 sm:space-x-2">
                  <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-green-400" />
                  <span>Secure Login</span>
                </span>
                <span className="flex items-center space-x-1.5 sm:space-x-2">
                  <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-green-400" />
                  <span>24/7 Support</span>
                </span>
              </div>
            </div>
          </CardContent>
      </div>
    </div>
  );
}
