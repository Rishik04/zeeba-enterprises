import { useEffect, useState } from 'react';
import { api } from '../../App';
import road from "../../assets/road3.jpeg";
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ProjectCard from '../ProjectCard';

interface ProjectsPageProps {
  onNavigate: (page: string) => void;
}

export function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [upcomingProjects, setUpcomingProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/project/all-project");

        if (Array.isArray(data) && data.length > 0) {
          const ongoing: [] = data.filter(p => p.status === "ongoing");
          const completed: [] = data.filter(p => p.status === "completed");
          const upcoming: [] = data.filter(p => p.status === "upcoming");

          setCurrentProjects(ongoing);
          setCompletedProjects(completed);
          setUpcomingProjects(upcoming);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-900 to-gray-700">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url(${road})`
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
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-12">
              <TabsTrigger value="current">Current Projects</TabsTrigger>
              <TabsTrigger value="completed">Completed Projects</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Current Projects</h2>
                <p className="text-xl text-gray-600">
                  Take a look at our ongoing projects and their progress.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} status={"ongoing"} />
                ))}
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
                  <ProjectCard key={project.id} project={project} status={"completed"} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Projects</h2>
                <p className="text-xl text-gray-600">
                  Showcasing our upcoming construction projects.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} status={"upcoming"} />
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