import { Building2, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Trophy, Twitter } from 'lucide-react';
import { motion } from 'motion/react';
import logo from "../assets/logo.png";


interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center mb-6"
            >
              <div className="relative mr-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center enterprise-shadow group-hover:enterprise-shadow-lg transition-all duration-300 overflow-hidden">
                  <img
                    src={logo}
                    alt="Zeba Enterprises Logo"
                    className="w-12 h-12"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-['Poppins']">
                  Zeba Enterprises
                </h3>
                <div className="flex items-center mt-1">
                  <Trophy className="w-4 h-4 text-cyan-400 mr-2" />
                  <span className="text-gray-300 font-['Inter']">Your Reliable Partner in Construction</span>
                </div>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed"
            >
              An Indian company providing end-to-end project solutions from design to final delivery. With a focus on quality and precision, we are a reliable partner in developing India's infrastructure.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex space-x-4"
            >
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-cyan-800/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-cyan-700/50 transition-all duration-300"
                >
                  <Icon className="w-5 h-5 text-cyan-200 hover:text-white" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h4 className="font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Services', 'Projects', 'Contact'].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <button
                    onClick={() => onNavigate(item.toLowerCase())}
                    className="text-cyan-200 hover:text-cyan-500 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {item}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h4 className="font-semibold mb-6 text-white">Headquarters</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-cyan-800/50 rounded-lg flex items-center justify-center mr-3">
                  <Phone className="w-4 h-4 text-cyan-500" />
                </div>
                <span className="text-gray-300">9801359772, 9693388722</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-cyan-800/50 rounded-lg flex items-center justify-center mr-3">
                  <Mail className="w-4 h-4 text-cyan-500" />
                </div>
                <span className="text-gray-300">sahbaz00786@gmail.com</span>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-cyan-800/50 rounded-lg flex items-center justify-center mr-3 mt-1">
                  <MapPin className="w-4 h-4 text-cyan-500" />
                </div>
                <span className="text-gray-300">
                  Bhagabandh, P.S. Putki<br />
                  Dhanbad, Jharkhand 828111
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-cyan-800/50 rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="w-4 h-4 text-cyan-500" />
                </div>
                <span className="text-gray-300">Infrastructure Development</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="border-t border-cyan-800/50 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 mb-4 md:mb-0">
              © 2025 Zeba Enterprises. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-gray-300 text-sm">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}