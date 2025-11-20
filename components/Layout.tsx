import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, BookOpen, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '学生', icon: Users },
    { path: '/curriculum', label: '工作', icon: BookOpen },
    { path: '/dashboard', label: '总览', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <header className="bg-monte-green text-white p-4 sticky top-0 z-10 shadow-md">
        <h1 className="text-xl font-bold text-center tracking-wide">蒙氏成长档案</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                  isActive ? 'text-monte-green' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
