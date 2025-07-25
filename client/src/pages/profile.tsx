import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { QuotaIndicator } from "@/components/quota-indicator";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Zap, User, Mail, Crown, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [currentUser] = useState({ id: 1 }); // Mock user
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "Demo User",
    email: "demo@sparkdraft.com"
  });
  const { toast } = useToast();

  const { data: quota } = useQuery({
    queryKey: ["/api/user/quota"],
    queryFn: async () => {
      const response = await fetch("/api/user/quota", {
        headers: { "user-id": currentUser.id.toString() }
      });
      return response.json();
    }
  });

  const handleSave = () => {
    // Here you would normally save to the backend
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleQuotaClick = () => {
    window.location.href = "/subscribe";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Profile</h1>
          <p className="text-gray-600">
            Manage your account information and subscription.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-xl">
                        DU
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                    <p className="text-sm text-gray-500">
                      Click the camera icon to upload a new picture
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 pt-4">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave}>
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Plan</span>
                  <Badge variant="outline" className="capitalize">
                    {quota?.subscriptionTier || "Free"}
                  </Badge>
                </div>
                
                {quota && (
                  <div 
                    className="cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                    onClick={handleQuotaClick}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Monthly Sparks</span>
                    </div>
                    <QuotaIndicator 
                      sparksUsed={quota.sparksUsed} 
                      sparksLimit={quota.sparksLimit}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Click to upgrade your plan
                    </p>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleQuotaClick}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Account Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Projects Created</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Favorites</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm text-gray-900">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}