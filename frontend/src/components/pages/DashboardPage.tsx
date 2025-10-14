import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: string;
  timeline: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  type: string;
  team: number;
  completion: number;
  startDate: string;
  estimatedEnd: string;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Mumbai Metro Phase IV Extension',
      description: 'Underground metro corridor connecting Bandra to SEEPZ with 12 stations.',
      location: 'Mumbai, Maharashtra',
      budget: '₹8,500 Cr',
      timeline: '36 months',
      status: 'ongoing',
      type: 'Infrastructure',
      team: 450,
      completion: 65,
      startDate: '2023-01-15',
      estimatedEnd: '2026-01-15'
    },
    {
      id: '2',
      title: 'Bangalore IT Park Complex',
      description: 'Modern IT campus with sustainable design and smart building features.',
      location: 'Bangalore, Karnataka',
      budget: '₹1,200 Cr',
      timeline: '24 months',
      status: 'upcoming',
      type: 'Commercial',
      team: 200,
      completion: 0,
      startDate: '2024-06-01',
      estimatedEnd: '2026-06-01'
    },
    {
      id: '3',
      title: 'Delhi Affordable Housing Project',
      description: 'Smart city compliant residential towers with 2000+ units.',
      location: 'Dwarka, New Delhi',
      budget: '₹950 Cr',
      timeline: '30 months',
      status: 'ongoing',
      type: 'Residential',
      team: 320,
      completion: 42,
      startDate: '2023-06-01',
      estimatedEnd: '2025-12-01'
    }
  ]);

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

  const handleAddProject = () => {
    if (!newProject.title || !newProject.location || !newProject.budget) {
      toast.error('Please fill in all required fields');
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      ...newProject
    };

    setProjects([...projects, project]);
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

  const handleToggleStatus = (id: string, newStatus: 'ongoing' | 'upcoming' | 'completed') => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, status: newStatus } : p
    ));
    toast.success('Project status updated');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <Badge className="status-ongoing">Ongoing</Badge>;
      case 'upcoming':
        return <Badge className="status-upcoming">Upcoming</Badge>;
      case 'completed':
        return <Badge className="status-completed">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const stats = {
    total: projects.length,
    ongoing: projects.filter(p => p.status === 'ongoing').length,
    upcoming: projects.filter(p => p.status === 'upcoming').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => {
      const budget = parseFloat(p.budget.replace(/[₹,\s]/g, '').replace('Cr', ''));
      return sum + budget;
    }, 0)
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
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      placeholder="Enter project title"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Enter project description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={newProject.location}
                      onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget *</Label>
                    <Input
                      id="budget"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                      placeholder="₹100 Cr"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline</Label>
                    <Input
                      id="timeline"
                      value={newProject.timeline}
                      onChange={(e) => setNewProject({...newProject, timeline: e.target.value})}
                      placeholder="24 months"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Project Type</Label>
                    <Select value={newProject.type} onValueChange={(value) => setNewProject({...newProject, type: value})}>
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
                      onChange={(e) => setNewProject({...newProject, team: parseInt(e.target.value) || 0})}
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedEnd">Estimated End Date</Label>
                    <Input
                      id="estimatedEnd"
                      type="date"
                      value={newProject.estimatedEnd}
                      onChange={(e) => setNewProject({...newProject, estimatedEnd: e.target.value})}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="enterprise-shadow hover:enterprise-shadow-lg transition-all duration-200">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                            <div className="flex items-center mt-2">
                              {getStatusBadge(project.status)}
                              <Badge variant="outline" className="ml-2">{project.type}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="truncate">{project.location}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <IndianRupee className="w-4 h-4 mr-2" />
                            <span>{project.budget}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{project.timeline}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{project.team} team</span>
                          </div>
                        </div>
                        
                        {project.status !== 'upcoming' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{project.completion}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${project.completion}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label className="text-sm">Quick Status Change</Label>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={project.status === 'upcoming' ? 'default' : 'outline'}
                              onClick={() => handleToggleStatus(project.id, 'upcoming')}
                              className="flex-1"
                            >
                              Upcoming
                            </Button>
                            <Button
                              size="sm"
                              variant={project.status === 'ongoing' ? 'default' : 'outline'}
                              onClick={() => handleToggleStatus(project.id, 'ongoing')}
                              className="flex-1"
                            >
                              Ongoing
                            </Button>
                            <Button
                              size="sm"
                              variant={project.status === 'completed' ? 'default' : 'outline'}
                              onClick={() => handleToggleStatus(project.id, 'completed')}
                              className="flex-1"
                            >
                              Complete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {['ongoing', 'upcoming', 'completed'].map(status => (
              <TabsContent key={status} value={status} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects
                    .filter(p => p.status === status)
                    .map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Card className="enterprise-shadow hover:enterprise-shadow-lg transition-all duration-200">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                                <div className="flex items-center mt-2">
                                  {getStatusBadge(project.status)}
                                  <Badge variant="outline" className="ml-2">{project.type}</Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {project.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span className="truncate">{project.location}</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <IndianRupee className="w-4 h-4 mr-2" />
                                <span>{project.budget}</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{project.timeline}</span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Users className="w-4 h-4 mr-2" />
                                <span>{project.team} team</span>
                              </div>
                            </div>
                            
                            {project.status !== 'upcoming' && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{project.completion}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${project.completion}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
                
                {projects.filter(p => p.status === status).length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No {status} projects
                    </h3>
                    <p className="text-muted-foreground">
                      {status === 'ongoing' && 'No projects are currently in progress.'}
                      {status === 'upcoming' && 'No projects are scheduled to start.'}
                      {status === 'completed' && 'No projects have been completed yet.'}
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  );
}