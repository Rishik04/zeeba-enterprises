import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ArrowRight, Star, Users, Calendar, Shield, TrendingUp, Building2, Truck, Crown, Wrench } from 'lucide-react';
import { motion } from 'motion/react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

// Slideshow
function ConstructionSlideshow() {
  const [currentImage, setCurrentImage] = useState(0);

  const constructionImages = [
    { url: "https://images.unsplash.com/photo-1608627732420-f743aee4c80c?crop=entropy&cs=tinysrgb&fit=max&q=80&w=1080", label: "Railways & Metro" },
    { url: "https://images.unsplash.com/photo-1605865051326-81f3fcaf03b1?crop=entropy&cs=tinysrgb&fit=max&q=80&w=1080", label: "Roadways & Highways" },
    { url: "https://images.unsplash.com/photo-1580664031752-0f1379ea4de2?crop=entropy&cs=tinysrgb&fit=max&q=80&w=1080", label: "Mining Projects" },
    { url: "https://images.unsplash.com/photo-1667604579449-14298726118b?crop=entropy&cs=tinysrgb&fit=max&q=80&w=1080", label: "Civil & Building Works" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % constructionImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {constructionImages.map((image, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: index === currentImage ? 0.3 : 0,
            scale: index === currentImage ? 1 : 1.1
          }}
          transition={{ duration: 1.5 }}
        >
          <ImageWithFallback
            src={image.url}
            alt={image.label}
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}
      <div className="absolute bottom-20 left-8 z-10 bg-black/50 px-4 py-2 rounded-lg">
        <p className="text-white text-sm">{constructionImages[currentImage].label}</p>
      </div>
    </div>
  );
}

export function HomePage({ onNavigate }: HomePageProps) {
  const services = [
    { title: 'Contracting Works', description: 'Railways, mining, roadways, pipelines, and building execution.', icon: Building2, color: 'bg-blue-600' },
    { title: 'Logistics Services', description: 'Transportation, supply chain, and storage solutions.', icon: Truck, color: 'bg-green-600' },
    { title: 'Civil Engineering', description: 'Structural, water, transportation, and environmental projects.', icon: Crown, color: 'bg-amber-600' },
    { title: 'Pump Engineering', description: 'Design, installation, and performance testing of pumping systems.', icon: Wrench, color: 'bg-purple-600' },
  ];

  const stats = [
    { number: '15+', label: 'Years of Expertise', icon: Calendar, color: 'text-primary' },
    { number: '5K+', label: 'Skilled Workforce', icon: Users, color: 'text-blue-600' },
    { number: '99.5%', label: 'Safety Rating', icon: Shield, color: 'text-amber-600' },
    { number: '50+', label: 'Major Projects', icon: TrendingUp, color: 'text-green-600' }
  ];

  const testimonials = [
    {
      name: 'Ministry of Housing',
      company: 'Government Client',
      text: 'Zeba Enterprises executed large-scale projects with precision and quality. Professional and reliable.',
      rating: 5,
    },
    {
      name: 'Local Municipalities',
      company: 'State Clients',
      text: 'Their urban development projects improved community infrastructure significantly.',
      rating: 5,
    },
    {
      name: 'Private Sector Partner',
      company: 'Industrial Client',
      text: 'Mining and industrial expansions completed on time with high safety standards.',
      rating: 5,
    }
  ];
  const clients = [
    "Ministry of Housing",
    "Local Municipalities",
    "Private Sector Companies"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary">
          <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
            <source src="https://cdn.pixabay.com/video/2022/03/06/110650-683039808_large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/70 to-blue-900/80"></div>
        </div>
        <ConstructionSlideshow />
        <div className="relative z-10 max-w-7xl mx-auto text-white px-4 lg:px-8 text-center">
          <Badge className="mb-6 bg-white/10 border-white/20 px-6 py-3 text-sm">
            🏗️ Zeba Enterprises • End-to-End Project Solutions
          </Badge>
          <h1 className="text-6xl font-bold mb-6">Constructing India’s <span className="text-cyan-500">Future</span></h1>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            From <span className="text-cyan-500">Railways</span> to <span className="text-cyan-500">Roadways</span>,
            <span className="text-cyan-500"> Mining</span> to <span className="text-cyan-500">Civil Projects</span> —
            building sustainable progress across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" onClick={() => onNavigate('contact')} className="bg-cyan-500 px-10 py-4 text-lg text-sm">
              Start Your Project <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('projects')} className="border-2 border-white hover:bg-white hover:text-primary px-10 py-4 text-lg">
              View Projects
            </Button>
          </div>
        </div>
      </section>

      {/* About / Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Section Title */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Drives Us</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Guided by our vision and mission, we are committed to building excellence,
              fostering trust, and shaping a stronger future for India’s infrastructure.
            </p>
          </div>

          {/* Vision & Mission Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-16">
            <div className="p-8 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-100 mr-4">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 26 26">
                    <path d="M12 2L15 8l6 .9-4.5 4.4L17 21l-5-3-5 3 1.5-7.7L4 8.9 10 8l2-6z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To be leaders in the contracting sector across India by delivering
                innovative solutions and exceptional quality.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-100 mr-4">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 12h18M12 3v18" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Providing integrated works that exceed customer expectations,
                building long-term relationships, and driving infrastructure development.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Services Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <Card key={i} className="h-full hover-lift p-6">
                  <CardContent className="text-center space-y-4 p-0">
                    <div className={`w-16 h-16 ${service.color} flex items-center justify-center rounded-lg mx-auto`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Button onClick={() => onNavigate('services')} className="bg-cyan-500 text-white px-8 py-3">
              Explore All Services <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i}>
                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-blue-100 rounded-xl mb-4">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <h3 className="text-4xl font-bold text-blue-700">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-white/80 shadow-xl p-8">
                <CardContent className="flex flex-col h-full">
                  <div className="flex mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic flex-grow">"{t.text}"</p>
                  <div className="border-t pt-4">
                    <div className="font-bold">{t.name}</div>
                    <div className="text-blue-600">{t.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Clients & Partners */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-12">Our Clients & Partners</h2>
          <p className="text-lg text-gray-600 mb-10">Trusted by government bodies, municipalities, and private enterprises.</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-80">
            {clients.map((client, i) => (
              <div key={i} className="px-8 py-4 border rounded-xl bg-gray-50 text-gray-700 font-medium hover:shadow-md transition">
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
