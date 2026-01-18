import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Video,
    GraduationCap,
    Building2,
    FileText,
    BarChart3,
    Briefcase,
    Bell,
    Mic,
    Brain,
    Trophy,
    DollarSign,
    Users,
    MessageSquare,
    Hash,
    Send
} from "lucide-react";

export default function FeaturesCards() {
    return (
        <section className="bg-zinc-950/50 py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Powerful <span className="text-sky-400">Features</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Everything you need to accelerate your career and land your dream job faster.
                    </p>
                </motion.div>

                {/* Main Feature Cards Grid */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Interview Simulator Card */}
                    <FeatureCard index={0}>
                        <CardHeader
                            icon={Video}
                            title="AI Interview Simulator"
                            description="Practice with AI-powered mock interviews. Get real-time feedback on your answers, body language tips, and performance analytics."
                        />
                        <div className="relative mb-6 border-t border-dashed border-zinc-700 sm:mb-0">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/50 to-zinc-950" />
                            <div className="aspect-[76/59] p-4 px-6">
                                <InterviewMockup />
                            </div>
                        </div>
                    </FeatureCard>

                    {/* Fellowship Card */}
                    <FeatureCard index={1}>
                        <CardHeader
                            icon={Trophy}
                            title="Fellowship Challenges"
                            description="Students earn money solving real-world challenges. Companies find top talent and get work done."
                        />
                        <div className="p-6 pt-0">
                            <div className="relative mb-6 sm:mb-0">
                                <div className="absolute -inset-6 bg-gradient-to-r from-transparent via-transparent to-zinc-950" />
                                <FellowshipMockup />
                            </div>
                        </div>
                    </FeatureCard>

                    {/* Full Width Secondary Features Card */}
                    <FeatureCard className="p-6 lg:col-span-2" index={2}>
                        <p className="mx-auto my-6 max-w-lg text-balance text-center text-xl md:text-2xl font-semibold text-white">
                            Complete toolkit for your job search journey
                        </p>

                        <div className="flex justify-center gap-4 md:gap-6 overflow-hidden flex-wrap">
                            <CircularFeature
                                icon={FileText}
                                label="Resume Builder"
                                color="sky"
                            />
                            <CircularFeature
                                icon={BarChart3}
                                label="Resume Analyzer"
                                color="emerald"
                            />
                            <CircularFeature
                                icon={Briefcase}
                                label="Job Tracker"
                                color="amber"
                            />
                            <CircularFeature
                                icon={Bell}
                                label="Job Alerts"
                                color="violet"
                                className="hidden sm:block"
                            />
                        </div>
                    </FeatureCard>
                </div>

                {/* Community Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16 mb-8"
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        Connect with <span className="text-indigo-400">Community</span>
                    </h3>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Join thousands of job seekers. Share tips, network, and grow together.
                    </p>
                </motion.div>

                <FeatureCard className="p-0 overflow-hidden" index={3}>
                    <div className="grid lg:grid-cols-5 gap-0">
                        {/* Left side - Channel list mockup */}
                        <div className="lg:col-span-2 bg-zinc-900/80 border-r border-zinc-800 p-4">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
                                <Users className="w-5 h-5 text-indigo-400" />
                                <span className="text-white font-medium">Community Hub</span>
                            </div>
                            <CommunityChannelList />
                        </div>

                        {/* Right side - Chat preview */}
                        <div className="lg:col-span-3 p-4">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
                                <Hash className="w-4 h-4 text-zinc-500" />
                                <span className="text-white font-medium">interview-prep</span>
                                <span className="text-xs text-zinc-500 ml-auto">32 online</span>
                            </div>
                            <CommunityChatPreview />
                        </div>
                    </div>
                </FeatureCard>
            </div>
        </section>
    );
}

// Feature Card with decorative corners
function FeatureCard({ children, className, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                "group relative rounded-none bg-zinc-900/50 border border-zinc-800 shadow-xl shadow-zinc-950/10",
                className
            )}
        >
            <CardDecorator />
            {children}
        </motion.div>
    );
}

// Decorative corner elements
function CardDecorator() {
    return (
        <>
            <span className="absolute -left-px -top-px block size-2 border-l-2 border-t-2 border-sky-500" />
            <span className="absolute -right-px -top-px block size-2 border-r-2 border-t-2 border-sky-500" />
            <span className="absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 border-sky-500" />
            <span className="absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 border-sky-500" />
        </>
    );
}

// Card Header component
function CardHeader({ icon: Icon, title, description }) {
    return (
        <div className="p-6 pb-3">
            <div className="p-4">
                <span className="text-zinc-400 flex items-center gap-2 text-sm">
                    <Icon className="size-4 text-sky-400" />
                    {title}
                </span>
                <p className="mt-4 text-lg md:text-xl font-semibold text-white">{description}</p>
            </div>
        </div>
    );
}

