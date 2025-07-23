// src/components/Header.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react'; // Import LayoutDashboard icon

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
     <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-20 h-20 flex items-center justify-center">
              <img src="/logo.svg" alt="ServiceConnect Logo" />
            </div>
          </Link>

          {/* Conditional Nav */}
          {!isMobile ? (
            <nav className="flex items-center space-x-8">
              {/* desktop links */}
              <Link to="/" className="text-gray-700 hover:text-[#ff00c8]">Home</Link>
              <Link to="/services" className="text-gray-700 hover:text-[#ff00c8]">Services</Link>
              <Link to="/faq" className="text-gray-700 hover:text-[#ff00c8]">FAQ</Link>
              {user && (
                <Link to="/dashboard" className="text-gray-700 hover:text-[#ff00c8] flex items-center">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              )}
            </nav>
          ) : (
            // Mobile menu toggle
            <Button variant="ghost" onClick={() => setMobileMenuOpen(prev => !prev)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          )}

          {/* Auth Buttons */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login"><Button variant="ghost">Login</Button></Link>
                  <Link to="/signup"><Button className="bg-[#ff00c8]">Sign Up</Button></Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="px-4 pb-4 space-y-2">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700">Home</Link>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700">Services</Link>
          <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700">FAQ</Link>
          {user && (
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className=" text-gray-700 flex items-center">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          )}
          {/* Auth (Mobile) */}
          <div className="mt-4 flex flex-col space-y-2">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center space-x-1">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" >Login</Button></Link>
                <Link to="/signup"><Button className="bg-[#ff00c8]" >Sign Up</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;