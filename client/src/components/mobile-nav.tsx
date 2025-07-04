import { Link, useLocation } from "wouter";
import { Home, Folder, Star } from "lucide-react";

export function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/projects", icon: Folder, label: "Projects" },
    { path: "/favorites", icon: Star, label: "Favorites" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <button className={`flex flex-col items-center py-2 px-4 ${
                isActive ? "text-primary" : "text-gray-500"
              }`}>
                <item.icon className="h-6 w-6 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
