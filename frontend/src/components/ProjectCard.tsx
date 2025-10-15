import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Edit, MapPin, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from "./ui/label";
import { Button } from "./ui/button";

const API_URL = import.meta.env.VITE_API_PUBLIC_URL;

interface ProjectCardProps {
    project: any,
    status: string | "",
    footer: boolean | false,
    handleToggleStatus: (id: string, status: string) => void;
    getStatusBadge: (status: string) => void;
}


const ProjectCard = ({ project, status, footer, handleToggleStatus, getStatusBadge }: ProjectCardProps) => {
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Commercial': return 'bg-blue-100 text-blue-800';
            case 'Residential': return 'bg-green-100 text-green-800';
            case 'Infrastructure': return 'bg-purple-100 text-purple-8 00';
            case 'Public': return 'bg-orange-100 text-orange-800';
            case 'Railway': return 'bg-red-100 text-red-800';
            case 'Mining': return 'bg-yellow-100 text-yellow-800';
            case 'Civil': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <div className="relative">
                <Carousel className="w-full">
                    <CarouselContent>
                        {project.image.length > 0 ? project.image.map((img: string, idx: number) => (
                            <CarouselItem key={idx}>
                                <div className="w-full h-54">
                                    <ImageWithFallback
                                        src={`${API_URL}/${img.replaceAll("\\", "/")}`}
                                        alt={`${project.title} ${idx + 1}`}
                                        className="w-full h-full object-cover rounded-t-xl"
                                    />
                                </div>
                            </CarouselItem>
                        )) : <CarouselItem >
                            <div className="w-full h-54">
                                <ImageWithFallback
                                    src='#'
                                    className="w-full h-full object-cover rounded-t-xl"
                                />
                            </div>
                        </CarouselItem>}
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
                {status === "ongoing" ? <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-sm">
                    In Progress
                </div> : ""}

            </div>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            {project.location}
                        </div>
                    </div>
                    {footer ? <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => console.log("edit")} className="hover:bg-cyan-600 cursor-pointer">
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            //   onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 hover:bg-cyan-600 cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div> : ""}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 mb-4 h-16">{project.description}</p>

                <div className="space-y-2 mb-4">
                    {status === "ongoing" ? <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>70%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-cyan-600 h-2 rounded-full"
                                style={{ width: `70%` }}
                            ></div>
                        </div>
                    </div> : ""}

                </div>
                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Key Features</h4>
                    <div className="flex flex-wrap gap-1">
                        {project.features.map((feature: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {feature.replace(/^['"]|['"]$/g, '')}
                            </Badge>
                        ))}
                    </div>
                </div>

                {project.awards && (
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

                {footer ?
                    <div className="space-y-2">
                        <Label className="text-sm">Quick Status Change</Label>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant={project.status === 'upcoming' ? 'default' : 'outline'}
                                onClick={() => handleToggleStatus(project._id, 'upcoming')}
                                className="flex-1 hover:bg-cyan-600 cursor-pointer"
                            >
                                Upcoming
                            </Button>
                            <Button
                                size="sm"
                                variant={project.status === 'ongoing' ? 'default' : 'outline'}
                                onClick={() => handleToggleStatus(project._id, 'ongoing')}
                                className="flex-1 hover:bg-cyan-600 cursor-pointer"
                            >
                                Ongoing
                            </Button>
                            <Button
                                size="sm"
                                variant={project.status === 'completed' ? 'default' : 'outline'}
                                onClick={() => handleToggleStatus(project._id, 'completed')}
                                className="flex-1 hover:bg-cyan-600 cursor-pointer"
                            >
                                Complete
                            </Button>
                        </div>
                    </div>
                    : ""
                }
            </CardContent>

        </Card>
    );
}

export default ProjectCard;