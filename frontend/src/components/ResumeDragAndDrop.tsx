import {
    FileCheck2,
    Trash2,
    Upload
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

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
const ACCEPTED = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB


function validateFile(file: File) {
    if (!ACCEPTED.includes(file.type)) {
        throw new Error("Only PDF, DOC, DOCX allowed");
    }
    if (file.size > MAX_SIZE) {
        throw new Error("File must be under 10MB");
    }
}

// ---- Reusable Upload Box ----
export function ResumeDropzone({
    file,
    setFile,
    required = false,
}: {
    file: File | null | undefined;
    setFile: (f: File | null) => void;
    required?: boolean;
}) {
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const onFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const f = files[0];
        try {
            validateFile(f);
            setFile(f);
            toast.success("Resume attached");
        } catch (e: any) {
            toast.error(e.message || "Invalid file");
        }
    };

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
            />

            {!file ? (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        onFiles(e.dataTransfer.files);
                    }}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${dragOver ? "border-cyan-600 bg-cyan-50/40" : "border-gray-300 hover:bg-gray-50"
                        }`}
                >
                    <Upload className="mx-auto mb-3" />
                    <p className="font-medium">Drop your resume here or click to browse</p>
                    <p className="text-sm text-gray-600">PDF, DOC, DOCX • Max 10MB</p>
                    {required && <p className="text-xs text-red-600 mt-2">* Resume is required</p>}
                </div>
            ) : (
                <Card className="bg-gray-50">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <FileCheck2 />
                            <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setFile(null)} className="gap-2">
                            <Trash2 className="w-4 h-4" /> Remove
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}