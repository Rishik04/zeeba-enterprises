import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Award,
  Building2,
  CheckCircle,
  Crown,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { api } from "../../App";

interface AdminLoginPageProps {
  onNavigate: (page: string) => void;
  validate: () => void;
  isAuthenticated: boolean;
}

export const AdminLogin = ({ onNavigate, validate, isAuthenticated }: AdminLoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const data = { email, password };
      const res = await api.post(`/user/admin-login`, data);
      setSuccess(res.data.message);
      localStorage.setItem("token", res.data.token);
      await validate();
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(isAuthenticated)
    if (isAuthenticated) {
      onNavigate("dashboard");
    }
  }, [isAuthenticated])

  const features = [
    {
      icon: Shield,
      text: "Bank-grade security encryption",
      color: "text-green-400",
    },
    {
      icon: CheckCircle,
      text: "Real-time project monitoring",
      color: "text-blue-400",
    },
    {
      icon: Crown,
      text: "Complete operational control",
      color: "text-yellow-400",
    },
  ];

  const stats = [
    {
      icon: TrendingUp,
      label: "Active Projects",
      value: "247",
      color: "text-green-500",
    },
    {
      icon: Users,
      label: "Team Members",
      value: "50K+",
      color: "text-blue-500",
    },
    {
      icon: Award,
      label: "Safety Score",
      value: "99.8%",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
          alt="Construction background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-slate-900/80 to-green-900/40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden lg:block space-y-10"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/40">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Zeba Enterprises
                </h1>
                <p className="text-orange-300">Engineering Excellence</p>
              </div>
            </div>

            <Badge className="bg-gradient-to-r from-orange-500/20 to-green-500/20 text-orange-200 border border-orange-400/30 px-4 py-2 backdrop-blur-sm">
              🇮🇳 Secure Admin Portal • ISO 27001 Certified
            </Badge>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">
                Admin Dashboard <br />{" "}
                <span className="text-orange-400">Control Center</span>
              </h2>
              <ul className="space-y-4">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <li
                      key={i}
                      className="flex items-center space-x-3 text-white"
                    >
                      <Icon className={`w-6 h-6 ${f.color}`} />
                      <span>{f.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

          {/* Right Side - Login Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-2xl p-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Admin Login
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="flex items-center text-red-600 bg-red-100 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5 mr-2" /> {error}
                  </div>
                )}
                {success && (
                  <div className="flex items-center text-green-600 bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5 mr-2" /> {success}
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@company.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Login <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-md"
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${s.color}`} />
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-orange-200">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
