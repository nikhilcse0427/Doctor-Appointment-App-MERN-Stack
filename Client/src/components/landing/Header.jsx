import { Bell, Calendar, Stethoscope } from 'lucide-react'
import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"

const Header = ({ showDashboardNav = true }) => {

  const { pathname } = useLocation();

  const user = {
    type: "patient"
  };

  const isAuthenticated = true;

  const getDashboardNavigation = () => {
    if (!user || !showDashboardNav) return [];

    if (user?.type === "patient") {
      return [
        {
          label: "Dashboard",
          icon: Calendar,
          href: "/patient/dashboard",
          active: pathname.includes("/patient/dashboard")
        }
      ];
    }

    if (user?.type === "doctor") {
      return [
        {
          label: "Dashboard",
          icon: Calendar,
          href: "/doctor/dashboard",
          active: pathname.includes("/doctor/dashboard")
        },
        {
          label: "Appointments",
          icon: Calendar,
          href: "/doctor/appointment",
          active: pathname.includes("/doctor/appointment")
        }
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
              {getDashboardNavigation().map((item, idx) => (
                <Link
                  key={idx}
                  to={item.href}
                  className={`flex items-center space-x-1 transition-colors ${
                    item.active
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right Section */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="relative bg-gray-200">
              <Bell className="h-8 w-8" />
              <span className="absolute -top-2 -right-1 text-red-600 font-bold">4</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link to='/login/patient'>
              <Button
                variant="outline"
                className='bg-blue-400 text-white font-bold hover:bg-blue-700'
              >
                Login
              </Button>
            </Link>

            <Link to='/signup/patient' className='hidden md:block'>
              <Button
                variant='outline'
                className='bg-blue-400 text-white font-bold hover:bg-blue-700'
              >
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
