import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Wind,
  Droplets,
  Car,
  Ship,
  Snowflake,
  Cog,
  Gauge,
  Package,
  Box,
  AlertCircle,
  X,
  LogOut,
  Users,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ASSET_CATEGORIES } from '../../utils/helpers';

const iconMap = {
  LayoutDashboard,
  Zap,
  Wind,
  Droplets,
  Car,
  Ship,
  Snowflake,
  Cog,
  Wrench,
  Gauge,
  Package,
  Box,
  AlertCircle,
  Users
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { path: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
    ...ASSET_CATEGORIES.map(cat => ({
      path: `/assets/${cat.id}`,
      icon: cat.icon,
      label: cat.name
    })),
    { path: '/oil-change-tracker', icon: 'Droplets', label: 'Oil Change Tracker' },
    { path: '/maintenance-tracker', icon: 'Wrench', label: 'Maintenance Tracker' },
    { path: '/inventory', icon: 'Box', label: 'Inventory' },
    { path: '/alerts', icon: 'AlertCircle', label: 'Alerts' },
    ...(isAdmin() ? [{ path: '/users', icon: 'Users', label: 'Users' }] : [])
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        {/* Logo section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
            <span className="font-bold text-lg text-white">Park Pro</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.email || 'User'}
              </p>
              <p className="text-xs text-slate-300">
                {isAdmin() ? 'Administrator' : 'User'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
