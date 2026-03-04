import React from 'react';
import { Menu, Search, Bell, Plus, RefreshCw, ChevronDown, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Menu size={22} className="text-gray-700" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-center ring-2 ring-red-500/20 shadow-lg">
                <div className="relative">
                  <div className="w-5 h-5 rounded-full border-2 border-white/80"></div>
                  <div className="absolute top-1/2 left-1/2 w-6 h-0.5 bg-white/80 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1 bg-red-300 rounded-sm"></div>
                </div>
              </div>
              <div className="leading-tight">
                <p className="text-xl font-bold text-slate-900">
                  <span className="text-gray-900">Auto</span>
                  <span className="text-red-800">Rent</span>
                  <span className="text-gray-900 font-extrabold">Pro</span>
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">
                  Executive Travel Solutions
                </p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/* Search, Quick Actions, Notifications, User Profile */}
            {/* ... rest of your JSX remains unchanged ... */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
