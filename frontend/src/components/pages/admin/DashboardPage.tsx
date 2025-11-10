import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  IndianRupee,
  MapPin,
  Plus,
  Trash2,
  TrendingUp,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../App';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';
import ProjectCard from '../../ProjectCard';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  validate: () => void;
}

interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: string | null;
  timeline: string | null;
  status: 'ongoing' | 'upcoming' | 'completed';
  type: string;
  team: number | null;
  completion: number | null;
  startDate: string | null;
  estimatedEnd: string | null;
}

export function DashboardPage({ onNavigate, validate }: DashboardPageProps) {

  const [currentProjects, setCurrentProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [projects, setProjects] = useState([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    location: '',
    budget: '',
    timeline: '',
    status: 'upcoming' as const,
    type: '',
    team: 0,
    completion: 0,
    startDate: '',
    estimatedEnd: ''
  });


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/project/all-project");
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {

    if (Array.isArray(projects) && projects.length > 0) {
      const ongoing: [] = projects.filter(p => p.status === "ongoing");
      const completed: [] = projects.filter(p => p.status === "completed");
      const upcoming: [] = projects.filter(p => p.status === "upcoming");

      setCompletedProjects(completed);
      setCurrentProjects(ongoing);
      setUpcomingProjects(upcoming);
    }

  }, [projects])

  const handleAddProject = () => {
    if (!newProject.title || !newProject.location || !newProject.budget) {
      toast.error('Please fill in all required fields');
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      ...newProject
    };

    // setProjects([...projects, project]);
    setNewProject({
      title: '',
      description: '',
      location: '',
      budget: '',
      timeline: '',
      status: 'upcoming',
      type: '',
      team: 0,
      completion: 0,
      startDate: '',
      estimatedEnd: ''
    });
    setIsAddDialogOpen(false);
    toast.success('Project added successfully');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    toast.success('Project deleted successfully');
  };

  const handleToggleStatus = async (id: string, newStatus: "ongoing" | "upcoming" | "completed") => {
    try {
      const response = await api.post(`/project/${id}/update`, { status: newStatus });
      // Update local state
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p._id === id ? { ...p, status: response.data.status } : p
        )
      );
      toast.success("Project status updated");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const stats = {
    total: projects.length,
    ongoing: projects.filter(p => p.status === 'ongoing').length,
    upcoming: projects.filter(p => p.status === 'upcoming').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBudget: 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-foreground">Project Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Manage and monitor your construction projects
              </p>
            </motion.div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="Enter project title"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Enter project description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={newProject.location}
                      onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget *</Label>
                    <Input
                      id="budget"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                      placeholder="₹100 Cr"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline</Label>
                    <Input
                      id="timeline"
                      value={newProject.timeline}
                      onChange={(e) => setNewProject({ ...newProject, timeline: e.target.value })}
                      placeholder="24 months"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Project Type</Label>
                    <Select value={newProject.type} onValueChange={(value) => setNewProject({ ...newProject, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="team">Team Size</Label>
                    <Input
                      id="team"
                      type="number"
                      value={newProject.team}
                      onChange={(e) => setNewProject({ ...newProject, team: parseInt(e.target.value) || 0 })}
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedEnd">Estimated End Date</Label>
                    <Input
                      id="estimatedEnd"
                      type="date"
                      value={newProject.estimatedEnd}
                      onChange={(e) => setNewProject({ ...newProject, estimatedEnd: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProject}>
                    Add Project
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="enterprise-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Total Projects</p>
                      <p className="text-2xl font-bold text-primary">{stats.total}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="enterprise-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Ongoing</p>
                      <p className="text-2xl font-bold text-green-600">{stats.ongoing}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="enterprise-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Upcoming</p>
                      <p className="text-2xl font-bold text-amber-600">{stats.upcoming}</p>
                    </div>
                    <Clock className="w-8 h-8 text-amber-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="enterprise-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Completed</p>
                      <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="enterprise-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Total Budget</p>
                      <p className="text-2xl font-bold text-primary">₹{stats.totalBudget.toFixed(0)}K Cr</p>
                    </div>
                    <IndianRupee className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Management */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">All Projects</h2>
                <p className="text-xl text-gray-600">
                  Showcasing all our construction projects.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard project={project} footer={true} handleToggleStatus={(id, status) => handleToggleStatus(id, status)} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="ongoing" className="space-y-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Ongoing Projects</h2>
                <p className="text-xl text-gray-600">
                  Showcasing our ongoing construction projects.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProjects.map((project) => (
                  <ProjectCard project={project} footer={true} handleToggleStatus={(id, status) => handleToggleStatus(id, status)} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="space-y-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Completed Projects</h2>
                <p className="text-xl text-gray-600">
                  Showcasing our successfully completed construction projects.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedProjects.map((project) => (
                  <ProjectCard project={project} footer={true} handleToggleStatus={(id, status) => handleToggleStatus(id, status)} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="upcoming" className="space-y-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Projects</h2>
                <p className="text-xl text-gray-600">
                  Showcasing our upcoming construction projects.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingProjects.map((project) => (
                  <ProjectCard project={project} footer={true} handleToggleStatus={(id, status) => handleToggleStatus(id, status)} />
                ))}
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </section>
    </div>
  );
}