"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Check } from "lucide-react";

export default function SettingsPage() {
  const [schoolName, setSchoolName] = useState("ABC High School");
  const [schoolAddress, setSchoolAddress] = useState(
    "123 School Road, City - 400001"
  );
  const [schoolPhone, setSchoolPhone] = useState("1234567890");
  const [schoolEmail, setSchoolEmail] = useState("info@abcschool.com");
  const [upiId, setUpiId] = useState("school@upi");
  const [receiptPrefix, setReceiptPrefix] = useState("RCP");
  const [theme, setTheme] = useState("light");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-black">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your school information and preferences
        </p>
      </div>

      {/* Saved Notification */}
      {isSaved && (
        <div className="flex items-center gap-3 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-xs md:text-sm font-medium text-green-800">
            Settings saved successfully
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Settings */}
        <div className="col-span-1 lg:col-span-2 space-y-4 md:space-y-6">
          {/* School Information */}
          <Card className="p-4 md:p-6 border-gray-200">
            <h2 className="text-base md:text-lg font-semibold text-black mb-4 md:mb-6">
              School Information
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName" className="text-xs md:text-sm font-medium">
                  School Name
                </Label>
                <Input
                  id="schoolName"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="border-gray-200 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-xs md:text-sm font-medium">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  className="border-gray-200 resize-none h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={schoolPhone}
                    onChange={(e) => setSchoolPhone(e.target.value)}
                    className="border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={schoolEmail}
                    onChange={(e) => setSchoolEmail(e.target.value)}
                    className="border-gray-200"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Logo Upload */}
          <Card className="p-6 border-gray-200">
            <h2 className="text-lg font-semibold text-black mb-6">
              School Logo
            </h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Current logo: school-logo.png (updated 2 days ago)
            </p>
          </Card>

          {/* Payment Settings */}
          <Card className="p-6 border-gray-200">
            <h2 className="text-lg font-semibold text-black mb-6">
              Payment Settings
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upi" className="text-sm font-medium">
                  UPI ID for Collections
                </Label>
                <Input
                  id="upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="border-gray-200"
                  placeholder="school@upi"
                />
                <p className="text-xs text-gray-500">
                  This will be displayed in receipts and payment forms
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prefix" className="text-sm font-medium">
                  Receipt Number Prefix
                </Label>
                <Input
                  id="prefix"
                  value={receiptPrefix}
                  onChange={(e) => setReceiptPrefix(e.target.value)}
                  className="border-gray-200"
                  placeholder="RCP"
                  maxLength={5}
                />
                <p className="text-xs text-gray-500">
                  Example: {receiptPrefix}-2024-0001
                </p>
              </div>
            </div>
          </Card>

          {/* Display Settings */}
          <Card className="p-6 border-gray-200">
            <h2 className="text-lg font-semibold text-black mb-6">
              Display Settings
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-sm font-medium">
                  Theme
                </Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-black hover:bg-gray-900" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <Card className="p-6 border-gray-200">
            <h3 className="font-semibold text-black mb-4">Account Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Plan</p>
                <Badge className="mt-1 bg-black text-white border-0">Pro</Badge>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-medium text-black mt-1">Active</p>
              </div>
              <div>
                <p className="text-gray-600">Renewal Date</p>
                <p className="font-medium text-black mt-1">May 15, 2025</p>
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <Card className="p-6 border-gray-200">
            <h3 className="font-semibold text-black mb-4">Help & Support</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Documentation
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Contact Support
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Report Issue
              </Button>
            </div>
          </Card>

          {/* System Information */}
          <Card className="p-6 border-gray-200">
            <h3 className="font-semibold text-black mb-4">System Info</h3>
            <div className="space-y-3 text-xs">
              <div className="text-gray-600">
                <p>Version</p>
                <p className="text-black font-medium mt-1">1.0.0</p>
              </div>
              <div className="text-gray-600">
                <p>API Status</p>
                <p className="text-green-600 font-medium mt-1">• All systems operational</p>
              </div>
              <div className="text-gray-600">
                <p>Last Backup</p>
                <p className="text-black font-medium mt-1">Today at 2:00 AM</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
