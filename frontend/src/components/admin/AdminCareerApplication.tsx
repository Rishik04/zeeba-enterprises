import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Download, FileText, Mail, Phone, Search, User2 } from "lucide-react";

export type ApplicationStatus = "New" | "In Review" | "Shortlisted" | "Rejected" | "Hired";
export interface JobApplication {
  _id?: string;
  jobTitle: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  experience?: "0-2" | "2-5" | "5+" | string;
  expectedCtc?: string;
  notice?: string;
  coverLetter?: string;
  resumeUrl?: string; // where the uploaded resume is stored
  status: ApplicationStatus;
  appliedOn: string; // ISO
}

export function AdminApplicationsTable({ apiBase = "/api/admin" }: { apiBase?: string }) {
  // const [apps, setApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [job, setJob] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [active, setActive] = useState<JobApplication | null>(null);

  const apps: JobApplication[] = [
    {
      jobTitle: "Site Engineer (Roads)",
      name: "Aman Verma",
      email: "aman@example.com",
      phone: "+91 98765 43210",
      location: "Ranchi",
      experience: "2-5",
      expectedCtc: "5.5 LPA",
      notice: "30 days",
      coverLetter: "I have handled WMM, DBM and PQC packages on NH projects...",
      resumeUrl: "/files/sample-resume.pdf",
      status: "New",
      appliedOn: new Date().toISOString(),
    },
    {
      jobTitle: "Site Engineer (Roads)",
      name: "Aman Verma",
      email: "aman@example.com",
      phone: "+91 98765 43210",
      location: "Ranchi",
      experience: "2-5",
      expectedCtc: "5.5 LPA",
      notice: "30 days",
      coverLetter: "I have handled WMM, DBM and PQC packages on NH projects...",
      resumeUrl: "/files/sample-resume.pdf",
      status: "New",
      appliedOn: new Date().toISOString(),
    },
  ]

  const jobOptions = useMemo(() => {
    const set = new Set(apps.map((a) => a.jobTitle).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [apps]);

  const filtered = useMemo(() => {
    let list = [...apps];
    if (q.trim()) {
      const qq = q.toLowerCase();
      list = list.filter((a) =>
        [a.name, a.email, a.phone, a.jobTitle, a.location, a.coverLetter].join(" ").toLowerCase().includes(qq)
      );
    }
    if (job !== "all") list = list.filter((a) => a.jobTitle === job);
    if (status !== "all") list = list.filter((a) => a.status === status);
    return list;
  }, [apps, q, job, status]);

  const updateStatus = async (a: JobApplication, s: ApplicationStatus) => {
    try {
      if (a._id) {
        const r = await fetch(`${apiBase}/applications/${a._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: s }),
        });
        if (!r.ok) throw new Error("Update failed");
      }
      setApps((prev) => prev.map((x) => (x === a || x._id === a._id ? { ...x, status: s } : x)));
      toast.success(`Status set to ${s}`);
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications ({filtered.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input className="pl-10" placeholder="Search name, email, phone" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="md:col-span-4">
            <Select value={job} onValueChange={setJob}>
              <SelectTrigger><SelectValue placeholder="Filter by Job" /></SelectTrigger>
              <SelectContent>
                {jobOptions.map((j) => (
                  <SelectItem key={j} value={j}>{j === "all" ? "All Jobs" : j}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                {(["all", "New", "In Review", "Shortlisted", "Rejected", "Hired"] as const).map((s) => (
                  <SelectItem key={s} value={s}>{s === "all" ? "All Status" : s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2 pr-4">Applicant</th>
                <th className="py-2 pr-4">Job</th>
                <th className="py-2 pr-4">Experience</th>
                <th className="py-2 pr-4">Applied On</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={(a._id || i) + a.email} className="border-t">
                  <td className="py-3 pr-4">
                    <div className="font-medium flex items-center gap-2"><User2 className="w-4 h-4" /> {a.name}</div>
                    <div className="text-gray-500 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" /> {a.email}</span>
                      {a.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> {a.phone}</span>}
                    </div>
                  </td>
                  <td className="py-3 pr-4">{a.jobTitle}</td>
                  <td className="py-3 pr-4">{a.experience || "—"}</td>
                  <td className="py-3 pr-4">{new Date(a.appliedOn).toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    {a.status === "New" && <Badge className="bg-cyan-50 text-cyan-700 border-cyan-200">New</Badge>}
                    {a.status === "In Review" && <Badge variant="outline">In Review</Badge>}
                    {a.status === "Shortlisted" && <Badge className="bg-green-50 text-green-700 border-green-200">Shortlisted</Badge>}
                    {a.status === "Rejected" && <Badge variant="secondary">Rejected</Badge>}
                    {a.status === "Hired" && <Badge className="bg-blue-50 text-blue-700 border-blue-200">Hired</Badge>}
                  </td>
                  <td className="py-3 pr-0">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setActive(a)}>View</Button>
                      {a.resumeUrl && (
                        <a href={a.resumeUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline"><Download className="w-4 h-4" /></Button>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">No applications found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Details Modal */}
        <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
          <DialogContent className="max-w-xl">
            {active && (
              <>
                <DialogHeader>
                  <DialogTitle>{active.name}</DialogTitle>
                  <DialogDescription>
                    Applied for <span className="font-medium">{active.jobTitle}</span> on {new Date(active.appliedOn).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input value={active.email} readOnly />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={active.phone || "—"} readOnly />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={active.location || "—"} readOnly />
                  </div>
                  <div>
                    <Label>Experience</Label>
                    <Input value={active.experience || "—"} readOnly />
                  </div>
                  <div>
                    <Label>Expected CTC</Label>
                    <Input value={active.expectedCtc || "—"} readOnly />
                  </div>
                  <div>
                    <Label>Notice Period</Label>
                    <Input value={active.notice || "—"} readOnly />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Cover Letter</Label>
                    <Textarea value={active.coverLetter || "—"} readOnly rows={5} />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2">
                    {(["New", "In Review", "Shortlisted", "Rejected", "Hired"] as const).map((s) => (
                      <Button key={s} size="sm" variant="outline" onClick={() => updateStatus(active, s)}>{s}</Button>
                    ))}
                  </div>
                  {active.resumeUrl && (
                    <a href={active.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> Resume</Button>
                    </a>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
