import React, { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { QuotaIndicator } from "@/components/quota-indicator";
import { Button } from "@/components/ui/button";
import { Zap, Home, BookOpen, Heart, User as UserIcon, Sparkles } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { data: quota } = useQuery<{ sparksUsed: number; sparksLimit: number; subscriptionTier: string }>({
    queryKey: ["/api/user/quota"],
  });

  const [location] = useLocation();
  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Zap className="h-10 w-10 text-primary" />
                    <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">SparkDraft</h1>
                    <p className="text-sm text-gray-500">AI Content Creator</p>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/">
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2 h-10"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
              
              <Link href="/projects">
                <Button 
                  variant={isActive('/projects') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2 h-10"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Projects</span>
                </Button>
              </Link>
              
              <Link href="/favorites">
                <Button 
                  variant={isActive('/favorites') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2 h-10"
                >
                  <Heart className="h-4 w-4" />
                  <span>Favorites</span>
                </Button>
              </Link>
              
              <Link href="/profile">
                <Button 
                  variant={isActive('/profile') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2 h-10"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Profile</span>
                </Button>
              </Link>
            </div>
            
            {/* User Actions */}
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

      {/* Main Content */}
      <main className="flex-1 min-h-[calc(100vh-5rem)]">
        {children}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-40 pb-safe">
        <div className="flex items-center justify-around py-2">
          <Link href="/">
            <Button 
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              className="flex flex-col items-center space-y-1 h-12 w-16"
            >
              <Home className="h-4 w-4" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          
          <Link href="/projects">
            <Button 
              variant={isActive('/projects') ? 'default' : 'ghost'}
              size="sm"
              className="flex flex-col items-center space-y-1 h-12 w-16"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">Projects</span>
            </Button>
          </Link>
          
          <Link href="/favorites">
            <Button 
              variant={isActive('/favorites') ? 'default' : 'ghost'}
              size="sm"
              className="flex flex-col items-center space-y-1 h-12 w-16"
            >
              <Heart className="h-4 w-4" />
              <span className="text-xs">Favorites</span>
            </Button>
          </Link>
          
          <Link href="/profile">
            <Button 
              variant={isActive('/profile') ? 'default' : 'ghost'}
              size="sm"
              className="flex flex-col items-center space-y-1 h-12 w-16"
            >
              <UserIcon className="h-4 w-4" />
              <span className="text-xs">Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}