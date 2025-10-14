import { Calendar, CheckCircle, DollarSign, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../App';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import road from "../../assets/road3.jpeg"
import rail from "../../assets/rail.jpeg"

interface ProjectsPageProps {
  onNavigate: (page: string) => void;
}

export function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  // const [currentProjects, setCurrentProjects] = useState([]);

  const currentProjects = [
    {
      id: 2,
      title: 'Railways Affairs in Varanasi Division',
      type: 'Railway',
      location: 'Varanasi, Uttar Pradesh',
      progress: 65,
      description: 'Comprehensive railway infrastructure development and maintenance project in the Varanasi Division.',
      image: [rail], // Recommended: Image from PDF Page 13
      features: ['Track Laying', 'Signal Modernization', 'Station Upgrades', 'Safety Compliance']
    },
    {
      id: 3,
      title: 'Mining Project Affairs in Dhanbad',
      type: 'Mining',
      location: 'Dhanbad, Jharkhand',
      progress: 80,
      description: 'Ongoing mining operations support, including infrastructure and logistics management in Dhanbad.',
      image: ['https://images.unsplash.com/photo-1627393439002-306135839074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNaW5pbmclMjBFeGNhdmF0b3J8ZW58MXx8fHwxNzU5MjM0NTA4fDA&ixlib=rb-4.1.0&q=80&w=1080'], // Recommended: Image from PDF Page 14
      features: ['Site Management', 'Logistical Support', 'Equipment Maintenance', 'Safety Protocols']
    },
    {
      id: 5,
      title: 'Building Construction in Patna',
      type: 'Residential',
      location: 'Patna, Bihar',
      progress: 50,
      description: 'Construction of a multi-story residential apartment complex in a prime location in Patna.',
      image: ['https://images.unsplash.com/photo-1517581177682-a085bb7ffb12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBCdWlsZGluZyUyMFVuZGVyJTIwQ29uc3RydWN0aW9ufGVufDF8fHx8MTc1OTIzNDUwOXww&ixlib=rb-4.1.0&q=80&w=1080'], // Recommended: Image from PDF Page 16
      features: ['Multi-story Structure', 'Modern Amenities', 'Quality Materials', 'Timely Execution']
    },
    {
      id: 6,
      title: 'Roadways Project in Barhi',
      type: 'Infrastructure',
      location: 'Barhi, Jharkhand',
      progress: 90,
      description: 'Development and paving of key roadways to improve connectivity and transport in Barhi.',
      image: ['https://images.unsplash.com/photo-1621994345719-2149b80894e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBSb2FkJTIwQ29uc3RydWN0aW9ufGVufDF8fHx8MTc1OTIzNDUwOXww&ixlib=rb-4.1.0&q=80&w=1080'], // Recommended: Image from PDF Page 17
      features: ['Asphalt Paving', 'Drainage Systems', 'Road Marking', 'Safety Barriers']
    },
    {
      id: 4,
      title: 'Civil Project Affairs in Dhanbad',
      type: 'Civil',
      location: 'Dhanbad, Jharkhand',
      progress: 70,
      description: 'Specialized civil engineering works, including bridge and structural projects in Dhanbad.',
      image: ['https://images.unsplash.com/photo-1618585807987-a31d9a2a7589?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCcmlkZ2UlMjBDb25zdHJ1Y3Rpb24lMjBJbmRpYXxlbnwxfHx8fDE3NTkyMzQ1MTB8MA&ixlib=rb-4.1.0&q=80&w=1080'], // Recommended: Image from PDF Page 15
      features: ['Bridge Construction', 'Structural Integrity', 'Foundation Work', 'Quality Assurance']
    }
  ];

  const completedProjects = [
    {
      id: 1,
      title: 'Water Pipeline in Dhanbad',
      type: 'Infrastructure',
      location: 'Dhanbad, Jharkhand',
      description: 'Successfully executed the laying of a major water pipeline to improve water supply in the Dhanbad region.',
      image: ['https://images.unsplash.com/photo-1590693539209-6d1151e6b365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxXYXRlciUyMFBpcGVsaW5lJTIwQ29uc3RydWN0aW9ufGVufDF8fHx8MTc1OTIzNDUxMHww&ixlib=rb-4.1.0&q=80&w=1080'], // Placeholder image
      features: ['High-Density Pipe', 'Trenching & Laying', 'Leak-proof Jointing', 'Community Impact'],
      awards: ['Public Utility Project of the Year 2022']
    },
    {
      id: 7,
      title: 'Warehouse Construction',
      type: 'Commercial',
      location: 'Jharia, Jharkhand',
      description: 'Built a state-of-the-art warehouse facility for a major logistics partner in the Jharia industrial area.',
      image: ['https://images.unsplash.com/photo-1587145820137-a9a499318858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmR1c3RyaWFsJTIwV2FyZWhvdXNlfGVufDF8fHx8MTc1OTIzNDUxMXww&ixlib=rb-4.1.0&q=80&w=1080'], // Placeholder image
      features: ['Steel Frame Structure', 'High-capacity Storage', 'Loading Docks', 'Security Systems'],
      awards: ['Excellence in Industrial Construction']
    },
    {
      id: 8,
      title: 'Community Hall Renovation',
      type: 'Public',
      location: 'Katras, Jharkhand',
      description: 'Complete renovation and modernization of the Katras municipal community hall for public events.',
      image: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb2Rlcm4lMjBJbnRlcmlvciUyMEhvbWV8ZW58MXx8fHwxNzU5MjM0NTEyfDA&ixlib=rb-4.1.0&q=80&w=1080'], // Placeholder image
      features: ['Structural Upgrades', 'Modern Interiors', 'AV System Integration', 'Accessibility Features'],
      awards: ['Community Impact Award 2024']
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Commercial': return 'bg-blue-100 text-blue-800';
      case 'Residential': return 'bg-green-100 text-green-800';
      case 'Infrastructure': return 'bg-purple-100 text-purple-800';
      case 'Public': return 'bg-orange-100 text-orange-800';
      case 'Railway': return 'bg-red-100 text-red-800';
      case 'Mining': return 'bg-yellow-100 text-yellow-800';
      case 'Civil': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // useEffect(() => {
  //   const project = async () => {
  //     try {
  //       const projects = await api.get("/project/all-project")
  //       console.log(projects.data)
  //       if (projects.data) {
  //         setCurrentProjects(projects.data);
  //       }
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   };
  //   project();
  // }, [])

  const ProjectCard = ({ project, isCurrent = false }: { project: any; isCurrent?: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {project.image.map((img: string, idx: number) => (
              <CarouselItem key={idx}>
                <div className="w-full h-48">
                  <ImageWithFallback
                    src={`http://localhost:8000/${img.replaceAll("\\", "/")}`}
                    alt={`${project.title} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {project.image.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 hover:bg-white hover:text-black" />
              <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-white hover:text-black" />
            </>
          )}
        </Carousel>
        <Badge className={`absolute top-3 left-3 ${getTypeColor(project.type)}`}>
          {project.type}
        </Badge>
        {isCurrent && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-sm">
            In Progress
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{project.title}</CardTitle>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {project.location}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 h-16">{project.description}</p>

        <div className="space-y-2 mb-4">
          {isCurrent ? (
            <>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-cyan-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </>
          ) : ""
          }
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Key Features</h4>
          <div className="flex flex-wrap gap-1">
            {project.features.map((feature: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {!isCurrent && project.awards && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Awards & Recognition</h4>
            <div className="flex flex-wrap gap-1">
              {project.awards.map((award: string, index: number) => (
                <Badge key={index} className="text-xs bg-yellow-100 text-yellow-800">
                  {award}
                </Badge>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-900 to-gray-700">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage:`url(${road})`
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-cyan-100 text-cyan-800">Our Portfolio</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Building India's
            <span className="block text-cyan-500">Infrastructure</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our diverse portfolio of infrastructure, civil, mining, and construction projects that contribute to the nation's development.
          </p>
        </div>
      </section>

      {/* Project Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">15+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">₹50 Cr+</div>
              <div className="text-gray-600">Total Project Value</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">3+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">3+</div>
              <div className="text-gray-600">States Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Tabs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
              <TabsTrigger value="current">Current Projects</TabsTrigger>
              <TabsTrigger value="completed">Completed Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Current Projects</h2>
                <p className="text-xl text-gray-600">
                  Take a look at our ongoing projects and their progress.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentProjects && currentProjects != undefined ? currentProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} isCurrent={true} />
                )) : ""}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Completed Projects</h2>
                <p className="text-xl text-gray-600">
                  Showcasing our successfully completed construction projects.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {completedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} isCurrent={false} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Let us bring your vision to life with our proven track record of successful projects and commitment to quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => onNavigate('contact')}
              className="cursor-pointer text-white border-none bg-cyan-600 hover:bg-white hover:text-cyan-600 px-8 py-3"
            >
              Start Your Project
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('services')}
              className="bg-white text-cyan-600 cursor-pointer hover:bg-cyan-600 hover:text-white px-8 py-3"
            >
              Our Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}