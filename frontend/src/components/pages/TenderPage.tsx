import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Progress } from "../ui/progress";
import {
    Search,
    Calendar,
    MapPin,
    FileText,
    Download,
    Building2,
    Layers,
    Gavel,
    ClipboardList,
    Clock,
    IndianRupee,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
} from "lucide-react";

import banner from "../../assets/rail.jpeg"; // reuse existing hero image for theme consistency

interface TendersPageProps {
    onNavigate: (page: string) => void;
}

export type Tender = {
    id: string;
    title: string;
    refNo: string;
    department: string;
    sector: "Roads" | "Railways" | "Water" | "Buildings" | "Mining";
    procurement: "Open" | "Limited" | "EOI" | "RFP";
    location: string;
    estValueINR?: string;
    publishDate: string; // ISO
    startDate: string; // sale/start of docs
    prebidDate?: string;
    submitBy: string; // deadline
    openOn: string; // technical/bid open
    status: "Live" | "Closed" | "Awarded";
    documents: { name: string; url?: string }[];
    summary: string;
};

const TENDERS: Tender[] = [
    {
        id: "TND-101",
        title: "Construction of 4-Lane Urban Road including Drain & Footpath (Package R-07)",
        refNo: "ZE/ROAD/R07/2025",
        department: "Zeba Enterprises – Procurement",
        sector: "Roads",
        procurement: "Open",
        location: "Giridih, Jharkhand",
        estValueINR: "₹18.5 Cr",
        publishDate: "2025-11-04",
        startDate: "2025-11-05",
        prebidDate: "2025-11-15 11:00",
        submitBy: "2025-11-28 17:00",
        openOn: "2025-11-29 12:00",
        status: "Live",
        documents: [
            { name: "NIT & Tender Document (PDF)" },
            { name: "BoQ (XLSX)" },
            { name: "Corrigendum-1 (PDF)" },
        ],
        summary:
            "Widening and strengthening including PCC drains, footpaths, and utilities shifting. Time to complete: 12 months.",
    },
    {
        id: "TND-102",
        title: "Track Laying & Ballast Supply for Rail Siding – Phase II",
        refNo: "ZE/RAIL/PH2/2025",
        department: "Zeba Rail Projects",
        sector: "Railways",
        procurement: "RFP",
        location: "Dhanbad, Jharkhand",
        estValueINR: "₹42.0 Cr",
        publishDate: "2025-11-02",
        startDate: "2025-11-03",
        prebidDate: "2025-11-12 15:30",
        submitBy: "2025-11-25 16:00",
        openOn: "2025-11-26 11:00",
        status: "Live",
        documents: [
            { name: "RFP Document (PDF)" },
            { name: "Drawings (ZIP)" },
            { name: "Standard Conditions (PDF)" },
        ],
        summary:
            "Supply of ballast, sleepers handling, track laying, and tamping with quality and safety compliance as per IR standards.",
    },
    {
        id: "TND-099",
        title: "Supply & Installation of Vertical Turbine Pumps – 2.0 MLD",
        refNo: "ZE/PUMP/VT-2MLD/2025",
        department: "Industrial Pump Division",
        sector: "Water",
        procurement: "Limited",
        location: "Bokaro, Jharkhand",
        estValueINR: "₹3.2 Cr",
        publishDate: "2025-10-20",
        startDate: "2025-10-21",
        prebidDate: undefined,
        submitBy: "2025-11-05 17:00",
        openOn: "2025-11-06 12:00",
        status: "Closed",
        documents: [
            { name: "NIT (PDF)" },
            { name: "BoQ (XLSX)" },
        ],
        summary:
            "Design, supply, installation and performance testing of VT pumps with associated MCC panels and instrumentation.",
    },
];

