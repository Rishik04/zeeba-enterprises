import { motion } from "framer-motion";
import {
    Building2,
    CalendarCheck,
    CheckCircle,
    ChevronDown,
    Clock,
    Construction,
    FileText,
    GraduationCap,
    MapPin,
    Search,
    Shield,
    Star,
    ThumbsUp,
    Users,
    Wrench
} from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Reuse existing assets from your project (swap if needed)
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { api } from "../../App.tsx";
import noData from "../../assets/no-data.png";
import onsite from "../../assets/road4.jpeg";
import banner from "../../assets/site1.jpeg";
import { ApplyModal, UploadResumeModal } from "../ApplyForm.tsx";

interface CareersPageProps {
    onNavigate: (page: string) => void;
}

interface Job {
    id: string;
    title: string;
    department: "Construction" | "Railways" | "Logistics" | "Engineering" | "Administration" | "Safety";
    location: string;
    type: "Full-time" | "Contract" | "Internship";
    experience: "0-2" | "2-5" | "5+";
    postedOn: string; // ISO date
    highlights: string[];
    description: string;
    status: "Open" | "Close";
    icon?: React.ComponentType<any>;
}

const fetchJobs = async () => {
    const res = await api.get("/career/all-job");
    const list = res.data.filter((j) => j.status === "Open");
    return list;
}

function safeIcon(icon?: Job["icon"]) {
    if (!icon) return Building2; // fallback icon
    if (typeof icon === "string") {
        const map: Record<string, any> = {
            construction: Construction
        };
        return map[icon] ?? Building2;
    }
    return icon as React.ComponentType<any>;
}

