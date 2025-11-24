"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/auth-store";
import { Navbar } from "@/components/landing/navbar";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Footer } from "@/components/landing/footer";

export default function ContactSalesPage() {
    const user = useAuthStore((s) => s.user);

    // PROGRAM SWITCHER STATE
    const [program, setProgram] = useState("enterprise"); // enterprise | government

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [message, setMessage] = useState("");

    // Government-specific fields
    const [orgType, setOrgType] = useState("");
    const [region, setRegion] = useState("");
    const [scale, setScale] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                program,
                name,
                email,
                company,
                message,
                ...(program === "government" && { orgType, region, scale })
            };

            const res = await fetch("/api/v1/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to submit");
            }

            toast.success("Your message has been sent! Our team will reach out shortly.");

            setName("");
            setEmail("");
            setCompany("");
            setMessage("");
            setOrgType("");
            setRegion("");
            setScale("");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Submission error";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const content = (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <Toaster />

            {/* PROGRAM SELECTOR */}
            <div className="flex justify-center gap-4 mb-12">
                <Button
                    variant={program === "enterprise" ? "default" : "outline"}
                    onClick={() => setProgram("enterprise")}
                >
                    Enterprise
                </Button>
                <Button
                    variant={program === "government" ? "default" : "outline"}
                    onClick={() => setProgram("government")}
                >
                    Government & Multilateral
                </Button>
            </div>

            {/* HERO SECTION */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">
                    {program === "enterprise"
                        ? "Build a Trusted Organization at Enterprise Scale"
                        : "National-Scale Trust Governance & Multilateral Programs"}
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    {program === "enterprise"
                        ? "The FutureForm Enterprise Trust Program delivers platform-level visibility, governance, and dedicated support."
                        : "Deploy national trust intelligence, coordinate multi-agency workflows, and strengthen governance across entire ecosystems."}
                </p>
            </div>

            {/* ENTERPRISE DETAILS */}
            {program === "enterprise" && (
                <section className="mt-20">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        The Enterprise Trust Program is built for organizations that:
                    </h2>
                    <ul className="mt-6 space-y-3 text-gray-700">
                        <li>• Run complex, multi-team or multi-country workflows</li>
                        <li>• Need respondent-scale measurement, repeatability, and auditability</li>
                        <li>• Require SSO, integrations, and governance controls</li>
                        <li>• Need benchmarking, dashboards, and longitudinal tracking</li>
                        <li>• Care about reducing partner and vendor risk</li>
                    </ul>
                </section>
            )}

            {/* GOVERNMENT DETAILS */}
            {program === "government" && (
                <section className="mt-20">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Built for National Programs, Multilaterals & PPP Stakeholders
                    </h2>
                    <ul className="mt-6 space-y-3 text-gray-700">
                        <li>• National trust dashboards and policy intelligence</li>
                        <li>• Multi-agency deployment and ecosystem governance</li>
                        <li>• PPP and vendor alignment scoring at scale</li>
                        <li>• Donor-funded project oversight and impact assurance</li>
                        <li>• Procurement-grade compliance, integration, and reporting</li>
                    </ul>
                </section>
            )}

            {/* COMMON CTA */}
            <section className="mt-24 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Talk to Our Team</h2>
                <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                    Tell us about your organization and goals. We will recommend the right deployment model.
                </p>
            </section>

            {/* CONTACT FORM */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-12 max-w-2xl mx-auto">
                <Input
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    placeholder="Company / Organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                />
                <Textarea
                    placeholder="Your Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="min-h-[140px]"
                />

                {/* GOVERNMENT-SPECIFIC FIELDS */}
                {program === "government" && (
                    <>
                        <Input
                            placeholder="Organization Type (Ministry, Multilateral, PPP Authority)"
                            value={orgType}
                            onChange={(e) => setOrgType(e.target.value)}
                        />
                        <Input
                            placeholder="Country or Region"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        />
                        <Input
                            placeholder="Program Scale (Pilot, National, Multi-Agency)"
                            value={scale}
                            onChange={(e) => setScale(e.target.value)}
                        />
                    </>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Sending..." : "Send Message"}
                </Button>
            </form>
        </div>
    );

    if (user) {
        return <DashboardLayout>{content}</DashboardLayout>;
    }

    return (
        <>
            <Navbar />
            {content}
            <Footer />
        </>
    );
}
