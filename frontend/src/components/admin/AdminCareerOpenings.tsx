import {
    Building2,
    Edit,
    MapPin,
    Search,
    Trash2
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


export type JobStatus = "Open" | "Closed";
export interface AdminJob {
    _id?: string;
    title: string;
    department: "Construction" | "Railways" | "Logistics" | "Engineering" | "Administration" | "Safety";
    location: string;
    type: "Full-time" | "Contract" | "Internship";
    experience: "0-2" | "2-5" | "5+";
    status: JobStatus;
    postedOn: string; // ISO
    highlights: string[];
    description: string;
}

export type Sector = "Roads" | "Railways" | "Water" | "Buildings" | "Mining";

export function AdminOpeningTable({ apiBase = "/api/admin", openEdit, jobs }: { apiBase?: string, openEdit: any, jobs:AdminJob }) {
    // const [jobs, setJobs] = useState<AdminJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");
    const [dept, setDept] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<AdminJob | null>(null);
    const [form, setForm] = useState<AdminJob>({
        title: "",
        department: "Construction",
        location: "",
        type: "Full-time",
        experience: "0-2",
        status: "Open",
        postedOn: new Date().toISOString(),
        highlights: [],
        description: "",
    });

    // const jobs: AdminJob[] = [
    //     {
    //         title: "Site Engineer (Roads)",
    //         department: "Construction",
    //         location: "Giridih, Jharkhand",
    //         type: "Full-time",
    //         experience: "2-5",
    //         status: "Open",
    //         postedOn: new Date().toISOString(),
    //         highlights: ["AutoCAD", "QS", "QA/QC"],
    //         description: "Execution oversight for urban road packages; quality and safety compliance.",
    //     },
    // ]
    
    const filtered = useMemo(() => {
        let list = [...jobs];
        if (q.trim()) {
            const qq = q.toLowerCase();
            list = list.filter((j) =>
                [j.title, j.department, j.location, j.type, j.description, ...j.highlights].join(" ").toLowerCase().includes(qq)
            );
        }
        if (dept !== "all") list = list.filter((j) => j.department === dept);
        if (status !== "all") list = list.filter((j) => j.status === status);
        return list;
    }, [jobs, q, dept, status]);

    const removeJob = async (job: AdminJob) => {
        try {
            if (job._id) {
                const r = await fetch(`${apiBase}/jobs/${job._id}`, { method: "DELETE" });
                if (!r.ok) throw new Error("Delete failed");
            }
            setJobs((prev) => prev.filter((j) => j !== job));
            toast.success("Job removed");
        } catch (e: any) {
            toast.error(e.message || "Something went wrong");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Openings ({filtered.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-6 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <Input className="pl-10" placeholder="Search title, dept, skills" value={q} onChange={(e) => setQ(e.target.value)} />
                        </div>
                        <div className="md:col-span-3">
                            <Select value={dept} onValueChange={setDept}>
                                <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    <SelectItem value="Construction">Construction</SelectItem>
                                    <SelectItem value="Railways">Railways</SelectItem>
                                    <SelectItem value="Logistics">Logistics</SelectItem>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Administration">Administration</SelectItem>
                                    <SelectItem value="Safety">Safety</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-3">
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                {/* Jobs Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-gray-500">
                            <tr>
                                <th className="py-2 pr-4">Title</th>
                                <th className="py-2 pr-4">Department</th>
                                <th className="py-2 pr-4">Location</th>
                                <th className="py-2 pr-4">Type</th>
                                <th className="py-2 pr-4">Experience</th>
                                <th className="py-2 pr-4">Status</th>
                                <th className="py-2 pr-4">Posted</th>
                                <th className="py-2 pr-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((j, i) => (
                                <tr key={(j._id || i) + j.title} className="border-t">
                                    <td className="py-3 pr-4">
                                        <div className="font-medium">{j.title}</div>
                                        <div className="text-gray-500 line-clamp-1">{j.description}</div>
                                    </td>
                                    <td className="py-3 pr-4"><Badge variant="outline"><Building2 className="w-4 h-4 mr-1" /> {j.department}</Badge></td>
                                    <td className="py-3 pr-4"><Badge variant="outline"><MapPin className="w-4 h-4 mr-1" /> {j.location}</Badge></td>
                                    <td className="py-3 pr-4">{j.type}</td>
                                    <td className="py-3 pr-4">{j.experience}</td>
                                    <td className="py-3 pr-4">{j.status === "Open" ? <Badge className="bg-green-50 text-green-700 border-green-200">Open</Badge> : <Badge variant="secondary">Closed</Badge>}</td>
                                    <td className="py-3 pr-4">{new Date(j.postedOn).toLocaleDateString()}</td>
                                    <td className="py-3 pr-0">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="outline" onClick={() => openEdit(j)}><Edit className="w-4 h-4" /></Button>
                                            <Button size="sm" variant="outline" onClick={() => removeJob(j)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center py-10 text-gray-500">No jobs found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
