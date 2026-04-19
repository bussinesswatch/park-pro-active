import { Wrench, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/30 bg-white/60 backdrop-blur-xl">
      <div className="px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Park Pro-Active</p>
              <p className="text-xs text-gray-500">Engineering Operations Management</p>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Developed by</span>
              <span className="font-semibold text-rose-600">Retts Web Dev</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Powered by</span>
              <span className="font-medium text-slate-700">Business Watch PVT LTD</span>
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-3 border-t border-white/30 text-center">
          <p className="text-xs text-gray-400">
            © {currentYear} Business Watch PVT LTD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
