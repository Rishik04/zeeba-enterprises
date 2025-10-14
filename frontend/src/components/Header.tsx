import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Menu, X, Building2, Award, Star } from 'lucide-react';
import { motion } from 'motion/react';
import logo from "../assets/logo.png"

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function Header({ currentPage, onNavigate, isAuthenticated, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const baseNavigation = [
    { name: 'Home', href: 'home' },
    { name: 'About', href: 'about' },
    { name: 'Services', href: 'services' },
    { name: 'Projects', href: 'projects' },
    { name: 'Contact', href: 'contact' },
  ];

  const navigation = isAuthenticated
    ? [...baseNavigation, { name: 'Dashboard', href: 'dashboard' }]
    : baseNavigation;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-emerald-100'
        : 'bg-white shadow-lg'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Enterprise Logo */}
          <motion.div
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative mr-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center enterprise-shadow group-hover:enterprise-shadow-lg transition-all duration-300 overflow-hidden">
                <img
                  src={logo}
                  alt="logo"
                  className="w-10 h-10"
                />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-cyan-950 font-['Poppins']">
                Zeba Enterprises
              </h1>
              <div className="flex items-center">
                <p className="text-sm text-cyan-600 font-['Inter']">Engineering Excellence</p>
              </div>
            </div>
          </motion.div>

          {/* Premium Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => onNavigate(item.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${currentPage === item.href
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
              >
                {item.name}
                {currentPage === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-secondary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Premium CTA Button */}
          <div className="hidden md:flex space-x-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {isAuthenticated && (
                <motion.button
                  onClick={onLogout}
                  className="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition"
                >
                  Logout
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Premium Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pb-4 space-y-2">
            {navigation.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={isMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => {
                  onNavigate(item.href);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-sm font-medium transition-all rounded-lg ${currentPage === item.href
                  ? 'text-emerald-700 bg-emerald-50 border-l-4 border-emerald-600'
                  : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
              >
                {item.name}
              </motion.button>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button
                onClick={() => {
                  onNavigate('contact');
                  setIsMenuOpen(false);
                }}
                className="w-full mt-4 bg-cyan-950 hover:bg-cyan-950/90 text-white"
              >
                Get Enterprise Quote
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}