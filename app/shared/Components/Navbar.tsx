"use client";

import Profile from "@/app/features/Profile/components/Profile";
import Setting from "@/app/features/settings/components/Setting";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  const handleSignOut = async () => {
    try {
      const response = await fetch("/features/auth/api/signout", { 
        method: "POST", 
        credentials: "include" 
      });
      
      if (response.ok) {
       
        setIsSignedIn(false);
        setUser(null);
        setProfileDropdownOpen(false);
        setMenuOpen(false);
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
       
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/features/Profile/api/profile", { 
        method: "GET", 
        credentials: "include" 
      });
      const data = await res.json();
      if (data.success && data.user) { 
        setIsSignedIn(true); 
        setUser(data.user); 
      } else { 
        await handleAuthCheck(); 
      }
    } catch { 
      await handleAuthCheck(); 
    }
  };

  const handleAuthCheck = async () => {
    try {
      const res = await fetch("/features/auth/api/signin", { 
        method: "GET", 
        credentials: "include" 
      });
      const data = await res.json();
      if (data.authenticated && data.user) { 
        setIsSignedIn(true); 
        setUser(data.user); 
      } else { 
        setIsSignedIn(false); 
        setUser(null); 
      }
    } catch { 
      setIsSignedIn(false); 
      setUser(null); 
    }
  };

  const handleProfile = () => { 
    setOpenProfile(true); 
    setProfileDropdownOpen(false); 
    setMenuOpen(false); 
  };
  
  const handleSetting = () => { 
    setOpenSetting(true); 
    setProfileDropdownOpen(false); 
    setMenuOpen(false); 
  };
  
  const handleProfileUpdate = (updatedUser: any) => setUser(updatedUser);

  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  };

  useEffect(() => { 
    fetchUserProfile(); 
  }, []);

  // Listen for login/logout events
  useEffect(() => {
    const handleUserLogin = () => {
      fetchUserProfile();
    };
    
    const handleUserLogout = () => {
      setIsSignedIn(false);
      setUser(null);
    };
    
    window.addEventListener('user-login', handleUserLogin);
    window.addEventListener('user-logout', handleUserLogout);
    
    return () => {
      window.removeEventListener('user-login', handleUserLogin);
      window.removeEventListener('user-logout', handleUserLogout);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".profile-dropdown-trigger") && !t.closest(".profile-dropdown-content"))
        setProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openProfile || openSetting ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [openProfile, openSetting]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Our Fleet", href: "/vehicles" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-8xl mx-auto">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span className="text-base font-bold text-gray-900 tracking-tight">
              Auto<span className="text-red-500">Rent</span>Pro
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-all duration-150"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/agents"
              className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Our Agents
            </Link>

            {isSignedIn && user ? (
              <div className="relative">
                <button
                  className="profile-dropdown-trigger flex items-center gap-2.5 cursor-pointer"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{getUserInitials()}</span>
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
            
                {profileDropdownOpen && (
                  <div className="profile-dropdown-content absolute top-full right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <div className="p-1.5">
                      {[
                        { label: "My Profile", action: handleProfile },
                        { label: "Settings", action: handleSetting },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors shadow-sm shadow-orange-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 w-5 h-5 justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-full h-0.5 bg-gray-700 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-full h-0.5 bg-gray-700 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-full h-0.5 bg-gray-700 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 pb-5">
            <div className="flex flex-col px-6 pt-4 gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 py-2.5 border-b border-gray-100 hover:text-orange-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/agents"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Our Agents
              </Link>
              <div className="pt-4 mt-2">
                {isSignedIn && user ? (
                  <>
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                      <div className="w-9 h-9 bg-orange-600 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-sm font-bold">{getUserInitials()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    {[
                      { label: "My Profile", action: handleProfile, color: "text-gray-700" },
                      { label: "Settings", action: handleSetting, color: "text-gray-700" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className={`w-full text-left text-sm font-medium ${item.color} py-2.5 border-b border-gray-100`}
                      >
                        {item.label}
                      </button>
                    ))}
                    <button
                      onClick={() => { handleSignOut(); setMenuOpen(false); }}
                      className="w-full text-left text-sm font-medium text-orange-600 py-2.5 mt-1"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/auth/signin"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-medium text-gray-700 py-2.5 border-b border-gray-100"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setMenuOpen(false)}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-center text-sm font-semibold py-2.5 rounded-xl transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Profile Modal */}
      {openProfile && (
        <div className="fixed inset-0 z-[100] bg-white overflow-hidden">
          <div className="h-screen w-screen">
            <Profile openProfile={openProfile} onClose={() => setOpenProfile(false)} user={user} onProfileUpdate={handleProfileUpdate} />
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {openSetting && (
        <div className="fixed inset-0 z-[100] bg-white overflow-hidden">
          <div className="h-screen w-screen">
            <Setting isOpen={openSetting} onClose={() => setOpenSetting(false)} user={user} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;