import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, Clock, TrendingUp, MoreHorizontal, ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const DashboardOverview = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4 } }
    };

    // Mock Data for Charts
    const weeklyActivity = [45, 70, 30, 85, 50, 60, 90]; // Mon-Sun
    const maxVal = Math.max(...weeklyActivity);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold">{t('dashboard.welcome', { name: user?.name?.split(' ')[0] })}</h1>
                    <p className="text-gray-400">{t('dashboard.activity')}</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-400">Current Plan</p>
                    <p className="text-[#00E676] font-bold uppercase">{user?.role || 'Pro Student'}</p>
                </div>
            </motion.div>

            {/* Top Stats Row */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {[
                    { label: t('dashboard.enrolled'), value: '4', icon: <BookOpen className="text-[#00E676]" />, color: 'bg-[#00E676]/10', trend: '+12%' },
                    { label: t('dashboard.certifications'), value: '2', icon: <Award className="text-purple-400" />, color: 'bg-purple-500/10', trend: '+1' },
                    { label: t('dashboard.hours'), value: '12.5', icon: <Clock className="text-blue-400" />, color: 'bg-blue-500/10', trend: '+2.5h' },
                    { label: t('dashboard.completed'), value: '1', icon: <TrendingUp className="text-orange-400" />, color: 'bg-orange-500/10', trend: '100%' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={item}
                        className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-[#00E676]/30 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-3 rounded-xl ${stat.color} transition-transform group-hover:scale-110`}>
                                {stat.icon}
                            </div>
                            <span className="text-xs font-bold text-[#00E676] bg-[#00E676]/10 px-2 py-1 rounded-full flex items-center gap-1">
                                <ArrowUp size={12} /> {stat.trend}
                            </span>
                        </div>
                        <div className="relative z-10">
                            <span className="text-3xl font-bold block mb-1">{stat.value}</span>
                            <h3 className="text-gray-400 font-medium text-sm">{stat.label}</h3>
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute right-[-20px] bottom-[-20px] opacity-5 rotate-12 transform group-hover:scale-125 transition-transform duration-500">
                            {stat.icon}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Visuals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Average Progress Gauge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center relative"
                >
                    <h3 className="text-lg font-bold text-gray-200 w-full mb-6">Average Progress</h3>
                    <div className="relative w-48 h-24 mb-4">
                        {/* SVG Gauge Half-Circle */}
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                            {/* Background Arc */}
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#333" strokeWidth="10" strokeLinecap="round" />
                            {/* Progress Arc (57%) */}
                            <path d="M 10 50 A 40 40 0 0 1 75 22" fill="none" stroke="#00E676" strokeWidth="10" strokeLinecap="round" strokeDasharray="126" strokeDashoffset="0" className="drop-shadow-[0_0_10px_rgba(0,230,118,0.5)]" />
                        </svg>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                            <span className="text-4xl font-bold text-white">57%</span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm text-center">You are doing great! Keep it up.</p>
                </motion.div>

                {/* 2. Weekly Study Time Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-2xl lg:col-span-2"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-gray-200">Weekly Activity</h3>
                        <select className="bg-black/30 border border-white/10 rounded-lg text-xs px-2 py-1 text-gray-400 outline-none">
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>

                    <div className="flex items-end justify-between h-48 gap-3 px-2 pt-6">
                        {weeklyActivity.map((val, idx) => {
                            const height = `${(val / maxVal) * 100}%`;
                            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                            return (
                                <div key={idx} className="flex flex-col items-center justify-end h-full gap-2 flex-1 group">
                                    <div className="w-full bg-white/5 rounded-t-lg relative flex-1 flex items-end overflow-hidden group-hover:bg-white/10 transition-colors">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height }}
                                            transition={{ duration: 1, type: 'spring' }}
                                            className="w-full bg-gradient-to-t from-[#00E676]/20 to-[#00E676] rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity relative"
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none z-20">
                                                {val} mins
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                                            </div>
                                        </motion.div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">{days[idx]}</span>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Row 3: Course Progress & Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Course List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-2xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-200">Course Progress</h3>
                        <button className="text-xs text-[#00E676] hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'Advanced Cinematography', progress: 75, color: 'bg-purple-500' },
                            { name: 'Video Editing Masterclass', progress: 45, color: 'bg-blue-500' },
                            { name: 'Sound Design 101', progress: 90, color: 'bg-orange-500' },
                            { name: 'Color Grading Basics', progress: 30, color: 'bg-pink-500' }
                        ].map((course, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg ${course.color}/20 flex items-center justify-center text-white font-bold`}>
                                    {course.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-300">{course.name}</span>
                                        <span className="text-gray-500">{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                        <div className={`h-full ${course.color}`} style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Exam/Certification Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-2xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-200">Skills & Badges</h3>
                        <MoreHorizontal size={20} className="text-gray-500 cursor-pointer" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-orange-500/20">
                                🏆
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Top Performer</h4>
                                <p className="text-xs text-gray-400">Top 10% in Video Editing</p>
                            </div>
                            <span className="ml-auto text-[#00E676] text-xs font-bold px-2 py-1 bg-[#00E676]/10 rounded">Active</span>
                        </div>

                        <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-blue-500/20">
                                ⚡
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Fast Learner</h4>
                                <p className="text-xs text-gray-400">Finished 2 courses in 1 week</p>
                            </div>
                            <span className="ml-auto text-gray-500 text-xs font-bold px-2 py-1 bg-white/5 rounded"> earned 2d ago</span>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default DashboardOverview;
