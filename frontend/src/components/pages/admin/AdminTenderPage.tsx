import {
  ClipboardList,
  Download,
  Edit,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Progress } from "../../ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TenderStatus = "Live" | "Closed" | "Awarded";
export type ProcurementType = "Open" | "Limited" | "EOI" | "RFP";
export type Sector = "Roads" | "Railways" | "Water" | "Buildings" | "Mining";
export interface AdminTender {
  _id?: string;
  title: string;
  refNo: string;
  department: string;
  sector: Sector;
  procurement: ProcurementType;
  location: string;
  estValueINR?: string;
  publishDate: string; // ISO
  startDate: string; // ISO
  prebidDate?: string; // ISO
  submitBy: string; // ISO
  openOn: string; // ISO
  status: TenderStatus;
  documents?: { name: string; url?: string }[];
  summary: string;
}

interface AdminPagesProps {
  onNavigate: (page: string) => void;
  // Optional: provide your API client. If not provided, component uses fetch.
  apiBase?: string; // e.g. "/api/admin"
}

// Small utility
const dateInputValue = (iso?: string | null) => (iso ? iso.slice(0, 16) : "");



// -----------------------------------------------------------------------------
// Admin Tenders Page
// -----------------------------------------------------------------------------
export function AdminTendersPage({ onNavigate, apiBase = "/api/admin" }: AdminPagesProps) {
  const [tenders, setTenders] = useState<AdminTender[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTender | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [form, setForm] = useState<AdminTender>({
    title: "",
    refNo: "",
    department: "Zeba Enterprises – Procurement",
    sector: "Roads",
    procurement: "Open",
    location: "",
    estValueINR: "",
    publishDate: new Date().toISOString(),
    startDate: new Date().toISOString(),
    prebidDate: "",
    submitBy: new Date(Date.now() + 7*24*3600*1000).toISOString(),
    openOn: new Date(Date.now() + 8*24*3600*1000).toISOString(),
    status: "Live",
    documents: [],
    summary: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const r = await fetch(`${apiBase}/tenders`);
        if (r.ok) {
          const data = await r.json();
          setTenders(Array.isArray(data) ? data : []);
        } else {
          setTenders([]);
        }
      } catch (e) {
        setTenders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [apiBase]);

  const filtered = useMemo(() => {
    let list = [...tenders];
    if (q.trim()) {
      const qq = q.toLowerCase();
      list = list.filter((t) => [t.title, t.refNo, t.department, t.location, t.summary].join(" ").toLowerCase().includes(qq));
    }
    if (sector !== "all") list = list.filter((t) => t.sector === sector);
    if (status !== "all") list = list.filter((t) => t.status === status);
    return list;
  }, [tenders, q, sector, status]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      refNo: "",
      department: "Zeba Enterprises – Procurement",
      sector: "Roads",
      procurement: "Open",
      location: "",
      estValueINR: "",
      publishDate: new Date().toISOString(),
      startDate: new Date().toISOString(),
      prebidDate: "",
      submitBy: new Date(Date.now() + 7*24*3600*1000).toISOString(),
      openOn: new Date(Date.now() + 8*24*3600*1000).toISOString(),
      status: "Live",
      documents: [],
      summary: "",
    });
    setFiles([]);
    setIsModalOpen(true);
  };

  const openEdit = (t: AdminTender) => {
    setEditing(t);
    setForm({ ...t });
    setFiles([]);
    setIsModalOpen(true);
  };

  const saveTender = async () => {
    try {
      if (!form.title || !form.refNo || !form.submitBy) {
        toast.error("Title, Ref No, and Deadline are required");
        return;
      }

      // Upload files first (if any)
      let documents = form.documents || [];
      if (files.length) {
        setUploading(true);
        setProgress(20);
        const fd = new FormData();
        files.forEach((f) => fd.append("files", f));
        const up = await fetch(`${apiBase}/tenders/upload`, { method: "POST", body: fd });
        setProgress(70);
        if (!up.ok) throw new Error("Upload failed");
        const uploaded = await up.json();
        // Expecting: [{name, url}]
        if (Array.isArray(uploaded)) documents = [...documents, ...uploaded];
        setProgress(100);
        setTimeout(() => setProgress(0), 400);
      }

      const body = { ...form, documents } as AdminTender;
      const method = editing ? "PUT" : "POST";
      const url = editing && editing._id ? `${apiBase}/tenders/${editing._id}` : `${apiBase}/tenders`;
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error("Save failed");

      if (editing) {
        setTenders((prev) => prev.map((t) => (t._id === editing._id ? { ...t, ...body } : t)));
        toast.success("Tender updated");
      } else {
        const saved = await r.json().catch(() => body);
        setTenders((prev) => [{ ...body, _id: saved._id }, ...prev]);
        toast.success("Tender created");
      }
      setIsModalOpen(false);
      setFiles([]);
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const removeTender = async (t: AdminTender) => {
    try {
      if (t._id) {
        const r = await fetch(`${apiBase}/tenders/${t._id}`, { method: "DELETE" });
        if (!r.ok) throw new Error("Delete failed");
      }
      setTenders((prev) => prev.filter((x) => x !== t));
      toast.success("Tender removed");
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
            <h1 className="text-3xl font-bold">Admin – Tenders</h1>
            <p className="text-muted-foreground mt-1">Create, update, and publish tenders.</p>
          </div>
          <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> New Tender
          </Button>
        </div>
      </section>

      {/* Controls */}
      <section className="py-6 bg-white/60 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input className="pl-10" placeholder="Search title, ref no., dept" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger><SelectValue placeholder="Sector" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="Roads">Roads</SelectItem>
                  <SelectItem value="Railways">Railways</SelectItem>
                  <SelectItem value="Water">Water</SelectItem>
                  <SelectItem value="Buildings">Buildings</SelectItem>
                  <SelectItem value="Mining">Mining</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Live">Live</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Awarded">Awarded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Tenders Table */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Tenders ({filtered.length})</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="py-2 pr-4">Title</th>
                    <th className="py-2 pr-4">Ref No</th>
                    <th className="py-2 pr-4">Sector</th>
                    <th className="py-2 pr-4">Location</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Deadline</th>
                    <th className="py-2 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, i) => (
                    <tr key={(t._id || i) + t.refNo} className="border-top">
                      <td className="py-3 pr-4">
                        <div className="font-medium">{t.title}</div>
                        <div className="text-gray-500 line-clamp-1">{t.summary}</div>
                      </td>
                      <td className="py-3 pr-4"><Badge variant="outline"><ClipboardList className="w-4 h-4 mr-1" /> {t.refNo}</Badge></td>
                      <td className="py-3 pr-4">{t.sector}</td>
                      <td className="py-3 pr-4">{t.location}</td>
                      <td className="py-3 pr-4">
                        {t.status === "Live" ? (
                          <Badge className="bg-cyan-50 text-cyan-700 border-cyan-200">Live</Badge>
                        ) : t.status === "Closed" ? (
                          <Badge variant="secondary">Closed</Badge>
                        ) : (
                          <Badge className="bg-green-50 text-green-700 border-green-200">Awarded</Badge>
                        )}
                      </td>
                      <td className="py-3 pr-4">{new Date(t.submitBy).toLocaleString()}</td>
                      <td className="py-3 pr-0">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(t)}><Edit className="w-4 h-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => removeTender(t)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500">No tenders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Tender" : "Create Tender"}</DialogTitle>
            <DialogDescription>Fill the details, attach documents, and publish.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Ref No *</Label>
              <Input value={form.refNo} onChange={(e) => setForm({ ...form, refNo: e.target.value })} />
            </div>
            <div>
              <Label>Department</Label>
              <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div>
              <Label>Sector</Label>
              <Select value={form.sector} onValueChange={(v: any) => setForm({ ...form, sector: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Roads","Railways","Water","Buildings","Mining"] as const).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Procurement Type</Label>
              <Select value={form.procurement} onValueChange={(v: any) => setForm({ ...form, procurement: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Open","Limited","EOI","RFP"] as const).map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <Label>Estimated Value (₹)</Label>
              <Input value={form.estValueINR || ""} onChange={(e) => setForm({ ...form, estValueINR: e.target.value })} placeholder="e.g. 18.5 Cr" />
            </div>
            <div>
              <Label>Publish Date</Label>
              <Input type="datetime-local" value={dateInputValue(form.publishDate)} onChange={(e) => setForm({ ...form, publishDate: new Date(e.target.value).toISOString() })} />
            </div>
            <div>
              <Label>Start of Documents</Label>
              <Input type="datetime-local" value={dateInputValue(form.startDate)} onChange={(e) => setForm({ ...form, startDate: new Date(e.target.value).toISOString() })} />
            </div>
            <div>
              <Label>Pre-bid Meeting</Label>
              <Input type="datetime-local" value={dateInputValue(form.prebidDate)} onChange={(e) => setForm({ ...form, prebidDate: new Date(e.target.value).toISOString() })} />
            </div>
            <div>
              <Label>Submission Deadline *</Label>
              <Input type="datetime-local" value={dateInputValue(form.submitBy)} onChange={(e) => setForm({ ...form, submitBy: new Date(e.target.value).toISOString() })} />
            </div>
            <div>
              <Label>Bid Opening</Label>
              <Input type="datetime-local" value={dateInputValue(form.openOn)} onChange={(e) => setForm({ ...form, openOn: new Date(e.target.value).toISOString() })} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Live">Live</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Awarded">Awarded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Summary</Label>
              <Textarea rows={4} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Attach Documents (PDF, XLSX, ZIP)</Label>
              <Input type="file" multiple onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])} />
              {uploading && <Progress value={progress} className="mt-2 h-2" />}
              {!!form.documents?.length && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.documents.map((d, i) => (
                    <Badge key={i} variant="outline"><Download className="w-4 h-4 mr-1" /> {d.name}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={saveTender} className="cursor-pointer text-white border-none bg-cyan-600 hover:bg-cyan-700">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
