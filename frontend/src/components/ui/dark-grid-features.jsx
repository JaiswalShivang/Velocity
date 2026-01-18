import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Briefcase, BarChart3, Users, FileText, Zap } from "lucide-react";
import { motion } from "framer-motion";

const items = [
    {
        title: "Advanced Search",
        icon: Search,
        desc: "Filter by salary, location, company size, and more. Find your perfect role with precision targeting.",
    },
    {
        title: "Application Tracking",
        icon: Briefcase,
        desc: "Track every application status in one dashboard. Never lose sight of your opportunities.",
    },
    {
        title: "Analytics & Insights",
        icon: BarChart3,
        desc: "Visualize your job search progress and patterns. Make data-driven decisions for your career.",
    },
    {
        title: "Community",
        icon: Users,
        desc: "Connect with other job seekers and share tips. Learn from success stories and grow together.",
    },
    {
        title: "Multiple Resumes",
        icon: FileText,
        desc: "Create role-specific resume versions. Tailor your experience for every opportunity.",
    },
    {
        title: "Quick Apply",
        icon: Zap,
        badge: "New",
        desc: "Apply to multiple jobs with one click. Maximize your reach with minimal effort.",
    },
];

export default function DarkGridFeatures() {
    return (
        <div className="w-full bg-black text-zinc-50">
            <div className="mx-auto max-w-6xl px-4 py-16">
                <p className="text-xs tracking-widest text-zinc-500 uppercase">[ Capabilities ]</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                    Tools that fit your needs
                </h1>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map(({ title, icon: Icon, desc, badge }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <Card
                                className="group relative overflow-visible border-zinc-800 bg-gradient-to-b from-zinc-950/60 to-zinc-950/30 p-0 transition-colors duration-300 hover:border-zinc-700"
                            >
                                {/* subtle gradient on hover */}
                                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
                                </div>

                                {/* faint inner glow that appears on hover */}
                                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 to-white/0 group-hover:from-white/[0.03] group-hover:to-white/[0.06] transition-colors" />

                                {/* white corner squares on hover - now outside the card and square shaped */}
                                <div className="pointer-events-none absolute inset-0 hidden group-hover:block">
                                    <div className="absolute -left-2 -top-2 h-3 w-3 bg-white" />
                                    <div className="absolute -right-2 -top-2 h-3 w-3 bg-white" />
                                    <div className="absolute -left-2 -bottom-2 h-3 w-3 bg-white" />
                                    <div className="absolute -right-2 -bottom-2 h-3 w-3 bg-white" />
                                </div>

                                <CardHeader className="relative z-10 flex flex-row items-start gap-3 p-6">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/70 text-zinc-200">
                                        <Icon className="h-5 w-5 text-sky-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg font-medium text-zinc-100">{title}</CardTitle>
                                            {badge && (
                                                <span className="rounded-full border border-sky-500/50 bg-sky-500/10 px-2 py-0.5 text-[10px] leading-none text-sky-400">
                                                    {badge}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="relative z-10 px-6 pb-6 text-sm text-zinc-400">
                                    {desc}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}