import {
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  IndianRupee,
  List,
  MapPin,
  Plus,
  Save,
  Trash2,
  TrendingUp,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../App';
import ProjectCard from '../../ProjectCard';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';
import { useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_PUBLIC_URL;

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  validate: () => void;
}

interface Project {
  _id: string;
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
  image: string[];
  features: string[];
  value: string;
  completionDate: string;
}

export function DashboardPage({ onNavigate, validate }: DashboardPageProps) {
  const queryClient = useQueryClient();
  const [currentProjects, setCurrentProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    type: '',
    description: '',
    location: '',
    value: '',
    completionDate: '',
    startDate: '',
    features: [] as string[],
    image: [] as File[]
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // --- EDIT STATE ---
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [editProject, setEditProject] = useState({
    title: '',
    type: '',
    description: '',
    location: '',
    value: '',
    startDate: '',
    completionDate: '',
    features: [] as string[],
    existingImages: [] as string[],
    newImages: [] as File[]
  });

  const [editPreviewUrls, setEditPreviewUrls] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  // cleanup object URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      editPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls, editPreviewUrls]);

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
      const ongoing: any = projects.filter(p => p.status === "ongoing");
      const completed: any = projects.filter(p => p.status === "completed");
      const upcoming: any = projects.filter(p => p.status === "upcoming");

      setCompletedProjects(completed);
      setCurrentProjects(ongoing);
      setUpcomingProjects(upcoming);
    }
  }, [projects])

  const resetForm = () => {
    setNewProject({
      title: "",
      type: "",
      description: "",
      location: "",
      value: "",
      completionDate: "",
      startDate: "",
      features: [],
      image: [],
    });
  };

  // --- ADD PROJECT LOGIC ---
  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.location.trim() || !newProject.value.trim()) {
      toast.error("Please fill in required fields: Title, Location, Value");
      return;
    }

    try {
      const form = new FormData();
      form.append('title', newProject.title);
      form.append('type', newProject.type);
      form.append('description', newProject.description);
      form.append('location', newProject.location);
      form.append('value', newProject.value);
      form.append('startDate', newProject.startDate || '');
      form.append('completionDate', newProject.completionDate || '');
      form.append('features', JSON.stringify(newProject.features.map(f => f.trim()).filter(Boolean)));

      (newProject.image || []).forEach((file: File) => {
        form.append('images', file);
      });

      const res = await api.post('/project/create-project', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const created = res.data;
      setProjects(prev => [created, ...prev]);
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project added successfully');
      resetForm();
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? 'Upload failed');
    }
  };

  const handleImagesChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files).slice(0, 6);
    setNewProject(prev => ({
      ...prev,
      image: [...(prev.image || []), ...fileArray]
    }));
    const newUrls = fileArray.map(f => URL.createObjectURL(f));
    setPreviewUrls(prev => [...prev, ...newUrls]);
  };

  const removeImageAt = (index: number) => {
    setNewProject(prev => ({ ...prev, image: prev.image.filter((_, i) => i !== index) }));
    setPreviewUrls(prev => {
      const urlToRevoke = prev[index];
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateFeatureAt = (index: number, value: string) => {
    setNewProject((prev) => {
      const features = [...prev.features];
      features[index] = value;
      return { ...prev, features };
    });
  };

  const addFeature = () => setNewProject((prev) => ({ ...prev, features: [...prev.features, ""] }));

  const removeFeatureAt = (index: number) =>
    setNewProject((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));

  // --- EDIT PROJECT LOGIC ---

  const handleEditProject = (project: any) => {
    setEditingProject(project);

    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      return new Date(dateString).toISOString().split('T')[0];
    };

    setEditProject({
      title: project.title,
      type: project.type,
      description: project.description,
      location: project.location,
      value: project.value,
      startDate: formatDate(project.startDate),
      completionDate: formatDate(project.completionDate),
      features: project.features || [],
      existingImages: project.image || [],
      newImages: []
    });

    setEditPreviewUrls([]);
    setRemovedImages([]);
    setIsEditDialogOpen(true);
  };

  const handleEditImagesChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    setEditProject(prev => ({
      ...prev,
      newImages: [...prev.newImages, ...fileArray]
    }));
    const newUrls = fileArray.map(f => URL.createObjectURL(f));
    setEditPreviewUrls(prev => [...prev, ...newUrls]);
  };

  const removeEditNewImageAt = (index: number) => {
    setEditProject(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index)
    }));
    setEditPreviewUrls(prev => {
      const urlToRevoke = prev[index];
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeEditExistingImage = (imagePath: string) => {
    setRemovedImages(prev => [...prev, imagePath]);
  };

  const addEditFeature = () => setEditProject(prev => ({ ...prev, features: [...prev.features, ""] }));

  const updateEditFeature = (index: number, value: string) => {
    setEditProject(prev => {
      const features = [...prev.features];
      features[index] = value;
      return { ...prev, features };
    });
  };

  const removeEditFeature = (index: number) => {
    setEditProject(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;

    try {
      const form = new FormData();
      form.append('title', editProject.title);
      form.append('type', editProject.type);
      form.append('description', editProject.description);
      form.append('location', editProject.location);
      form.append('value', editProject.value);
      form.append('startDate', editProject.startDate);
      form.append('completionDate', editProject.completionDate);
      form.append('features', JSON.stringify(editProject.features.filter(Boolean)));
      form.append('removedImages', JSON.stringify(removedImages));

      editProject.newImages.forEach(file => {
        form.append('images', file);
      });

      const res = await api.put(`/project/update/${editingProject._id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedProject = res.data;
      setProjects(prev => prev.map(p => p._id === editingProject._id ? updatedProject : p));
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success("Project updated successfully");
      setIsEditDialogOpen(false);
      setEditingProject(null);

    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update project");
    }
  };


  const handleToggleStatus = async (id: string, newStatus: "ongoing" | "upcoming" | "completed") => {
    try {
      const response = await api.post(`/project/${id}/update-status`, { status: newStatus });
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

            {/* --- ADD PROJECT DIALOG (Refactored) --- */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>

              <DialogContent className="w-full sm:max-w-4xl max-w-5xl w-[90vw] h-[90vh] p-0 flex flex-col overflow-hidden">
                {/* Fixed Header */}
                <div className="px-6 py-4 border-b">
                  <DialogHeader className="p-0">
                    <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                      <Building2 className="w-5 h-5" /> Add New Project
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                      Enter the project details below. Use the tabs to navigate sections.
                    </DialogDescription>
                  </DialogHeader>
                </div>

                {/* Scrollable Body - Split View */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-y-auto">

                  {/* LEFT: Core Details */}
                  <div className="px-6 py-4 space-y-4">
                    <div>
                      <Label htmlFor="title">Project Title *</Label>
                      <Input id="title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="Enter project title" className="mt-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Project Type</Label>
                        <Select value={newProject.type} onValueChange={(value) => setNewProject({ ...newProject, type: value })}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
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
                        <Label>Value *</Label>
                        <div className="relative mt-1">
                          <IndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input value={newProject.value} onChange={(e) => setNewProject({ ...newProject, value: e.target.value })} className="pl-10" placeholder="100 Cr" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Location *</Label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input value={newProject.location} onChange={(e) => setNewProject({ ...newProject, location: e.target.value })} className="pl-10" placeholder="City, State" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <div className="relative mt-1">
                          <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="date" value={newProject.startDate} onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })} className="pl-10" />
                        </div>
                      </div>
                      <div>
                        <Label>Completion Date</Label>
                        <div className="relative mt-1">
                          <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="date" value={newProject.completionDate} onChange={(e) => setNewProject({ ...newProject, completionDate: e.target.value })} className="pl-10" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Detailed Content */}
                  <div className="px-6 py-4 space-y-5 bg-gray-50/50 border-l border-gray-100 h-full">
                    <div>
                      <Label>Description</Label>
                      <Textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="mt-1 min-h-[140px] resize-none" placeholder="Detailed project description..." />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="flex items-center gap-2"><List className="w-4 h-4" /> Features</Label>
                        <Button size="sm" variant="ghost" onClick={addFeature} type="button" className="h-8 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50">
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                        {newProject.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Input value={feature} onChange={(e) => updateFeatureAt(idx, e.target.value)} className="h-9 bg-white" placeholder="Feature detail" />
                            <Button size="icon" variant="ghost" onClick={() => removeFeatureAt(idx)} type="button" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {newProject.features.length === 0 && <p className="text-xs text-muted-foreground italic">No features added yet.</p>}
                      </div>
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 mb-2"><ImageIcon className="w-4 h-4" /> Project Gallery</Label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-center gap-4 mb-3">
                          <input type="file" accept="image/*" multiple onChange={(e) => handleImagesChange(e.target.files)} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {previewUrls.map((src, idx) => (
                            <div key={idx} className="relative aspect-square rounded overflow-hidden border bg-gray-100 group">
                              <img src={src} className="w-full h-full object-cover" />
                              <button onClick={() => removeImageAt(idx)} type="button" className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm text-red-500 hover:text-red-600">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer */}
                <DialogFooter className="px-6 py-4 border-t bg-white flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }} type="button">Cancel</Button>
                  <Button onClick={handleAddProject} type="button" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    <Save className="w-4 h-4 mr-2" /> Save Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>


            {/* --- EDIT PROJECT DIALOG (Refactored) --- */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="w-full sm:mx-4 sm:max-w-4xl max-w-5xl w-[90vw] h-[90vh] p-0 flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <DialogHeader className="p-0">
                    <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                      <Building2 className="w-5 h-5" /> Edit Project
                    </DialogTitle>
                    <DialogDescription>Modify the details for {editProject.title}</DialogDescription>
                  </DialogHeader>
                </div>

                {editingProject && (
                  <>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
                      {/* LEFT: Core Details */}
                      <div className="px-6 py-4 space-y-4">
                        <div>
                          <Label htmlFor="edit-title">Project Title</Label>
                          <Input id="edit-title" value={editProject.title} onChange={(e) => setEditProject({ ...editProject, title: e.target.value })} className="mt-1" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Project Type</Label>
                            <Select value={editProject.type} onValueChange={(value) => setEditProject({ ...editProject, type: value })}>
                              <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
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
                            <Label>Value</Label>
                            <div className="relative mt-1">
                              <IndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input value={editProject.value} onChange={(e) => setEditProject({ ...editProject, value: e.target.value })} className="pl-10" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label>Location</Label>
                          <div className="relative mt-1">
                            <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input value={editProject.location} onChange={(e) => setEditProject({ ...editProject, location: e.target.value })} className="pl-10" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Start Date</Label>
                            <div className="relative mt-1">
                              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="date" value={editProject.startDate} onChange={(e) => setEditProject({ ...editProject, startDate: e.target.value })} className="pl-10" />
                            </div>
                          </div>
                          <div>
                            <Label>Completion Date</Label>
                            <div className="relative mt-1">
                              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="date" value={editProject.completionDate} onChange={(e) => setEditProject({ ...editProject, completionDate: e.target.value })} className="pl-10" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT: Detailed Content */}
                      <div className="px-6 py-4 space-y-5 bg-gray-50/50 border-l border-gray-100 h-full">
                        <div>
                          <Label>Description</Label>
                          <Textarea value={editProject.description} onChange={(e) => setEditProject({ ...editProject, description: e.target.value })} className="mt-1 min-h-[140px] resize-none" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="flex items-center gap-2"><List className="w-4 h-4" /> Features</Label>
                            <Button size="sm" variant="ghost" onClick={addEditFeature} type="button" className="h-8 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50">
                              <Plus className="w-3.5 h-3.5 mr-1" /> Add
                            </Button>
                          </div>
                          <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                            {editProject.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Input value={feature} onChange={(e) => updateEditFeature(idx, e.target.value)} className="h-9 bg-white" />
                                <Button size="icon" variant="ghost" onClick={() => removeEditFeature(idx)} type="button" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600">
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="flex items-center gap-2 mb-2"><ImageIcon className="w-4 h-4" /> Images</Label>
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-white">
                            <div className="flex items-center gap-4 mb-3">
                              <input type="file" accept="image/*" multiple onChange={(e) => handleEditImagesChange(e.target.files)} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {/* Existing Images */}
                              {editProject.existingImages.map((src, idx) => {
                                if (removedImages.includes(src)) return null;
                                return (
                                  <div key={`existing-${idx}`} className="relative aspect-square rounded overflow-hidden border group">
                                    <img src={`${API_URL}/${src.replaceAll("\\", "/")}`} className="w-full h-full object-cover" />
                                    <div className="absolute top-0 right-0 p-0.5 bg-black/50 text-white text-[10px] rounded-bl">Existing</div>
                                    <button onClick={() => removeEditExistingImage(src)} type="button" className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-100">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )
                              })}

                              {/* New Images */}
                              {editPreviewUrls.map((src, idx) => (
                                <div key={`new-${idx}`} className="relative aspect-square rounded overflow-hidden border group">
                                  <img src={src} className="w-full h-full object-cover" />
                                  <div className="absolute top-0 right-0 p-0.5 bg-green-500/80 text-white text-[10px] rounded-bl">New</div>
                                  <button onClick={() => removeEditNewImageAt(idx)} type="button" className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-100">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fixed Footer */}
                    <DialogFooter className="px-6 py-4 border-t bg-white flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} type="button">Cancel</Button>
                      <Button onClick={handleUpdateProject} type="button" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        <Save className="w-4 h-4 mr-2" /> Update Project
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>

          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="enterprise-shadow"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Total Projects</p><p className="text-2xl font-bold text-primary">{stats.total}</p></div><Building2 className="w-8 h-8 text-primary" /></div></CardContent></Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <Card className="enterprise-shadow"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Ongoing</p><p className="text-2xl font-bold text-green-600">{stats.ongoing}</p></div><TrendingUp className="w-8 h-8 text-green-600" /></div></CardContent></Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Card className="enterprise-shadow"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Upcoming</p><p className="text-2xl font-bold text-amber-600">{stats.upcoming}</p></div><Clock className="w-8 h-8 text-amber-600" /></div></CardContent></Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <Card className="enterprise-shadow"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Completed</p><p className="text-2xl font-bold text-gray-600">{stats.completed}</p></div><CheckCircle className="w-8 h-8 text-gray-600" /></div></CardContent></Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <Card className="enterprise-shadow"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-muted-foreground text-sm">Total Budget</p><p className="text-2xl font-bold text-primary">₹{stats.totalBudget.toFixed(0)}K Cr</p></div><IndianRupee className="w-8 h-8 text-primary" /></div></CardContent></Card>
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
              <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-900 mb-4">All Projects</h2><p className="text-xl text-gray-600">Showcasing all our construction projects.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{projects.map((project) => (<ProjectCard key={project._id} project={project} footer={true} handleToggleStatus={handleToggleStatus} onEdit={handleEditProject} getStatusBadge={() => { }} />))}</div>
            </TabsContent>

            <TabsContent value="ongoing" className="space-y-6">
              <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-900 mb-4">Ongoing Projects</h2><p className="text-xl text-gray-600">Showcasing our ongoing construction projects.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{currentProjects.map((project: any) => (<ProjectCard key={project._id} project={project} footer={true} handleToggleStatus={handleToggleStatus} onEdit={handleEditProject} getStatusBadge={() => { }} />))}</div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-900 mb-4">Completed Projects</h2><p className="text-xl text-gray-600">Showcasing our successfully completed construction projects.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{completedProjects.map((project: any) => (<ProjectCard key={project._id} project={project} footer={true} handleToggleStatus={handleToggleStatus} onEdit={handleEditProject} getStatusBadge={() => { }} />))}</div>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Projects</h2><p className="text-xl text-gray-600">Showcasing our upcoming construction projects.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{upcomingProjects.map((project: any) => (<ProjectCard key={project._id} project={project} footer={true} handleToggleStatus={handleToggleStatus} onEdit={handleEditProject} getStatusBadge={() => { }} />))}</div>
            </TabsContent>

          </Tabs>
        </div>
      </section>
    </div>
  );
}