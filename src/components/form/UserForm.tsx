"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";
import { Role, User as UserType } from "@/types/user";
import api from "@/lib/axiosInterceptor";

interface Props {
  user?: UserType;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

const UserForm = ({ user, onSuccess, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);

  // Basic Info
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  // Security
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Role & Status
  const [role, setRole] = useState<Role>(user?.role || "USER");
  const [emailVerified, setEmailVerified] = useState(
    user?.emailVerified ?? true,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !email.trim()) {
      alert("Name and email are required");
      return;
    }

    if (!user && !password) {
      alert("Password is required for new users");
      return;
    }

    if (password && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password && password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const userData: UserType = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        emailVerified,
      };

      // Only include password if provided
      if (password) {
        userData.password = password;
      }

      if (user) {
        await api.put(`/users/${user.id}`, userData);
      } else {
        await api.post("/users", userData);
      }

      setOpen(false);
      resetForm();
      onSuccess?.();
    } catch (err) {
      console.log("Error saving user:", err);
      const errorMessage = err || "Failed to save user. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setRole("USER");
    setEmailVerified(true);
    setActiveTab("basic");
    setShowPassword(false);
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant={user ? "outline" : "default"}>
            {user ? "Edit User" : "+ Add User"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {user ? "Edit User" : "Create New User"}
          </DialogTitle>
          <DialogDescription>
            {user
              ? "Update user information and permissions"
              : "Add a new user to the system"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-4 pt-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {email && !emailPattern.test(email) && (
                  <p className="text-sm text-red-500">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {phone &&
                  !phonePattern.test(phone.replace(/[\s\(\)\-]/g, "")) && (
                    <p className="text-sm text-red-500">
                      Please enter a valid phone number
                    </p>
                  )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  User Role *
                </Label>
                <Select
                  value={role}
                  onValueChange={(value: Role) => setRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        User - Basic access
                      </div>
                    </SelectItem>
                    <SelectItem value="SHOP_OWNER">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                        Shop - Shop management
                      </div>
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        Admin - Full system access
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Status */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="isActive" className="text-base">
                        Account Status
                      </Label>
                      <p className="text-sm text-gray-500">
                        {emailVerified
                          ? "User can access the system"
                          : "User account is disabled"}
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={emailVerified}
                      onCheckedChange={setEmailVerified}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 pt-4">
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {user ? "New Password" : "Password *"}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      user
                        ? "Leave blank to keep current"
                        : "Minimum 6 characters"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!user}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  {user
                    ? "Only enter if you want to change the password"
                    : "Set a secure password for the new user"}
                </p>
              </div>

              {/* Confirm Password */}
              {password && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={!!password}
                  />
                  {password !== confirmPassword && confirmPassword && (
                    <p className="text-sm text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>
              )}

              {/* Password Strength Indicator */}
              {password && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          Password Strength
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            password.length < 6
                              ? "w-1/4 bg-red-500"
                              : password.length < 8
                                ? "w-2/4 bg-yellow-500"
                                : /[A-Z]/.test(password) &&
                                    /[0-9]/.test(password) &&
                                    /[^A-Za-z0-9]/.test(password)
                                  ? "w-full bg-green-500"
                                  : "w-3/4 bg-orange-500"
                          }`}
                        />
                      </div>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li
                          className={`flex items-center gap-2 ${password.length >= 6 ? "text-green-600" : ""}`}
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${password.length >= 6 ? "bg-green-500" : "bg-gray-300"}`}
                          />
                          At least 6 characters
                        </li>
                        <li
                          className={`flex items-center gap-2 ${password.length >= 8 ? "text-green-600" : ""}`}
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                          />
                          At least 8 characters (recommended)
                        </li>
                        <li
                          className={`flex items-center gap-2 ${/[A-Z]/.test(password) && /[0-9]/.test(password) ? "text-green-600" : ""}`}
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(password) && /[0-9]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}
                          />
                          Include uppercase and numbers
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Security Note */}
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-800">
                      Security Note
                    </p>
                    <p className="text-xs text-blue-700">
                      • Passwords should be at least 6 characters long
                      <br />
                      • For better security, use a mix of letters, numbers, and
                      symbols
                      <br />• Users will be required to change their password on
                      first login
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <DialogFooter className="mt-6 pt-4 border-t">
              <div className="flex justify-between w-full">
                <div className="flex gap-2">
                  {activeTab === "security" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("basic")}
                    >
                      ← Back to Basic Info
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  {activeTab === "basic" ? (
                    <Button
                      type="button"
                      onClick={() => setActiveTab("security")}
                      disabled={
                        !name.trim() ||
                        !email.trim() ||
                        !emailPattern.test(email)
                      }
                    >
                      Continue to Security →
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={
                        loading ||
                        Boolean(password && password !== confirmPassword)
                      }
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          {user ? "Updating..." : "Creating..."}
                        </>
                      ) : user ? (
                        "Update User"
                      ) : (
                        "Create User"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