function daysLeft(deadlineISO: string) {
    const now = new Date();
    const d = new Date(deadlineISO);
    const ms = d.getTime() - now.getTime();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function pctTimeElapsed(startISO: string, endISO: string) {
    const now = new Date().getTime();
    const s = new Date(startISO).getTime();
    const e = new Date(endISO).getTime();
    if (now <= s) return 0;
    if (now >= e) return 100;
    return Math.round(((now - s) / (e - s)) * 100);
}

function TendersPage({ onNavigate }: TendersPageProps) {
    const [q, setQ] = useState("");
    const [sector, setSector] = useState<string>("all");
    const [location, setLocation] = useState<string>("all");
    const [procurement, setProcurement] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");
    const [sort, setSort] = useState<string>("deadline");
    const [active, setActive] = useState<Tender | null>(null);

    const filtered = useMemo(() => {
        let list = [...TENDERS];

        if (q.trim()) {
            const qq = q.toLowerCase();
            list = list.filter((t) =>
                [t.title, t.refNo, t.department, t.location, t.summary].join(" ").toLowerCase().includes(qq)
            );
        }
        if (sector !== "all") list = list.filter((t) => t.sector === sector);
        if (location !== "all") list = list.filter((t) => t.location === location);
        if (procurement !== "all") list = list.filter((t) => t.procurement === procurement);
        if (status !== "all") list = list.filter((t) => t.status === status);

        if (sort === "deadline") list.sort((a, b) => +new Date(a.submitBy) - +new Date(b.submitBy));
        if (sort === "published") list.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));

        return list;
    }, [q, sector, location, procurement, status, sort]);

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-20 bg-gradient-to-r from-gray-900 to-gray-700">
                <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${banner})` }} />
                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <Badge className="mb-4 bg-white/20 text-white border-white/40">Tenders</Badge>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Procurement <span className="text-cyan-500">Opportunities</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Explore live bids, RFQs, and RFPs from Zeba Enterprises. Transparent, compliant, and time-bound processes.
                    </p>
                </div>
            </section>

            {/* Controls */}
            <section className="py-8 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="rounded-2xl border p-4 md:p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tender title, ref. no., or keywords" className="pl-10 h-11" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <Select value={sector} onValueChange={setSector}>
                                    <SelectTrigger className="h-11"><SelectValue placeholder="Sector" /></SelectTrigger>
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
                            <div className="md:col-span-2">
                                <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger className="h-11"><SelectValue placeholder="Location" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Locations</SelectItem>
                                        <SelectItem value="Giridih, Jharkhand">Giridih</SelectItem>
                                        <SelectItem value="Dhanbad, Jharkhand">Dhanbad</SelectItem>
                                        <SelectItem value="Bokaro, Jharkhand">Bokaro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2">
                                <Select value={procurement} onValueChange={setProcurement}>
                                    <SelectTrigger className="h-11"><SelectValue placeholder="Procurement Type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="Open">Open</SelectItem>
                                        <SelectItem value="Limited">Limited</SelectItem>
                                        <SelectItem value="EOI">EOI</SelectItem>
                                        <SelectItem value="RFP">RFP</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2">
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-11"><SelectValue placeholder="Status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="Live">Live</SelectItem>
                                        <SelectItem value="Closed">Closed</SelectItem>
                                        <SelectItem value="Awarded">Awarded</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2">
                                <Select value={sort} onValueChange={setSort}>
                                    <SelectTrigger className="h-11"><SelectValue placeholder="Sort By" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="deadline">Nearest Deadline</SelectItem>
                                        <SelectItem value="published">Recently Published</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tenders Grid */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Live & Recent Tenders</h2>
                        <p className="text-gray-600">Showing {filtered.length} of {TENDERS.length}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filtered.map((t, idx) => {
                            const days = daysLeft(t.submitBy);
                            const pct = pctTimeElapsed(t.startDate, t.submitBy);
                            const danger = days <= 3 && t.status === "Live";

                            return (
                                <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                                    <Card className="hover:shadow-lg transition group">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <CardTitle className="text-xl">{t.title}</CardTitle>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <Badge variant="outline" className="gap-1"><ClipboardList className="w-4 h-4" /> {t.refNo}</Badge>
                                                        <Badge variant="outline" className="gap-1"><Building2 className="w-4 h-4" /> {t.department}</Badge>
                                                        <Badge variant="outline" className="gap-1"><Layers className="w-4 h-4" /> {t.sector}</Badge>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-500">Published {new Date(t.publishDate).toLocaleDateString()}</div>
                                                    <div className="mt-1 flex items-center justify-end gap-2">
                                                        <MapPin className="w-4 h-4 text-gray-500" />
                                                        <span className="text-sm text-gray-700">{t.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-5 pt-0">
                                            <p className="text-gray-600">{t.summary}</p>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                <div className="text-sm">
                                                    <div className="text-gray-500">Submission Deadline</div>
                                                    <div className="font-medium flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(t.submitBy).toLocaleString()}</div>
                                                </div>
                                                <div className="text-sm">
                                                    <div className="text-gray-500">Bid Opening</div>
                                                    <div className="font-medium flex items-center gap-2"><Gavel className="w-4 h-4" /> {new Date(t.openOn).toLocaleString()}</div>
                                                </div>
                                                <div className="text-sm">
                                                    <div className="text-gray-500">Pre-bid</div>
                                                    <div className="font-medium flex items-center gap-2"><Clock className="w-4 h-4" /> {t.prebidDate ? new Date(t.prebidDate).toLocaleString() : "—"}</div>
                                                </div>
                                                <div className="text-sm">
                                                    <div className="text-gray-500">Est. Value</div>
                                                    <div className="font-medium flex items-center gap-2"><IndianRupee className="w-4 h-4" /> {t.estValueINR || "NA"}</div>
                                                </div>
                                            </div>

                                            {t.status === "Live" && (
                                                <div>
                                                    <div className="flex items-center justify-between text-sm mb-2">
                                                        <span className="text-gray-600">Time Remaining</span>
                                                        <span className={`font-medium ${danger ? "text-red-600" : "text-gray-800"}`}>
                                                            {days > 0 ? `${days} day${days === 1 ? "" : "s"}` : days === 0 ? "Today" : "Closed"}
                                                        </span>
                                                    </div>
                                                    <Progress value={pct} className={`h-2 ${danger ? "bg-red-50" : ""}`} />
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-2">
                                                {t.status === "Live" ? (
                                                    <Badge className="bg-cyan-50 text-cyan-700 border-cyan-200">Live</Badge>
                                                ) : t.status === "Closed" ? (
                                                    <Badge variant="secondary">Closed</Badge>
                                                ) : (
                                                    <Badge className="bg-green-50 text-green-700 border-green-200">Awarded</Badge>
                                                )}
                                                <Badge variant="outline">{t.procurement}</Badge>
                                            </div>

                                            <div className="flex flex-wrap gap-3 pt-1">
                                                {t.documents.map((d, i) => (
                                                    <Button key={i} variant="outline" className="cursor-pointer" onClick={() => setActive(t)}>
                                                        <FileText className="w-4 h-4 mr-2" /> {d.name}
                                                    </Button>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <Button
                                                    className="cursor-pointer text-white border-none bg-cyan-600 hover:bg-cyan-700"
                                                    onClick={() => setActive(t)}
                                                >
                                                    View Details <ArrowRight className="ml-2 w-4 h-4" />
                                                </Button>
                                                <Button variant="outline" onClick={() => onNavigate("contact")}>
                                                    Ask a Question
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Info Banner */}
                    <Card className="mt-8 border-dashed">
                        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-cyan-600 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold">Important</h3>
                                    <p className="text-gray-600">Bids must be submitted before the deadline. Late submissions will not be accepted.</p>
                                </div>
                            </div>
                            <Button variant="outline" className="bg-white text-cyan-600 cursor-pointer hover:bg-cyan-600 hover:text-white" onClick={() => onNavigate("contact")}>
                                Vendor Registration
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Tender Detail Modal */}
            <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
                <DialogContent className="max-w-3xl">
                    {active && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{active.title}</DialogTitle>
                                <DialogDescription>
                                    Ref No: {active.refNo} • {active.department} • {active.location}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-4">
                                    <p className="text-gray-700">{active.summary}</p>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div className="text-gray-500">Procurement Type</div>
                                            <div className="font-medium">{active.procurement}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Sector</div>
                                            <div className="font-medium">{active.sector}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Publish Date</div>
                                            <div className="font-medium">{new Date(active.publishDate).toLocaleDateString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Submission Deadline</div>
                                            <div className="font-medium">{new Date(active.submitBy).toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Bid Opening</div>
                                            <div className="font-medium">{new Date(active.openOn).toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Estimated Value</div>
                                            <div className="font-medium">{active.estValueINR || "NA"}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Documents</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {active.documents.map((d, i) => (
                                                <Button key={i} variant="outline" className="cursor-pointer">
                                                    <Download className="w-4 h-4 mr-2" /> {d.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-xl border p-4">
                                        <h4 className="font-semibold mb-2">Submission Instructions</h4>
                                        <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                                            <li>Read the NIT/RFP document thoroughly.</li>
                                            <li>Prepare BoQ and technical forms as per Annexures.</li>
                                            <li>Ensure EMD/Bank Guarantee (if applicable) is attached.</li>
                                            <li>Submit the sealed/online bid before the deadline; late bids aren’t accepted.</li>
                                            <li>For queries, contact procurement via the contact form.</li>
                                        </ol>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Card>
                                        <CardContent className="p-4 space-y-2">
                                            <div className="text-sm text-gray-500">Status</div>
                                            <div className="flex gap-2 items-center">
                                                {active.status === "Live" ? (
                                                    <Badge className="bg-cyan-50 text-cyan-700 border-cyan-200">Live</Badge>
                                                ) : active.status === "Closed" ? (
                                                    <Badge variant="secondary">Closed</Badge>
                                                ) : (
                                                    <Badge className="bg-green-50 text-green-700 border-green-200">Awarded</Badge>
                                                )}
                                                <Badge variant="outline">{active.procurement}</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4 space-y-2">
                                            <div className="text-sm text-gray-500">Key Dates</div>
                                            <div className="text-sm">Start of Documents: <span className="font-medium">{new Date(active.startDate).toLocaleString()}</span></div>
                                            <div className="text-sm">Pre-bid Meeting: <span className="font-medium">{active.prebidDate ? new Date(active.prebidDate).toLocaleString() : "—"}</span></div>
                                            <div className="text-sm">Submission Deadline: <span className="font-medium">{new Date(active.submitBy).toLocaleString()}</span></div>
                                            <div className="text-sm">Bid Opening: <span className="font-medium">{new Date(active.openOn).toLocaleString()}</span></div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4 space-y-3">
                                            <div className="text-sm text-gray-500">Need Help?</div>
                                            <p className="text-sm text-gray-700">If you have any questions regarding eligibility, EMD, or submission, reach out to our procurement team.</p>
                                            <Button onClick={() => onNavigate("contact")} className="cursor-pointer text-white border-none bg-cyan-600 hover:bg-cyan-700 w-full">Contact Procurement</Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* CTA */}
            <section className="py-20 bg-primary">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-white mb-6">Partner with Zeba Enterprises</h2>
                    <p className="text-xl text-cyan-100 mb-8">Register as a vendor and receive email alerts for new tenders matching your trade.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" onClick={() => onNavigate("contact")} className="cursor-pointer text-white border-none bg-cyan-600 hover:bg-white hover:text-cyan-600 px-8 py-3">Register Now</Button>
                        <Button size="lg" variant="outline" onClick={() => onNavigate("contact")} className="bg-white text-cyan-600 cursor-pointer hover:bg-cyan-600 hover:text-white px-8 py-3">Request Demo</Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default TendersPage;
