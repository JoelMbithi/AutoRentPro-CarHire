import React from 'react';

interface NavItem {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  count?: string | number | null;
  badge?: 'urgent' | 'new' | string | null;
}

interface SidebarProps {
  sidebarOpen: boolean;
  activeTab: string;
  setActiveTab: (id: string) => void;
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, activeTab, setActiveTab, navItems }) => {
  return (
    <aside
      className={`${
        sidebarOpen ? 'w-56' : 'w-0'
      } bg-white border-r border-gray-200 transition-all duration-200 overflow-hidden sticky top-[57px] h-[calc(100vh-57px)] shrink-0`}
    >
      <nav className="p-3 space-y-0.5">
        {navItems.map(item => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <item.icon
                  size={15}
                  className={active ? 'text-white' : 'text-gray-400'}
                />
                {item.label}
              </div>

              <div className="flex items-center gap-1.5">
                {item.count && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-md font-mono ${
                    active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    item.badge === 'urgent' ? 'bg-red-400' : 'bg-blue-400'
                  }`} />
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;