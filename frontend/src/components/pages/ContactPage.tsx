import {
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import emailjs from "@emailjs/browser"
import pump from "../../assets/pump.jpeg"

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const form = useRef();
  const [projectType, setProjectType] = useState('Select project type');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formElement = form.current as HTMLFormElement;

    const timestamp = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });

    // Create template params with timestamp
    const templateParams = {
      from_name: formElement.from_name.value,
      from_email: formElement.from_email.value,
      phone: formElement.phone.value || 'Not provided',
      project_type: projectType || 'Not specified',
      message: formElement.message.value,
      timestamp: timestamp
    };

    console.log('Sending email with params:', templateParams);

    emailjs
      .send('service_as5nkhb', 'template_qt47zk2', templateParams, {
        publicKey: 'frtARbq4fN6cuksO_',
      })
      .then(
        () => {
          toast.success('Thank you! Your message has been sent successfully. We\'ll get back to you shortly.');
          formElement.reset();
          setProjectType('Select project type');
        },
        (error) => {
          console.log('FAILED...', error);
          toast.error('Failed to send message. Please try again or contact us directly.');

        },
      );


    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['9801359772 / 9693388722'],
      description: 'Call us for immediate assistance'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['zebaenterprises5@gmail.com'],
      description: 'Send us your project details'
    },
    {
      icon: MapPin,
      title: 'Office',
      details: ['Dhanbad, Jharkhand, India'],
      description: 'Headquarters Location'
    },
    {
      icon: Clock,
      title: 'Hours',
      details: ['Mon-Sat: 9:00 AM - 6:00 PM'],
      description: 'Business working hours'
    }
  ];

  const officeLocations = [
    {
      name: 'Head Office',
      address: 'Dhanbad, Jharkhand, India',
      phone: '9801359772',
      services: ['General Inquiries', 'Contracting Works', 'Project Management']
    },
    {
      name: 'Project Branch Office',
      address: 'Patna, Bihar, India',
      phone: '9693388722',
      services: ['On-site Coordination', 'Civil Engineering Support', 'Client Meetings']
    }
  ];

  const faqs = [
    {
      question: 'What sectors does Zeba Enterprises serve?',
      answer: 'We deliver projects across railways, mining, roadways, pipelines, buildings, and civil infrastructure.'
    },
    {
      question: 'Do you provide consulting services?',
      answer: 'Yes. We offer engineering, management, financial, and marketing consulting alongside contracting works.'
    },
    {
      question: 'How do I start a project with Zeba?',
      answer: 'Fill the contact form or call our head office. Our team will schedule a consultation to discuss scope, budget, and timelines.'
    },
    {
      question: 'What makes Zeba different?',
      answer: 'With 15+ years of expertise, a 99.5% safety rating, and a skilled workforce, we ensure reliable, high-quality delivery.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-900 to-gray-700">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage:`url(${pump})`
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/40">Get In Touch</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Contact <span className="block text-cyan-500">Zeba Enterprises</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Reach out to us for contracting, engineering, logistics, and consulting inquiries.
            Our team will connect with you promptly.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold mb-2">{info.title}</h3>
                  <div className="space-y-1 mb-2">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-900">{detail}</p>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Contact Form & Offices */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2 text-cyan-600" />
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name='from_name' type="text" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name='from_email' type="email" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name='phone' type="tel" />
                  </div>
                  <div>
                    <Label htmlFor="projectType">Project Type</Label>
                    <Select name='project_type' onValueChange={(e) => { setProjectType(e) }}>
                      <SelectTrigger><SelectValue placeholder={projectType} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contracting">Contracting Works</SelectItem>
                        <SelectItem value="civil">Civil Engineering</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message">Project Details *</Label>
                    <Textarea id="message" required rows={5} />
                  </div>
                  <Button type="submit" className="w-full bg-cyan-600" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : <>Send Message <Send className="ml-2 w-4 h-4" /></>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Offices */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Offices</h2>
            {officeLocations.map((loc, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">{loc.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600 mt-1" />
                      <span className="text-gray-700">{loc.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-gray-700">{loc.phone}</span>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">Services:</h4>
                  <div className="flex flex-wrap gap-2">
                    {loc.services.map((s, j) => (
                      <Badge key={j} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers about our services and process.</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-6 flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">24/7 Support & Safety Response</h2>
          <p className="text-xl text-blue-100 mb-8">
            For urgent site coordination, safety issues, or emergency project needs, our team is available around the clock.
          </p>
          <Button size="lg" className="bg-white text-cyan-600 cursor-pointer hover:bg-gray-100 px-8 py-3" onClick={() => window.open('tel:9693388722')}>
            <Phone className="w-5 h-5 mr-2" />
            Call Now: +91 9693388722
          </Button>
        </div>
      </section>
    </div>
  );
}