// Interview Mockup Visual
function InterviewMockup() {
    return (
        <div className="relative">
            {/* Video frame mockup */}
            <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-3 space-y-3">
                {/* Video area */}
                <div className="aspect-video bg-zinc-900 rounded-md relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
                            <Video className="w-6 h-6 text-sky-400" />
                        </div>
                    </div>
                    {/* AI indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-sky-500/20 rounded-full"
                    >
                        <Brain className="w-3 h-3 text-sky-400" />
                        <span className="text-xs text-sky-400">AI Active</span>
                    </motion.div>
                </div>
                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                            <Mic className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                            <Video className="w-4 h-4 text-zinc-400" />
                        </div>
                    </div>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "60%" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="h-1 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}

// Fellowship Mockup Visual
function FellowshipMockup() {
    const challenges = [
        { title: "Build AI Dashboard", company: "TechCorp", bounty: "$500", icon: "💻", type: "Development" },
        { title: "Market Research Report", company: "StartupX", bounty: "$300", icon: "📊", type: "Research" },
        { title: "UI Redesign", company: "DesignCo", bounty: "$400", icon: "🎨", type: "Design" },
    ];

    return (
        <div className="space-y-2">
            {/* Role selector */}
            <div className="flex gap-2 mb-3">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-500/30"
                >
                    <GraduationCap className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400">Student</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 rounded-full border border-blue-500/30"
                >
                    <Building2 className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-blue-400">Corporate</span>
                </motion.div>
            </div>

            {/* Challenge cards */}
            {challenges.map((challenge, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-zinc-600 transition-colors"
                >
                    <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center text-lg">
                        {challenge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{challenge.title}</p>
                        <p className="text-xs text-zinc-500">{challenge.company} • {challenge.type}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-full">
                        <DollarSign className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">{challenge.bounty}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

// Circular Feature indicator
function CircularFeature({ icon: Icon, label, color, className }) {
    const colorClasses = {
        sky: "border-sky-500 bg-sky-500/10 text-sky-400",
        emerald: "border-emerald-500 bg-emerald-500/10 text-emerald-400",
        amber: "border-amber-500 bg-amber-500/10 text-amber-400",
        violet: "border-violet-500 bg-violet-500/10 text-violet-400",
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={className}
        >
            <div className="bg-gradient-to-b from-zinc-800 to-transparent p-px rounded-2xl">
                <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 relative flex aspect-square w-fit items-center justify-center rounded-[15px] p-5">
                    <div className={cn(
                        "size-10 md:size-12 rounded-full border-2 flex items-center justify-center",
                        colorClasses[color]
                    )}>
                        <Icon className="size-5 md:size-6" />
                    </div>
                </div>
            </div>
            <span className="text-zinc-400 mt-2 block text-center text-xs md:text-sm">{label}</span>
        </motion.div>
    );
}

// Community Channel List Mockup
function CommunityChannelList() {
    const channels = [
        { name: "general", icon: "💬", members: 128, active: false },
        { name: "interview-prep", icon: "🎯", members: 89, active: true },
        { name: "resume-tips", icon: "📄", members: 67, active: false },
        { name: "networking", icon: "🤝", members: 45, active: false },
    ];

    return (
        <div className="space-y-1">
            {channels.map((channel, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + idx * 0.08 }}
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                        channel.active
                            ? "bg-indigo-500/20 border border-indigo-500/30"
                            : "hover:bg-zinc-800"
                    )}
                >
                    <Hash className={cn("w-4 h-4", channel.active ? "text-indigo-400" : "text-zinc-500")} />
                    <span className={cn("text-sm flex-1", channel.active ? "text-white" : "text-zinc-400")}>
                        {channel.name}
                    </span>
                    <span className="text-xs text-zinc-600">{channel.members}</span>
                </motion.div>
            ))}
        </div>
    );
}

// Community Chat Preview Mockup
function CommunityChatPreview() {
    const messages = [
        {
            user: "Sarah K.",
            image: "https://randomuser.me/api/portraits/women/1.jpg",
            message: "Just got an offer from Google! 🎉 Thanks everyone for the interview tips!",
            time: "2m ago",
        },
        {
            user: "Alex M.",
            image: "https://randomuser.me/api/portraits/men/2.jpg",
            message: "Congrats Sarah! 🙌 Can you share which resources helped most?",
            time: "1m ago",
        },
        {
            user: "Jordan P.",
            image: "https://randomuser.me/api/portraits/men/3.jpg",
            message: "The mock interview practice here was so helpful for system design rounds",
            time: "Just now",
        },
    ];

    return (
        <div className="space-y-3">
            {messages.map((msg, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.15 }}
                    className="flex items-start gap-3"
                >
                    <img
                        src={msg.image}
                        alt={msg.user}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white font-medium">{msg.user}</span>
                            <span className="text-xs text-zinc-600">{msg.time}</span>
                        </div>
                        <p className="text-sm text-zinc-400 mt-0.5">{msg.message}</p>
                    </div>
                </motion.div>
            ))}

            {/* Message input mockup */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-4 flex items-center gap-2 p-2 bg-zinc-800/50 rounded-lg border border-zinc-700"
            >
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm text-zinc-400 placeholder-zinc-600 outline-none"
                    disabled
                />
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <Send className="w-4 h-4 text-indigo-400" />
                </div>
            </motion.div>
        </div>
    );
}