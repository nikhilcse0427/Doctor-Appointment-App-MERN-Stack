import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Bell, Calendar, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Header = ({ showDashboardNav = true }) => {
  const { pathname } = useLocation();

  const user = {
    type: "patient",
    name: "Nikhil Verma",
    profileImage: "https://github.com/maxleiter.png", // empty => fallback shows NV
  };

  const isAuthenticated = true; // change this to true to test login state

  const getDashboardNavigation = () => {
    if (!user || !showDashboardNav) return [];

    if (user?.type === "patient") {
      return [
        {
          label: "Dashboard",
          icon: Calendar,
          href: "/patient/dashboard",
          active: pathname.includes("/patient/dashboard"),
        },
      ];
    }

    if (user?.type === "doctor") {
      return [
        {
          label: "Dashboard",
          icon: Calendar,
          href: "/doctor/dashboard",
          active: pathname.includes("/doctor/dashboard"),
        },
        {
          label: "Appointments",
          icon: Calendar,
          href: "/doctor/appointment",
          active: pathname.includes("/doctor/appointment"),
        },
      ];
    }

    return [];
  };

  return (
    <header className="border-b border-black mx-4 backdrop:blur-sm fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="container mx-auto px-8 h-16 flex items-center justify-between">

        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <Stethoscope className="h-8 w-12 text-primary" />
          </Link>

          <Link to="/">
            <img src="/logoimg.svg" alt="logo" className="h-12" />
          </Link>

          {isAuthenticated && showDashboardNav && (
            <nav className="hidden md:flex items-center space-x-4">
              {getDashboardNavigation().map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    to={item.href}
                    className={`flex items-center space-x-1 transition-colors ${
                      item.active
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Section */}
        {isAuthenticated && showDashboardNav ? (
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="relative bg-gray-200">
              <Bell className="h-8 w-8" />
              <span className="absolute -top-2 -right-1 text-red-600 font-bold">
                4
              </span>
            </Button>

            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center px-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback className="bg-black text-white font-bold">
                       {
                       user?.name
                       ?.split(" ").map((n)=>n[0]).join("").toUpperCase()
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                      <p className=" text-gray-900 text-sm">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                      {user?.type}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="right" className='w-56'>
                
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link to="/login/patient">
              <Button className="bg-blue-400 text-white font-bold hover:bg-blue-700">
                Login
              </Button>
            </Link>

            <Link to="/signup/patient" className="hidden md:block">
              <Button className="bg-blue-400 text-white font-bold hover:bg-blue-700">
                Booking consultation
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
