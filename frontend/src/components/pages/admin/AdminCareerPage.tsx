import { useQuery } from "@tanstack/react-query";
import {
    Plus
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../App";
import { AdminApplicationsTable } from "../../admin/AdminCareerApplication";
import { AdminOpeningTable } from "../../admin/AdminCareerOpenings";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Textarea } from "../../ui/textarea";


export type JobStatus = "Open" | "Closed";
export type Sector = "Roads" | "Railways" | "Water" | "Buildings" | "Mining";

export interface Job {
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


interface AdminPagesProps {
    onNavigate: (page: string) => void;
}

// Small utility
const dateInputValue = (iso?: string | null) => (iso ? iso.slice(0, 16) : "");

const fetchJobs = async () => {
    const res = await api.get("/career/all-job");
    return res.data;
}

export function AdminCareersPage({ onNavigate }: AdminPagesProps) {
    const { data = [], isLoading, isError, error } = useQuery<Job[]>({
        queryKey: ['careers'],
        queryFn: fetchJobs,
        staleTime: 1000 * 60 * 2,
        retry: 1,
    });

    const [q, setQ] = useState("");
    const [dept, setDept] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<Job | null>(null);
    const [form, setForm] = useState<Job>({
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

    const jobs = useMemo(() => data ?? [], [data]);

    const openEdit = (job: Job) => {
        setEditing(job);
        setForm({ ...job });
        setIsModalOpen(true);
    };

    const openCreate = () => {
        setEditing(null);
        setForm({
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
        setIsModalOpen(true);
    };

    const saveJob = async () => {
        try {
            if (!form.title || !form.location || !form.description) {
                toast.error("All fields are required");
                return;
            }
            const res = await api.post("/career/create-job", form);
            console.log(res.data);

            setIsModalOpen(false);
        } catch (e: any) {
            toast.error(e.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Admin – Careers</h1>
                        <p className="text-muted-foreground mt-1">Create, update, and publish job openings.</p>
                    </div>
                    <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" /> New Job
                    </Button>
                </div>
            </section>

            <Tabs defaultValue="openings" className="space-y-6 py-3">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="openings">Openings</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                </TabsList>
                <TabsContent value="openings">
                    <AdminOpeningTable jobs={jobs} openEdit={(j) => openEdit(j)} loading={isLoading} />
                </TabsContent>
                <TabsContent value="applications">
                    <AdminApplicationsTable apiBase="/api/admin" />
                </TabsContent>
            </Tabs>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit Job" : "Create Job"}</DialogTitle>
                        <DialogDescription>Fill the details and save to publish/update the opening.</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Label>Title *</Label>
                            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div>
                            <Label>Department *</Label>
                            <Select value={form.department} onValueChange={(v: any) => setForm({ ...form, department: v })}>
                                <SelectTrigger><SelectValue placeholder="Select dept" /></SelectTrigger>
                                <SelectContent>
                                    {(["Construction", "Railways", "Logistics", "Engineering", "Administration", "Safety"] as const).map((d) => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Location *</Label>
                            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                        </div>
                        <div>
                            <Label>Type *</Label>
                            <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Experience *</Label>
                            <Select value={form.experience} onValueChange={(v: any) => setForm({ ...form, experience: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0-2">0–2 years</SelectItem>
                                    <SelectItem value="2-5">2–5 years</SelectItem>
                                    <SelectItem value="5+">5+ years</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Status *</Label>
                            <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Posted On *</Label>
                            <Input type="datetime-local" value={dateInputValue(form.postedOn)} onChange={(e) => setForm({ ...form, postedOn: new Date(e.target.value).toISOString() })} />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Description *</Label>
                            <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Highlights (comma separated)</Label>
                            <Input value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={saveJob} className="cursor-pointer text-white border-none bg-cyan-600 hover:bg-cyan-700">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}