import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Loader2, Clock, BarChart, Globe, PlayCircle, CheckCircle, Shield, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CourseDetailsPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                setCourse(res.data.data.course);
            } catch (err) {
                setError("Course not found");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><Loader2 className="animate-spin text-[#00E676]" /></div>;

    if (error || !course) return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 text-center text-white">
            <h1 className="text-2xl font-bold mb-4">{t('courseDetails.notFound')}</h1>
            <Link to="/courses" className="text-[#00E676] hover:underline">{t('courseDetails.backToCourses')}</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
            {/* Banner Section */}
            <div className="bg-gradient-to-b from-[#0a0a0a] to-black border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <div className="flex gap-2 text-sm font-medium">
                            <span className="bg-[#00E676]/10 text-[#00E676] px-3 py-1 rounded-full">{course.category}</span>
                            <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full">{course.level}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">{course.title}</h1>
                        <p className="text-xl text-gray-400 max-w-2xl">{course.description}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-400 pt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                                    {course.instructor?.name?.charAt(0) || 'I'}
                                </div>
                                <span>{t('courseDetails.createdBy')} <span className="text-white font-medium">{course.instructor?.name || 'Instructor'}</span></span>
                            </div>
                            <div className="flex items-center gap-1"><Clock size={16} /> {course.durationMinutes} min</div>
                            <div className="flex items-center gap-1"><Globe size={16} /> English</div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <button className="bg-[#00E676] text-black text-lg font-bold px-8 py-3 rounded-xl hover:bg-[#00c853] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,230,118,0.3)]">
                                {t('courseDetails.followCourse')} (₹{course.price})
                            </button>
                        </div>
                    </div>

                    <div className="w-full md:w-[500px] aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-12">
                    {/* What you'll learn */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">{t('courseDetails.whatLearn')}</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Placeholder items since DB doesn't have outcomes yet */}
                            {['Master the core concepts', 'Build real-world projects', 'Understand industry best practices', 'Earn a verified certificate'].map((item, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <CheckCircle className="text-[#00E676] shrink-0 mt-1" size={18} />
                                    <span className="text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Course Content */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">{t('courseDetails.courseContent')}</h2>
                        <div className="border border-white/10 rounded-xl divide-y divide-white/10">
                            {course.modules && course.modules.length > 0 ? (
                                course.modules.map((mod, idx) => (
                                    <a
                                        key={idx}
                                        href={mod.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-4 bg-white/5 flex justify-between items-center hover:bg-white/10 transition-colors cursor-pointer group block"
                                    >
                                        <div className="flex items-center gap-4">
                                            <PlayCircle className="text-gray-500 group-hover:text-[#00E676] transition-colors" size={20} />
                                            <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                                                {t('courseDetails.module')} {idx + 1}: {mod.title}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">
                                            {mod.duration} min
                                        </span>
                                    </a>
                                ))
                            ) : (
                                <div className="p-6 text-center text-gray-500 italic">
                                    {t('courseDetails.noModules')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Exam Section */}
                    <div className="bg-gradient-to-r from-[#00E676]/10 to-transparent border border-[#00E676]/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                <Award className="text-[#00E676]" />
                                {t('courseDetails.getCertifiedTitle')}
                            </h2>
                            <p className="text-gray-400">{t('courseDetails.getCertifiedDesc')}</p>
                        </div>
                        <Link
                            to={`/courses/${id}/exam`}
                            className="bg-[#00E676] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#00c853] transition-transform hover:scale-105 shadow-lg shadow-[#00E676]/20 whitespace-nowrap"
                        >
                            {t('courseDetails.takeExam')}
                        </Link>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-lg">{t('courseDetails.includesTitle')}</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex gap-3"><PlayCircle size={18} /> {course.durationMinutes} {t('courseDetails.video')}</li>
                            <li className="flex gap-3"><FileText size={18} /> 5 {t('courseDetails.resources')}</li>
                            <li className="flex gap-3"><Shield size={18} /> {t('courseDetails.cert')}</li>
                            <li className="flex gap-3"><Globe size={18} /> {t('courseDetails.access')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple icon component to fix undefined error above
const FileText = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
);

export default CourseDetailsPage;