export function CareersPage({ onNavigate }: CareersPageProps) {
    const { data = [], isLoading, isError, error } = useQuery<Job[]>({
        queryKey: ['careers'],
        queryFn: fetchJobs,
        staleTime: 1000 * 60 * 2,
        retry: 1,
    });
    // Filters & search state
    const [q, setQ] = useState("");
    const [department, setDepartment] = useState<string>("all");
    const [location, setLocation] = useState<string>("all");
    const [type, setType] = useState<string>("all");
    const [experience, setExperience] = useState<string>("all");
    const [sort, setSort] = useState<string>("recent");
    const [applyOpen, setApplyOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | {}>({});
    const [uploadOpen, setUploadOpen] = useState(false);

    const jobsMemo = useMemo(() => data ?? [], [data]);

    const filtered = useMemo(() => {
        let list = [...jobsMemo];
        if (q.trim()) {
            const qq = q.toLowerCase();
            list = list.filter((j) =>
                [
                    j.title,
                    j.department,
                    j.location,
                    j.description,
                    ...j.highlights,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(qq)
            );
        }

        // facet filters
        if (department !== "all") list = list.filter((j) => j.department === department);
        if (location !== "all") list = list.filter((j) => j.location === location);
        if (type !== "all") list = list.filter((j) => j.type === type);
        if (experience !== "all") list = list.filter((j) => j.experience === experience);

        // sort
        if (sort === "recent") {
            list.sort((a, b) => +new Date(b.postedOn) - +new Date(a.postedOn));
        } else if (sort === "title") {
            list.sort((a, b) => a.title.localeCompare(b.title));
        }

        return list;
    }, [q, department, location, type, experience, sort, jobsMemo]);

    const clearFilters = () => {
        setQ("");
        setDepartment("all");
        setLocation("all");
        setType("all");
        setExperience("all");
        setSort("recent");
    };

    const skeleton = (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="animate-pulse bg-white rounded-lg p-6 shadow h-64" />)}
        </div>
    );

    return (
        <>
            <Helmet>
                <title>Careers | Zeba Enterprises – Jobs in Engineering, Contracting & Project Management</title>
                <meta name="description" content="Explore career opportunities at Zeba Enterprises across engineering, project management, logistics, contracting, consulting, and infrastructure development roles." />
                <link rel="canonical" href="https://www.zebaenterprises.com/career" />
                <meta property="og:title" content="Careers at Zeba Enterprises" />
                <meta property="og:description" content="Join our team and build a future in engineering, contracting, logistics, and infrastructure development." />
                <meta property="og:url" content="https://www.zebaenterprises.com/career" />
                <meta property="og:image" content="https://www.zebaenterprises.com/og-image.jpg" />
            </Helmet>

            <div className="min-h-screen">
                {/* Hero */}
                <section className="relative py-20 bg-gradient-to-r from-gray-900 to-gray-700">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-20"
                        style={{ backgroundImage: `url(${banner})` }}
                    />
                    <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                        <Badge className="mb-4 bg-white/20 text-white border-white/40">Careers</Badge>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Build India <span className="text-cyan-500">With Us</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Join Zeba Enterprises and shape infrastructure that empowers communities. We invest in
                            safety, learning, and growth—on and off the site.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                            <Card className="bg-white/10 border-white/20 backdrop-blur">
                                <CardContent className="p-6 text-white">
                                    <div className="flex items-center gap-3 text-cyan-500">
                                        <Users />
                                        <p className="text-lg text-cyan-500">Open roles</p>
                                    </div>
                                    <p className="text-4xl font-bold mt-2">{jobsMemo.length}</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/10 border-white/20 backdrop-blur">
                                <CardContent className="p-6 text-white">
                                    <div className="flex items-center gap-3 text-cyan-500">
                                        <MapPin />
                                        <p className="text-lg text-cyan-500">Locations</p>
                                    </div>
                                    <p className="text-4xl font-bold mt-2">Jharkhand</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/10 border-white/20 backdrop-blur">
                                <CardContent className="p-6 text-white">
                                    <div className="flex items-center gap-3 text-cyan-500">
                                        <Star />
                                        <p className="text-lg text-cyan-500">Culture</p>
                                    </div>
                                    <p className="mt-2">Safety-first • Growth mindset • Ownership</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Search & Filters */}
                <section className="py-10 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="rounded-2xl border p-4 md:p-6 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                <div className="md:col-span-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <Input
                                            value={q}
                                            onChange={(e) => setQ(e.target.value)}
                                            placeholder="Search roles, skills or keywords"
                                            className="pl-10 h-11"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <Select value={department} onValueChange={setDepartment}>
                                        <SelectTrigger className="h-11"><SelectValue placeholder="Department" /></SelectTrigger>
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
                                <div className="md:col-span-2">
                                    <Select value={location} onValueChange={setLocation}>
                                        <SelectTrigger className="h-11"><SelectValue placeholder="Location" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Locations</SelectItem>
                                            <SelectItem value="Giridih, Jharkhand">Giridih</SelectItem>
                                            <SelectItem value="Dhanbad, Jharkhand">Dhanbad</SelectItem>
                                            <SelectItem value="Ranchi, Jharkhand">Ranchi</SelectItem>
                                            <SelectItem value="Bokaro, Jharkhand">Bokaro</SelectItem>
                                            <SelectItem value="Hazaribagh, Jharkhand">Hazaribagh</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-2">
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger className="h-11"><SelectValue placeholder="Type" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="Full-time">Full-time</SelectItem>
                                            <SelectItem value="Contract">Contract</SelectItem>
                                            <SelectItem value="Internship">Internship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-2">
                                    <Select value={experience} onValueChange={setExperience}>
                                        <SelectTrigger className="h-11"><SelectValue placeholder="Experience" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Experience</SelectItem>
                                            <SelectItem value="0-2">0–2 years</SelectItem>
                                            <SelectItem value="2-5">2–5 years</SelectItem>
                                            <SelectItem value="5+">5+ years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-2">
                                    <Select value={sort} onValueChange={setSort}>
                                        <SelectTrigger className="h-11"><SelectValue placeholder="Sort" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="recent">Most Recent</SelectItem>
                                            <SelectItem value="title">Title A–Z</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-12 flex gap-3 justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        {department !== "all" && <Badge variant="secondary">{department}</Badge>}
                                        {location !== "all" && <Badge variant="secondary">{location}</Badge>}
                                        {type !== "all" && <Badge variant="secondary">{type}</Badge>}
                                        {experience !== "all" && <Badge variant="secondary">{experience} yrs</Badge>}
                                    </div>
                                    <Button variant="outline" className="bg-cyan-600 text-white hover:bg-primary cursor-pointer" onClick={clearFilters}>Clear filters</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Jobs list */}

                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Open Positions</h2>
                            <p className="text-gray-600">Showing {filtered.length} of {jobsMemo.length} roles</p>
                        </div>

                        {isLoading ? (
                            skeleton
                        ) : isError ? (
                            <div className="text-center text-red-600">Error: {error?.message}</div>
                        ) : (
                            <Suspense fallback={skeleton}>

                                {filtered.length == 0 ?
                                    <div className="flex flex-col items-center justify-center w-full py-10">
                                        <h1 className="text-xl font-semibold text-gray-700">No Jobs Found</h1>
                                        <img
                                            src={noData}
                                            alt="Not found"
                                            className="w-80 h-80 object-cover"
                                        />
                                    </div> :

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {
                                            filtered.map((job, idx) => {
                                                const Icon = safeIcon(job.icon);
                                                return (
                                                    <motion.div
                                                        key={job.id}
                                                        initial={{ opacity: 0, y: 12 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                    >
                                                        <Card className="hover:shadow-lg transition group">
                                                            <CardHeader className="pb-2">
                                                                <div className="flex items-start justify-between gap-4">
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                                                                            <Icon className="text-white w-6 h-6" />
                                                                        </div>
                                                                        <div>
                                                                            <CardTitle className="text-xl">{job.title}</CardTitle>
                                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                                <Badge variant="outline" className="gap-1"><Building2 className="w-4 h-4" /> {job.department}</Badge>
                                                                                <Badge variant="outline" className="gap-1"><MapPin className="w-4 h-4" /> {job.location}</Badge>
                                                                                <Badge variant="outline" className="gap-1"><Clock className="w-4 h-4" /> {job.type}</Badge>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-sm text-gray-500">Posted on {new Date(job.postedOn).toLocaleDateString()}</span>
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent className="space-y-5 pt-0">
                                                                <p className="text-gray-600">{job.description}</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {job.highlights.map((h) => (
                                                                        <Badge key={h} className="bg-cyan-50 text-cyan-700 border-cyan-200">{h}</Badge>
                                                                    ))}
                                                                </div>
                                                                <div className="flex justify-between items-center pt-2">
                                                                    <Button onClick={() => { setSelectedJob(job); setApplyOpen(true); }}>Apply Now</Button>
                                                                    <ApplyModal open={applyOpen} onOpenChange={setApplyOpen} jobId={selectedJob._id} jobTitle={selectedJob.title} />
                                                                    <Button variant="outline" className="cursor-pointer" onClick={() => onNavigate("contact")}>Refer a Candidate</Button>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                );
                                            })}
                                    </div>
                                }
                            </Suspense>
                        )}

                        {/* Don’t see a fit */}
                        <Card className="mt-8 border-dashed">
                            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-semibold">Don’t see a perfect match?</h3>
                                    <p className="text-gray-600 mt-1">Share your profile—our team will reach out when a suitable role opens up.</p>
                                </div>
                                <Button variant="outline" className="bg-cyan-600 text-white hover:bg-primary cursor-pointer" onClick={() => setUploadOpen(true)}>Submit Resume</Button>
                                <UploadResumeModal open={uploadOpen} onOpenChange={setUploadOpen} />
                            </CardContent>
                        </Card>
                    </div>
                </section >

                {/* Life at Zeba */}
                < section className="py-20 bg-white" >
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-14">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Life at Zeba Enterprises</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                We build safely, learn continuously, and celebrate progress. Here’s what you can expect when you join us.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="hover:shadow-md transition">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
                                        <Shield className="text-white" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Safety-First Culture</h3>
                                    <p className="text-gray-600">Daily toolbox talks, PPE for all, and zero-compromise standards across sites.</p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-md transition">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
                                        <GraduationCap className="text-white" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Growth & Learning</h3>
                                    <p className="text-gray-600">On-the-job mentorship, certifications, and clear career paths from site to leadership.</p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-md transition">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
                                        <ThumbsUp className="text-white" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Reliable Benefits</h3>
                                    <p className="text-gray-600">Health cover, field allowances, and travel support for deployments.</p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-md transition">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
                                        <CalendarCheck className="text-white" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Predictable Schedules</h3>
                                    <p className="text-gray-600">Realistic timelines and well-planned shifts that respect your time.</p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-md transition">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
                                        <Wrench className="text-white" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Modern Equipment</h3>
                                    <p className="text-gray-600">Work with well-maintained machines and digital tools that boost productivity.</p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-md transition">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
                                        <MapPin className="text-white" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Diverse Sites</h3>
                                    <p className="text-gray-600">From roads to rail to pump systems—gain experience across domains.</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Culture visual */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 items-center">
                            <ImageWithFallback src={onsite} alt="Onsite" className="w-full h-80 object-cover rounded-xl shadow" />
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-cyan-600" />
                                    <p className="text-gray-700">Transparent appraisals and performance feedback.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-cyan-600" />
                                    <p className="text-gray-700">Equal opportunity employer with inclusive policies.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-cyan-600" />
                                    <p className="text-gray-700">Recognition programs for safety and innovation.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-cyan-600" />
                                    <p className="text-gray-700">Regular skilling sessions with certified trainers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >

                {/* Hiring Process */}
                < section className="py-20 bg-gray-50" >
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-14">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Hiring Process</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Clear steps, quick decisions, and respectful communication throughout.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[{
                                num: "01",
                                title: "Apply",
                                desc: "Send your CV or profile.",
                                Icon: FileText,
                            }, {
                                num: "02",
                                title: "Screening",
                                desc: "Short call to align on role & fit.",
                                Icon: Users,
                            }, {
                                num: "03",
                                title: "Technical Round",
                                desc: "Role-specific assessment or interview.",
                                Icon: Wrench,
                            }, {
                                num: "04",
                                title: "Offer & Onboarding",
                                desc: "Documentation, safety briefing, and day one plan.",
                                Icon: CalendarCheck,
                            }].map((s, i) => (
                                <div key={s.num} className="text-center">
                                    <div className="relative mb-6">
                                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                            <s.Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-bold text-sm">{s.num}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-bold mb-2">{s.title}</h3>
                                    <p className="text-gray-600">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section >

                {/* FAQ */}
                < section className="py-20 bg-white" >
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                        </div>

                        <div className="divide-y rounded-2xl border overflow-hidden">
                            {[
                                {
                                    q: "Do you hire freshers?",
                                    a: "Yes. We have junior engineer and trainee roles. Strong fundamentals and willingness to work on-site are key.",
                                },
                                {
                                    q: "Are accommodations provided for site roles?",
                                    a: "For eligible positions, we provide site accommodations and travel as per policy.",
                                },
                                {
                                    q: "How soon will I hear back after applying?",
                                    a: "Typically within 5–7 business days. If shortlisted, our team will reach you for a quick screening call.",
                                },
                                {
                                    q: "Can I apply for multiple roles?",
                                    a: "Absolutely. Apply to roles that match your skills; we’ll consider you across teams.",
                                },
                            ].map((f, i) => (
                                <details key={i} className="group open:bg-gray-50">
                                    <summary className="list-none cursor-pointer px-6 py-5 flex items-center justify-between">
                                        <span className="font-medium">{f.q}</span>
                                        <ChevronDown className="transition group-open:rotate-180" />
                                    </summary>
                                    <div className="px-6 pb-6 text-gray-600">{f.a}</div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section >

                {/* CTA */}
                < section className="py-20 bg-primary" >
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-white mb-6">Ready to build your career?</h2>
                        <p className="text-xl text-cyan-100 mb-8">
                            Apply to an open role or send us your resume for future opportunities.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                onClick={() => onNavigate("apply")}
                                className="cursor-pointer text-white border-none bg-cyan-600 hover:bg-white hover:text-cyan-600 px-8 py-3"
                            >
                                Apply Now
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => onNavigate("contact")}
                                className="bg-white text-cyan-600 cursor-pointer hover:bg-cyan-600 hover:text-white px-8 py-3"
                            >
                                Talk to HR
                            </Button>
                        </div>
                    </div>
                </section >
            </div >
        </>
    );
}