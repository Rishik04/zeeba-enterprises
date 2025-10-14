import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  Building2,
  Truck,
  Wrench,
  Shield,
  CheckCircle,
  ArrowRight,
  Clock,
  Award,
  Briefcase,
  TrendingUp,
  HardHat
} from 'lucide-react';
import railway from "../../assets/railway.jpeg";
import pump from "../../assets/pump.jpeg";

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const mainServices = [
    {
      icon: Building2,
      title: 'Contracting Works',
      description: 'Execution of railway, mining, roadways, pipelines, and building projects with high standards of quality and safety.',
      features: [
        'Railway & Metro Construction',
        'Mining Infrastructure Development',
        'Road & Highway Projects',
        'Pipeline & Water Systems',
        'Building & Civil Structures'
      ],
      image: railway
    },
    {
      icon: Truck,
      title: 'Logistics Services',
      description: 'Efficient supply chain, transportation, and storage solutions supporting large-scale infrastructure projects.',
      features: [
        'Transportation & Haulage',
        'Supply Chain Coordination',
        'On-site Material Delivery',
        'Storage & Inventory Solutions',
        'Heavy Equipment Logistics'
      ],
      image: 'https://images.pexels.com/photos/29057946/pexels-photo-29057946.jpeg'
    },
    {
      icon: HardHat,
      title: 'Civil Engineering & Infrastructure',
      description: 'Comprehensive civil works and infrastructure development for sustainable urban and rural growth.',
      features: [
        'Structural Engineering',
        'Road & Bridge Construction',
        'Water & Drainage Systems',
        'Urban Development Projects',
        'Environmental Engineering'
      ],
      image: 'https://images.pexels.com/photos/439416/pexels-photo-439416.jpeg?_gl=1*1w94pv6*_ga*MTA0ODk5MDIyMS4xNzQ4NDA2Mjkz*_ga_8JE65Q40S6*czE3NjA0NDI0NDYkbzQkZzEkdDE3NjA0NDI1ODIkajYwJGwwJGgw'
    },
    {
      icon: Wrench,
      title: 'Pump Engineering Works',
      description: 'Specialized pump design, installation, and performance testing ensuring reliable systems.',
      features: [
        'Pump System Design',
        'Installation & Commissioning',
        'Performance Testing',
        'Maintenance & Repairs',
        'Industrial Pump Solutions'
      ],
      image: pump
    }
  ];

  const specialtyServices = [
    { title: 'Safety & Security Supplies', description: 'Providing PPE, safety gear, and industrial security solutions.', icon: '🦺' },
    { title: 'Marketing Consulting', description: 'Helping businesses in the construction ecosystem with market expansion strategies.', icon: '📊' },
    { title: 'Management Consulting', description: 'Streamlined project and business process management.', icon: '📈' },
    { title: 'Engineering Consulting', description: 'Expert guidance on technical and structural engineering challenges.', icon: '⚙️' },
    { title: 'Financial Consulting', description: 'Advisory on budgeting, project financing, and cost efficiency.', icon: '💰' }
  ];

  const processSteps = [
    { step: '01', title: 'Consultation', description: 'Understanding client requirements, scope, and budget.', icon: Clock },
    { step: '02', title: 'Planning & Design', description: 'Engineering, scheduling, and regulatory approvals.', icon: Shield },
    { step: '03', title: 'Execution', description: 'On-site project delivery with strict quality and safety checks.', icon: Building2 },
    { step: '04', title: 'Final Delivery', description: 'Inspection, handover, and ongoing support where needed.', icon: Award }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBDb25zdHJ1Y3Rpb24lMjBTaXRlfGVufDF8fHx8MTc1OTIzNDUxMnww&ixlib=rb-4.1.0&q=80&w=1080')`
          }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/40">Our Services</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Comprehensive <span className="block text-cyan-500">Project Solutions</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From contracting to consulting, Zeba Enterprises provides integrated services that ensure
            infrastructure and industrial projects are delivered with precision and excellence.
          </p>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Zeba Enterprises delivers a broad spectrum of services across multiple sectors in India.
            </p>
          </div>

          <div className="space-y-20">
            {mainServices.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;
              return (
                <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:grid-flow-col-dense'}`}>
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-lg text-gray-600 mb-6">{service.description}</p>
                    <div className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-primary mr-3" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={isEven ? '' : 'lg:col-start-1'}>
                    <ImageWithFallback src={service.image} alt={service.title} className="w-full h-96 object-cover rounded-lg shadow-xl" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Specialty Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Specialized Capabilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beyond core contracting, Zeba offers consulting and specialized services to support businesses and industries.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {specialtyServices.map((service, i) => (
              <Card key={i} className="text-center hover:shadow-lg transition">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A streamlined approach that ensures safety, quality, and timely delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Let’s Build Your Next Project</h2>
          <p className="text-xl text-cyan-100 mb-8">
            Get in touch with Zeba Enterprises today for a consultation and tailored project solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => onNavigate('contact')} className="cursor-pointer text-white border-none bg-cyan-600 hover:bg-white hover:text-cyan-600 px-8 py-3">
              Get Free Quote
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('projects')} className="bg-white text-cyan-600 cursor-pointer hover:bg-cyan-600 hover:text-white px-8 py-3">
              View Our Work
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Why Choose Zeba Enterprises?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-5xl font-bold text-cyan-600 mb-2">15+</div>
              <p className="text-muted">Years of Expertise</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-cyan-600 mb-2">50+</div>
              <p className="text-muted">Major Projects Delivered</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-cyan-600 mb-2">99.5%</div>
              <p className="text-muted">Safety Rating</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
