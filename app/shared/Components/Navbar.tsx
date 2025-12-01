"use client";

import Profile from "@/app/features/Profile/Profile";
import Setting from "@/app/features/settings/Setting";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [openProfile,setOpenProfile] = useState(false)
  const [openSetting,setOpenSetting] = useState(false)

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsSignedIn(false);
      setUser(null);
      setProfileDropdownOpen(false);
      console.log("User signed out");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      const res = await fetch('/features/auth/api/signin', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      console.log(data)

      if (data.authenticated) {
        setIsSignedIn(true);
        setUser(data.user);
      } else {
        setIsSignedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.log("Error during fetching user info:", error);
    }
  };
  const handleProfile = async () => {
    try {
      setOpenProfile(true)
    } catch (error) {
      console.log(error)
    }
  }

   const closeProfile = () => {
    setOpenProfile(false);
  };

  const handleSetting = async () => {
    try {
      setOpenSetting(true)
    } catch (error) {
      console.log(error)
    }
  }
  
  const closeSetting = () => {
    setOpenSetting(false)
  }
  useEffect(() => {
    handleSignIn();
    
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown-trigger') && !target.closest('.profile-dropdown-content')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || "U";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-900 tracking-tight">
          <span className="text-orange-600">Auto</span>
          <span className="text-gray-800">Rent</span>
          <span className="text-orange-600">Pro</span>
          <span className="text-gray-800">.</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8">
          {[
            { name: "Home", href: "/" },
            { name: "Our Fleet", href: "/vehicles" },
            { name: "About Us", href: "/about" },
            { name: "Services", href: "/services" },
            { name: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="font-medium text-gray-700 hover:text-orange-600 py-2 relative group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Right Side (Profile) — Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/agents"
            className="hidden lg:flex font-medium text-gray-600 hover:text-orange-600 items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Our Agent
          </Link>

          {isSignedIn ? (
            /* User is signed in - Show profile dropdown */
            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer profile-dropdown-trigger"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-purple-400 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300">
                  <span className="text-white text-sm font-bold">{getUserInitials()}</span>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <span className="font-semibold text-gray-800 hover:text-orange-600">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <svg
                    className={`w-4 h-4 text-purple-400 hover:text-orange-600 transition-transform ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Dropdown - Always visible when open */}
              {profileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border profile-dropdown-content z-50">
                  <div className="p-3 border-b">
                    <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button   onClick={() => {
                        handleProfile();
                        setMenuOpen(false);
                      }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors">
                      My Profile
                    </button>
                    
                    <button  onClick={() =>{
                       handleSetting()
                        setMenuOpen(false);
                       }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors">
                      Settings
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* User is not signed in - Show sign in button */
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="font-medium text-gray-700 hover:text-orange-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
           {/* Profile Modal */}
      {openProfile && (
        <div 
          className="profile-modal-overlay h-screen  fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeProfile}
        >
          <div 
            className="relative bg-white h-screen rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Profile  openProfile={openProfile} onClose={closeProfile} user={user} />
          </div>
        </div>
      )}

      {/* Setting */}
      {openSetting && (
         <div 
          className="profile-modal-overlay h-screen  fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeSetting}
        >
          <div 
            className="relative bg-white h-screen rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Setting  isOpen={openSetting} onClose={closeSetting} user={user} />
          </div>
        </div>
      )}
        </div>
        

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-6 h-6"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`w-full h-0.5 bg-gray-700 transition ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
          <span className={`w-full h-0.5 bg-gray-700 transition ${menuOpen ? "opacity-0" : ""}`}></span>
          <span className={`w-full h-0.5 bg-gray-700 transition ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t pb-4 animate-slide-down">
          <div className="flex flex-col gap-4 px-6 pt-4">
            {[
              { name: "Home", href: "/" },
              { name: "Our Fleet", href: "/vehicles" },
              { name: "About Us", href: "/about" },
              { name: "Services", href: "/services" },
              { name: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 font-medium py-2 border-b border-gray-100"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-200">
              {isSignedIn ? (
                <>
                  <div className="mb-3">
                    <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <button onClick={() => {handleProfile()}} className="w-full text-left text-gray-700 font-medium py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    My Profile
                  </button>
                  <button 
                  onClick={() =>{ handleSetting()}}
                   
                  className="w-full text-left text-gray-700 font-medium py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    Settings
                  </button>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left text-red-600 font-medium py-2 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/auth/signin"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 font-medium py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMenuOpen(false)}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-center py-2 rounded-lg font-medium transition-colors"
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
  );
};

export default Navbar;