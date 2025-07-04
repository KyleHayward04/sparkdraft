import React, { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { QuotaIndicator } from "@/components/quota-indicator";
import { Zap } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { data: quota } = useQuery<{ sparksUsed: number; sparksLimit: number; subscriptionTier: string }>({
    queryKey: ["/api/user/quota"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-xl font-bold text-gray-900">SparkDraft</h1>
            </div>
            <div className="flex items-center space-x-4">
              {quota && (
                <div className="hidden sm:block">
                  <QuotaIndicator 
                    sparksUsed={quota.sparksUsed} 
                    sparksLimit={quota.sparksLimit}
                    clickable={true}
                    onClick={() => window.location.href = "/subscribe"}
                  />
                </div>
              )}
              <ProfileDropdown userId={1} />
            </div>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
}