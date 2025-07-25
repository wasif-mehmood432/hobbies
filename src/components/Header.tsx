// src/components/Header.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.svg" alt="ServiceConnect Logo" className="h-full w-auto" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-[#ff00c8]">Hjem</Link>
            <Link to="/services" className="text-gray-700 hover:text-[#ff00c8]">Tjenester</Link>
            <Link to="/faq" className="text-gray-700 hover:text-[#ff00c8]">FAQ</Link>
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-[#ff00c8] flex items-center">
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/signup"><Button className="bg-[#ff00c8] text-white" size="sm">Sign Up</Button></Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3 shadow-md">
          <nav className="flex flex-col space-y-2 text-sm">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700">Hjem</Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="text-gray-700">Tjenester</Link>
            <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="text-gray-700">FAQ</Link>
            {user && (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 flex items-center">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            )}
          </nav>

          <div className="border-t pt-4 space-y-2">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="h-5 w-5 text-gray-600" />
                  <span>{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full justify-start"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="w-full text-left">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#ff00c8] text-white w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
