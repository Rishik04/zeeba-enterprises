import axios from 'axios';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { AboutPage } from './components/pages/AboutPage';
import { AdminLogin } from './components/pages/AdminLogin';
import { ContactPage } from './components/pages/ContactPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { HomePage } from './components/pages/HomePage';
import { ProjectsPage } from './components/pages/ProjectsPage';
import { ServicesPage } from './components/pages/ServicesPage';
import { Toaster } from './components/ui/sonner';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname.slice(1) || 'home';
    return path;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1) || 'home';
      setCurrentPage(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const path = currentPage === 'home' ? '/' : `/${currentPage}`;
    window.history.pushState(null, '', path);
    document.title = `${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} - Zeba Enterprises`;
  }, [currentPage]);

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const validate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    console.log("validating")
    await api
      .get("/auth/validate")
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      });
  }



  // Render current page with transitions
  const renderCurrentPage = () => {
    const pageComponents = {
      about: <AboutPage onNavigate={handleNavigate} />,
      services: <ServicesPage onNavigate={handleNavigate} />,
      projects: <ProjectsPage onNavigate={handleNavigate} />,
      admin: <AdminLogin onNavigate={handleNavigate} validate={validate} isAuthenticated={isAuthenticated} />,
      dashboard: isAuthenticated
        ? <DashboardPage onNavigate={handleNavigate} />
        : (
          <div className="p-10 text-center">
            <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
            <p className="text-gray-600">You must be logged in to view this page.</p>
            <button
              onClick={() => handleNavigate("home")}
              className="mt-4 px-4 py-2 bg-green-700 text-white rounded-lg"
            >
              Go Home
            </button>
          </div>
        ),
      contact: <ContactPage onNavigate={handleNavigate} />,
      home: <HomePage onNavigate={handleNavigate} />
    };

    return (
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* {pageComponents[currentPage as keyof typeof pageComponents] || pageComponents.home} */}
        {pageComponents[currentPage as keyof typeof pageComponents] || pageComponents.home}
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mb-6 mx-auto minimal-shadow-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 font-['Poppins']">
            Zeba Enterprices
          </h1>
          <p className="text-green-100 font-['Inter']">Engineering Excellence</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={handleNavigate} isAuthenticated={isAuthenticated}
        onLogout={() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          handleNavigate("home");
        }} />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#065f46',
            color: 'white',
            border: 'none',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </div>
  );
}