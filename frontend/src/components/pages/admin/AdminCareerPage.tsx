// -----------------------------------------------------------------------------
// Admin Careers Page
// -----------------------------------------------------------------------------
import {
    Plus
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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

interface AdminPagesProps {
    onNavigate: (page: string) => void;
    // Optional: provide your API client. If not provided, component uses fetch.
    apiBase?: string; // e.g. "/api/admin"
}
// Small utility
const dateInputValue = (iso?: string | null) => (iso ? iso.slice(0, 16) : "");

export function AdminCareersPage({ onNavigate, apiBase = "/api/admin" }: AdminPagesProps) {
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

    const jobs: AdminJob[] = [
        {
            title: "Site Engineer (Roads)",
            department: "Construction",
            location: "Giridih, Jharkhand",
            type: "Full-time",
            experience: "2-5",
            status: "Open",
            postedOn: new Date().toISOString(),
            highlights: ["AutoCAD", "QS", "QA/QC"],
            description: "Execution oversight for urban road packages; quality and safety compliance.",
        },
    ]

    const openEdit = (job: AdminJob) => {
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
            if (!form.title || !form.location) {
                toast.error("Title and Location are required");
                return;
            }
            const method = editing ? "PUT" : "POST";
            const url = editing && editing._id ? `${apiBase}/jobs/${editing._id}` : `${apiBase}/jobs`;
            const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!r.ok) throw new Error("Save failed");
            const saved = await r.json().catch(() => form);
            if (editing) {
                setJobs((prev) => prev.map((j) => (j._id === editing._id ? { ...j, ...form } : j)));
                toast.success("Job updated");
            } else {
                setJobs((prev) => [{ ...form, _id: saved._id }, ...prev]);
                toast.success("Job created");
            }
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
                    <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
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
                    <AdminOpeningTable openEdit={(j)=>openEdit(j)} />
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
                            <Label>Type</Label>
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
                            <Label>Experience</Label>
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
                            <Label>Status</Label>
                            <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Posted On</Label>
                            <Input type="datetime-local" value={dateInputValue(form.postedOn)} onChange={(e) => setForm({ ...form, postedOn: new Date(e.target.value).toISOString() })} />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Description</Label>
                            <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Highlights (comma separated)</Label>
                            <Input value={form.highlights.join(", ")} onChange={(e) => setForm({ ...form, highlights: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
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