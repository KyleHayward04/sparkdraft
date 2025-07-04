import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Crown, LogOut, Flame } from "lucide-react";
import { Link } from "wouter";

interface ProfileDropdownProps {
  userId: number;
}

export function ProfileDropdown({ userId }: ProfileDropdownProps) {
  const { data: quota } = useQuery({
    queryKey: ["/api/user/quota"],
    queryFn: async () => {
      const response = await fetch("/api/user/quota", {
        headers: { "user-id": userId.toString() }
      });
      return response.json();
    }
  });

  const userInitials = "DU"; // Demo User initials

  const handleQuotaClick = () => {
    // Navigate to subscribe page when quota is clicked
    window.location.href = "/subscribe";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Demo User</p>
            <p className="text-xs leading-none text-muted-foreground">
              demo@sparkdraft.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Quota Section - Clickable */}
        <DropdownMenuItem 
          className="cursor-pointer flex items-center justify-between py-3"
          onClick={handleQuotaClick}
        >
          <div className="flex items-center space-x-2">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-sm">Sparks</span>
          </div>
          {quota && (
            <Badge 
              variant={quota.sparksUsed >= quota.sparksLimit ? "destructive" : "secondary"}
              className="text-xs"
            >
              {quota.sparksUsed}/{quota.sparksLimit}
            </Badge>
          )}
        </DropdownMenuItem>
        
        {/* Subscription Status */}
        <DropdownMenuItem className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <Crown className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">Plan</span>
          </div>
          <Badge variant="outline" className="text-xs capitalize">
            {quota?.subscriptionTier || "Free"}
          </Badge>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}