"use client";
import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Button } from "@/components/UI/button";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import { toastError, toastSuccess } from "@/components/toast/toaster";
import Loader from "@/components/loader/Loader";

export default function ChangePassword() {
  const { data: session } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const currentPassword = formData.get("current_password") as string;
      const newPassword = formData.get("new_password") as string;
      const confirmPassword = formData.get("confirm_password") as string;

      if (newPassword.length < 8) {
        toastError("New password must be at least 8 characters long");
        return;
      }

      if (newPassword !== confirmPassword) {
        toastError("New password and confirm password do not match");
        return;
      }

      const res = await fetch(`/api/user/${session?.user._id}/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      toastSuccess(data.message);
      formRef.current?.reset();
    } catch (error: any) {
      toastError(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-md border-2 border-white/20">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Change Password</h1>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="current_password" className="text-sm font-semibold text-white block">
                Current Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-white/70 group-hover:text-blue-300 transition-colors duration-200" />
                <Input
                  id="current_password"
                  name="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  maxLength={30}
                  placeholder="Enter current password"
                  className="pl-10 pr-10 h-12 w-full text-base rounded-lg border-2 border-white/20 bg-black/20 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder:text-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3 h-5 w-5 text-white/70 hover:text-blue-300 transition-colors duration-200 focus:outline-none"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-full w-full" />
                  ) : (
                    <Eye className="h-full w-full" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="new_password" className="text-sm font-semibold text-white block">
                New Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-white/70 group-hover:text-blue-300 transition-colors duration-200" />
                <Input
                  id="new_password"
                  name="new_password"
                  type={showNewPassword ? "text" : "password"}
                  maxLength={30}
                  placeholder="Enter new password"
                  className="pl-10 pr-10 h-12 w-full text-base rounded-lg border-2 border-white/20 bg-black/20 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder:text-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 h-5 w-5 text-white/70 hover:text-blue-300 transition-colors duration-200 focus:outline-none"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-full w-full" />
                  ) : (
                    <Eye className="h-full w-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="text-sm font-semibold text-white block">
                Confirm New Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-white/70 group-hover:text-blue-300 transition-colors duration-200" />
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  maxLength={30}
                  placeholder="Confirm new password"
                  className="pl-10 pr-10 h-12 w-full text-base rounded-lg border-2 border-white/20 bg-black/20 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder:text-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 h-5 w-5 text-white/70 hover:text-blue-300 transition-colors duration-200 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-full w-full" />
                  ) : (
                    <Eye className="h-full w-full" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
