import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuotaIndicator } from "@/components/quota-indicator";
import { Crown, Zap, Settings as SettingsIcon } from "lucide-react";
import { Link } from "wouter";

export default function Settings() {
  const [currentUser] = useState({ id: 1 }); // Mock user - replace with actual auth

  const { data: quota } = useQuery({
    queryKey: ["/api/user/quota"],
    queryFn: async () => {
      const response = await fetch("/api/user/quota", {
        headers: { "user-id": currentUser.id.toString() }
      });
      return response.json();
    }
  });

  const subscriptionTiers = [
    {
      name: "Free",
      price: "£0/month",
      sparks: 10,
      features: ["1 Voice Profile", "Last 2 sparks offline"],
      current: quota?.subscriptionTier === "free"
    },
    {
      name: "Pro",
      price: "£9.99/month",
      sparks: 50,
      features: ["3 Voice Profiles", "Google Docs & Notion export", "Last 10 sparks offline"],
      current: quota?.subscriptionTier === "pro"
    },
    {
      name: "Creator",
      price: "£19.99/month",
      sparks: 200,
      features: ["Unlimited Voice Profiles", "All integrations", "Unlimited offline cache"],
      current: quota?.subscriptionTier === "creator"
    },
    {
      name: "Agency",
      price: "£49.99/month",
      sparks: "Unlimited",
      features: ["Everything in Creator", "Full API access", "CSV export"],
      current: quota?.subscriptionTier === "agency"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-xl font-bold text-gray-900">SparkDraft</h1>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">U</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
          <p className="text-gray-600">
            Manage your account, subscription, and preferences.
          </p>
        </div>

        {/* Current Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Current Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Monthly Sparks</span>
              {quota && (
                <QuotaIndicator 
                  sparksUsed={quota.sparksUsed} 
                  sparksLimit={quota.sparksLimit}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Plan</span>
              <Badge variant="outline" className="capitalize">
                {quota?.subscriptionTier || "Free"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Subscription Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscriptionTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`border rounded-lg p-4 ${
                    tier.current
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                    {tier.current && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-900">{tier.price}</span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">
                      {typeof tier.sparks === "number" 
                        ? `${tier.sparks} Sparks/month`
                        : `${tier.sparks} Sparks`
                      }
                    </span>
                  </div>
                  
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {!tier.current && (
                    <Link href="/subscribe">
                      <Button 
                        className="w-full"
                        variant={tier.name === "Pro" ? "default" : "outline"}
                      >
                        {tier.name === "Free" ? "Downgrade" : "Upgrade"}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
