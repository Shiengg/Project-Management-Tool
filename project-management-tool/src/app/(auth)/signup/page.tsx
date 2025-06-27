"use client";
import Loader from "@/components/loader/Loader";
import { toastWarning, toastSuccess, toastError } from "@/components/toast/toaster";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phone_number") as string;
    const password = formData.get("password") as string;
    const confirm_password = formData.get("confirm_password") as string;

    if (password.length < 8) {
      toastWarning("Password must be at least 8 letters long");
      setIsLoading(false);
      return;
    } else if (password !== confirm_password) {
      toastWarning("Password does not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullname, phoneNumber, username }),
      });
      const data = await res.json();
      if (res.ok) {
        toastSuccess("Sign up successful! Please login.");
        window.location.href = "/login";
      } else {
        toastWarning(data.message || "Sign up failed");
      }
    } catch (error) {
      toastError("Sign up failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4 md:p-8">
      <div className="panel-1 flex flex-col w-full max-w-[520px] p-4 sm:p-6 md:p-8 backdrop-blur-sm bg-black/30 rounded-xl sm:rounded-2xl shadow-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">Sign up</h1>
        <p className="text-gray-100 text-sm sm:text-base mb-4 sm:mb-6">Create your account to get started!</p>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-white block">
                  Username
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-white/70 group-hover:text-blue-300 transition-colors duration-200" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    maxLength={20}
                    placeholder="Enter username"
                    className="pl-10 h-10 sm:h-12 w-full text-sm sm:text-base rounded-lg border-2 border-white/20 bg-black/20 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder:text-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="fullname" className="text-sm font-semibold text-white block">
                  Full Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-white/70 group-hover:text-blue-300 transition-colors duration-200" />
                  <Input
                    id="fullname"
                    name="fullname"
                    type="text"
                    maxLength={50}
                    placeholder="Enter full name"
                    className="pl-10 h-10 sm:h-12 w-full text-sm sm:text-base rounded-lg border-2 border-white/20 bg-black/20 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder:text-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-white block">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-white/70 group-hover:text-blue-300 transition-colors duration-200" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    maxLength={30}
                    placeholder="Enter email"
                    className="pl-10 h-10 sm:h-12 w-full text-sm sm:text-base rounded-lg border-2 border-white/20 bg-black/20 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder:text-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="phone_number" className="text-sm font-semibold text-white block">
                  Phone Number
                </Label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-white/70 group-hover:text-blue-300 transition-colors duration-200" />
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    maxLength={10}
                    placeholder="Enter phone number"
                    className="pl-10 h-10 sm:h-12 w-full text-sm sm:text-base rounded-lg border-2 border-white/20 bg-black/20 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder:text-gray-300"
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
                    name="password"
                    type="password"
                    maxLength={30}
                    placeholder="Enter password"
                    className="pl-10 h-10 sm:h-12 w-full text-sm sm:text-base rounded-lg border-2 border-white/20 bg-black/20 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder:text-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="confirm_password" className="text-sm font-semibold text-white block">
                  Confirm Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 sm:h-5 w-4 sm:w-5 text-white/70 group-hover:text-blue-300 transition-colors duration-200" />
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    maxLength={30}
                    placeholder="Confirm password"
                    className="pl-10 h-10 sm:h-12 w-full text-sm sm:text-base rounded-lg border-2 border-white/20 bg-black/20 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder:text-gray-300"
                    required
                  />
                </div>
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
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Create Account</span>
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-sm text-gray-200">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-300 hover:text-blue-200 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Additional Features */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
            <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-200">
              <span className="flex items-center space-x-1.5 sm:space-x-2">
                <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-green-400" />
                <span>Secure Sign Up</span>
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
