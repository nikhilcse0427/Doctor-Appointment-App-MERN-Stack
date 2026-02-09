import React from "react";
import { useLocation, Link } from "react-router-dom";
import { User, Bell, Calendar, Stethoscope, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

  const landingNav = [
    { label: "HOME", href: "/" },
    { label: "ALL DOCTORS", href: "/doctors" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
  ];

  // Add Dashboard link to landing nav if authenticated
  if (isAuthenticated && !showDashboardNav) {
    landingNav.push({
      label: "DASHBOARD",
      href: `/${user.type}/dashboard`
    });
  }

  const getDashboardNavigation = () => {
    if (!user || !showDashboardNav) return [];

    if (user?.type === "patient") {
      return [
        {
          label: "Appointments",
          icon: Calendar,
          href: "/patient/appointment",
          active: pathname.includes("/patient/appointment"),
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

        {/* Left Section: Logo & Landing/Dashboard Nav */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <Link to="/">
              <Stethoscope className="h-8 w-12 text-primary" />
            </Link>
            <Link to="/">
              <img src="/logoimg.svg" alt="logo" className="h-10" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            {showDashboardNav ? (
              // Dashboard Navigation
              getDashboardNavigation().map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    to={item.href}
                    className={`flex items-center space-x-1 transition-colors ${item.active
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600 hover:text-blue-600"
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                );
              })
            ) : (
              // Landing Page Navigation
              landingNav.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.href}
                  className={`text-sm font-bold transition-colors ${item.label === "DASHBOARD"
                    ? "text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-4"
                    : "text-gray-700 hover:text-blue-600"
                    }`}
                >
                  {item.label}
                </Link>
              ))
            )}
          </nav>
        </div>

        {/* Right Section: Auth/Login or User Profile */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button variant="outline" size="sm" className="relative bg-gray-200">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  4
                </span>
              </Button>

              {/* Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center px-1">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.profileImage} />
                      <AvatarFallback className="bg-black text-white text-xs font-bold">
                        {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left ml-2">
                      <p className="text-gray-900 text-xs font-semibold leading-none">
                        {user?.name}
                      </p>
                      <p className="text-[10px] text-gray-500 capitalize">
                        {user?.type}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className='w-56'>
                  <DropdownMenuLabel>
                    <div className='flex items-center space-x-2 p-2'>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.profileImage} />
                        <AvatarFallback className="bg-black text-white font-bold">
                          {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize truncate">
                          {user?.type}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/${user.type}/settings`} className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login/patient">
                <Button className="bg-blue-400 text-white font-bold hover:bg-blue-700 text-xs py-1 px-3">
                  Login
                </Button>
              </Link>

              <Link to="/signup/patient" className="hidden md:block">
                <Button className="bg-blue-400 text-white font-bold hover:bg-blue-700 text-xs py-1 px-3">
                  Booking consultation
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
