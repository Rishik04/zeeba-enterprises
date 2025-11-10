import {
    FileText,
    Info,
    Loader2,
    Shield,
    Upload
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress"; // If not available, replace with a simple div-based bar
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ResumeDropzone } from "./ResumeDragAndDrop";

// ---- Types ----
export type ApplyFormData = {
  name: string;
  email: string;
  phone: string;
  location?: string;
  experience: "0-2" | "2-5" | "5+";
  expectedCtc?: string;
  notice?: string;
  coverLetter?: string;
  resume?: File | null;
};

export type UploadResumeData = {
  name: string;
  email: string;
  phone?: string;
  skills?: string;
  experience: "0-2" | "2-5" | "5+";
  resume?: File | null;
};

// ---- Helpers ----
const EMAIL_RE = /\S+@\S+\.[A-Za-z]{2,}/;
const PHONE_RE = /^(\+?\d[\d\s-]{7,15})$/;

// ---- Apply Modal ----
export function ApplyModal({
  open,
  onOpenChange,
  jobTitle,
  onSubmit,
  endpoint = "/api/careers/apply",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle?: string;
  onSubmit?: (data: ApplyFormData) => Promise<void> | void;
  endpoint?: string; // POST endpoint (FormData)
}) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState<ApplyFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: "0-2",
    expectedCtc: "",
    notice: "",
    coverLetter: "",
    resume: null,
  });

  const canSubmit = useMemo(() => {
    return (
      data.name.trim().length > 1 &&
      EMAIL_RE.test(data.email) &&
      PHONE_RE.test(data.phone) &&
      !!data.resume
    );
  }, [data]);

  const setField = (k: keyof ApplyFormData, v: any) => setData((d) => ({ ...d, [k]: v }));

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Please complete required fields and attach your resume.");
      return;
    }

    try {
      setLoading(true);
      setProgress(10);

      const fd = new FormData();
      if (jobTitle) fd.append("jobTitle", jobTitle);
      Object.entries(data).forEach(([k, v]) => {
        if (k === "resume") return;
        if (typeof v === "string") fd.append(k, v);
      });
      if (data.resume) fd.append("resume", data.resume);

      // Optional external handler
      if (onSubmit) {
        await Promise.resolve(onSubmit(data));
      }

      // Default network call (can be removed if you handle onSubmit)
      const res = await fetch(endpoint, { method: "POST", body: fd });
      setProgress(70);
      if (!res.ok) throw new Error("Failed to submit application");

      setProgress(100);
      toast.success("Application submitted successfully");
      onOpenChange(false);
      // reset
      setTimeout(() => setProgress(0), 300);
      setData({
        name: "",
        email: "",
        phone: "",
        location: "",
        experience: "0-2",
        expectedCtc: "",
        notice: "",
        coverLetter: "",
        resume: null,
      });
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle || "this role"}</DialogTitle>
          <DialogDescription>
            Fill in your details and attach your resume. Our team will get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input value={data.name} onChange={(e) => setField("name", e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={data.email} onChange={(e) => setField("email", e.target.value)} placeholder="name@example.com" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={data.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="e.g. +91 98765 43210" />
          </div>
          <div>
            <Label>Location (City)</Label>
            <Input value={data.location} onChange={(e) => setField("location", e.target.value)} placeholder="Your current city" />
          </div>
          <div>
            <Label>Experience</Label>
            <Select value={data.experience} onValueChange={(v: any) => setField("experience", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2">0–2 years</SelectItem>
                <SelectItem value="2-5">2–5 years</SelectItem>
                <SelectItem value="5+">5+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Expected CTC (Optional)</Label>
            <Input value={data.expectedCtc || ""} onChange={(e) => setField("expectedCtc", e.target.value)} placeholder="e.g. 5 LPA" />
          </div>
          <div>
            <Label>Notice Period (Optional)</Label>
            <Input value={data.notice || ""} onChange={(e) => setField("notice", e.target.value)} placeholder="e.g. 30 days" />
          </div>
          <div className="md:col-span-2">
            <Label>Cover Letter (Optional)</Label>
            <Textarea value={data.coverLetter || ""} onChange={(e) => setField("coverLetter", e.target.value)} rows={4} placeholder="Tell us briefly about your strengths and relevant experience." />
          </div>
          <div className="md:col-span-2">
            <Label>Resume</Label>
            <ResumeDropzone file={data.resume || null} setFile={(f) => setField("resume", f)} required />
          </div>
        </div>

        {loading && (
          <div className="pt-2">
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!canSubmit || loading}
            onClick={handleSubmit}
            className="cursor-pointer text-white border-none bg-cyan-600 hover:bg-cyan-700"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            <span className="ml-2">Submit Application</span>
          </Button>
        </DialogFooter>

        <div className="flex items-start gap-2 text-xs text-gray-600 mt-2">
          <Shield className="w-4 h-4 shrink-0" />
          <p>Your information is protected and used only for recruitment. By applying, you consent to our privacy policy.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---- Upload Resume (Talent Pool) Modal ----
export function UploadResumeModal({
  open,
  onOpenChange,
  onSubmit,
  endpoint = "/api/careers/talent-pool",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: UploadResumeData) => Promise<void> | void;
  endpoint?: string; // POST endpoint (FormData)
}) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState<UploadResumeData>({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "0-2",
    resume: null,
  });

  const canSubmit = useMemo(() => {
    return (
      data.name.trim().length > 1 &&
      EMAIL_RE.test(data.email) &&
      !!data.resume
    );
  }, [data]);

  const setField = (k: keyof UploadResumeData, v: any) => setData((d) => ({ ...d, [k]: v }));

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Please fill your name, valid email, and attach your resume.");
      return;
    }

    try {
      setLoading(true);
      setProgress(10);

      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === "resume") return;
        if (typeof v === "string") fd.append(k, v);
      });
      if (data.resume) fd.append("resume", data.resume);

      if (onSubmit) await Promise.resolve(onSubmit(data));

      const res = await fetch(endpoint, { method: "POST", body: fd });
      setProgress(70);
      if (!res.ok) throw new Error("Failed to upload resume");

      setProgress(100);
      toast.success("Resume submitted to our talent pool");
      onOpenChange(false);
      // reset
      setTimeout(() => setProgress(0), 300);
      setData({ name: "", email: "", phone: "", skills: "", experience: "0-2", resume: null });
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Your Resume</DialogTitle>
          <DialogDescription>
            Don’t see a perfect role yet? Share your profile and we’ll reach out when there’s a fit.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input value={data.name} onChange={(e) => setField("name", e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={data.email} onChange={(e) => setField("email", e.target.value)} placeholder="name@example.com" />
          </div>
          <div>
            <Label>Phone (Optional)</Label>
            <Input value={data.phone || ""} onChange={(e) => setField("phone", e.target.value)} placeholder="e.g. +91 98765 43210" />
          </div>
          <div>
            <Label>Experience</Label>
            <Select value={data.experience} onValueChange={(v: any) => setField("experience", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2">0–2 years</SelectItem>
                <SelectItem value="2-5">2–5 years</SelectItem>
                <SelectItem value="5+">5+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Key Skills (Optional)</Label>
            <Input value={data.skills || ""} onChange={(e) => setField("skills", e.target.value)} placeholder="e.g. Quantity Surveying, AutoCAD, P6" />
          </div>
          <div className="md:col-span-2">
            <Label>Resume</Label>
            <ResumeDropzone file={data.resume || null} setFile={(f) => setField("resume", f)} required />
          </div>
        </div>

        {loading && (
          <div className="pt-2">
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!canSubmit || loading}
            onClick={handleSubmit}
            className="cursor-pointer text-white border-none bg-cyan-600 hover:bg-cyan-700"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span className="ml-2">Submit Resume</span>
          </Button>
        </DialogFooter>

        <div className="flex items-start gap-2 text-xs text-gray-600 mt-2">
          <Info className="w-4 h-4 shrink-0" />
          <p>We’ll keep your resume for up to 12 months and will contact you when matching roles open.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}