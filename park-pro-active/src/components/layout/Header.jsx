import { Menu } from 'lucide-react';
import NotificationPanel from '../common/NotificationPanel';

const Header = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-white/30 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-white/40 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Engineering Operations
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <NotificationPanel />
      </div>
    </header>
  );
};

export default Header;
