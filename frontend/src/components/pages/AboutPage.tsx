import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Users, Award, Shield, Target, Zap } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const values = [
    {
      icon: Target,
      title: 'Quality',
      description: 'We prioritize delivering services to the highest standards, ensuring customer satisfaction by achieving exceptional and sustainable results.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We embrace innovative solutions to enhance performance and provide outstanding services, keeping us aligned with modern advancements in the contracting sector.'
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We are committed to transparency and honesty in our dealings with clients and partners, fostering mutual trust and establishing long-term relationships.'
    },
    {
      icon: Users,
      title: 'Teamwork',
      description: 'We believe in the power of collaboration and teamwork to achieve success and enhance productivity to meet our common goals.'
    }
  ];

  const team = [
    {
      name: 'Rohan Sharma',
      role: 'Founder & CEO',
      experience: '20+ years',
      description: 'A visionary leader with extensive experience in infrastructure projects, guiding Zeba Enterprises with a commitment to quality and innovation.'
    },
    {
      name: 'Priya Singh',
      role: 'Chief Project Manager',
      experience: '15+ years',
      description: 'Expert in managing large-scale civil and railway projects, ensuring timely and budget-compliant delivery.'
    },
    {
      name: 'Amit Kumar',
      role: 'Head of Engineering',
      experience: '18+ years',
      description: 'Leads our engineering division with a focus on innovative solutions and sustainable design practices.'
    },
    {
      name: 'Sunita Reddy',
      role: 'Logistics & Supply Chain Director',
      experience: '12+ years',
      description: 'Manages our complex logistics operations, ensuring efficient supply chain management for all projects.'
    }
  ];

  const certifications = [
    'ISO 9001:2015 Certified',
    'Registered Class-I Contractor',
    'National Safety Council Member',
    'Indian Green Building Council (IGBC) Member',
    'Certified for Railway Project Works',
    'Licensed for Mining Operations'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-900 to-gray-700">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            // Recommended image: Page 2 of PDF (Construction site at sunset)
            backgroundImage: `url('https://images.unsplash.com/photo-1718209962486-4f91ce71886b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXJzJTIwdGVhbXxlbnwxfHx8fDE3NTg2NzUzMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-cyan-100 text-cyan-800">About Zeba Enterprises</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Building India's Future
            <span className="block text-cyan-500">With Precision</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Zeba Enterprises is an Indian company providing end-to-end project solutions, covering every stage from design to final delivery.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Us</h2>
              <p className="text-lg text-gray-600 mb-6">
                Zeba Enterprises is a leading Indian company offering a wide range of services, including contracting, engineering, consulting, and maintenance, with a strong focus on quality and precision.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                With extensive experience across various sectors, we have built a reputation as a reliable partner for delivering successful projects. Our commitment to social responsibility drives us to contribute to the nation's sustainable development and create job opportunities.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our commitment to tailored solutions, professionalism, and timely execution ensures we meet the unique needs of each client while maintaining the highest standards in every aspect of our work.
              </p>
              <Button onClick={() => onNavigate('projects')} className="bg-cyan-600 hover:bg-cyan-700">
                View Our Projects
              </Button>
            </div>
            <div className="relative">
              <ImageWithFallback
                // Recommended image: Page 3 of PDF (Handshake over blueprints)
                src="https://images.unsplash.com/photo-1556156653-e5a7c69cc263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBibHVlcHJpbnQlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzU4NzQ3ODY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Construction blueprints and planning"
                className="w-full h-96 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values guide everything we do and shape how we approach every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4">
                      <Icon className="w-8 h-8 text-cyan-600" />
                    </div>
                    <h3 className="font-bold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our qualified and professional team ensures precise execution in every project, maintaining the highest standards of efficiency and excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="font-bold mb-2">{member.name}</h3>
                  <p className="text-cyan-600 font-medium mb-2">{member.role}</p>
                  <Badge variant="outline" className="mb-3">{member.experience}</Badge>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Partner With Zeba Enterprises
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Experience the difference that quality craftsmanship and professional
            service can make for your next construction project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => onNavigate('contact')}
              className="bg-white text-cyan-600 cursor-pointer hover:bg-cyan-600 hover:text-white px-8 py-3"
            >
              Start Your Project
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('services')}
              className="cursor-pointer text-white border-none bg-cyan-600 hover:bg-white hover:text-cyan-600 px-8 py-3"
            >
              Our Services
            </Button>
          </div>
        </div>
      </section>

      {/* Certifications & Awards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Certifications & Credentials
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We maintain the highest industry standards through continuous education,
                certifications, and professional development. Our credentials ensure that
                we deliver safe, compliant, and high-quality construction services.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center">
                    <Award className="w-5 h-5 text-cyan-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <ImageWithFallback
                // Recommended image: Page 14 of PDF (JCB excavator)
                src="https://images.unsplash.com/photo-1661120212012-aca40671ba47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWF2eSUyMGNvbnN0cnVjdGlvbiUyMG1hY2hpbmVyeXxlbnwxfHx8fDE3NTg3ODY3Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Heavy construction machinery"
                className="w-full h-96 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}