import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import CourseCard from "../../components/home/CourseCard";

import { Loader2, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const MyCourses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    const isCreator = user?.role === 'creator' || user?.role === 'admin';

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // If creator, fetch created courses. If student, fetch enrolled (future logic)
                const endpoint = isCreator ? '/courses/my-courses' : '/courses/enrolled'; // endpoint for enrolled not matched yet, using my-courses for now for logic
                // Actually let's just use my-courses for creators specifically.
                if (isCreator) {
                    const res = await api.get('/courses/my-courses');
                    setCourses(res.data.data.courses);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (isCreator) fetchCourses();
        else setLoading(false);
    }, [isCreator]);

    if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#00E676]" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('myCourses.title')}</h1>
                {isCreator && (
                    <Link to="/dashboard/create-course" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
                        <Plus size={18} /> {t('myCourses.createNew')}
                    </Link>
                )}
            </div>

            {!isCreator && (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-gray-400 mb-4">{t('myCourses.notEnrolled')}</p>
                    <Link to="/courses" className="text-[#00E676] hover:underline">{t('myCourses.browseCourses')}</Link>
                </div>
            )}

            {isCreator && courses.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-gray-400 mb-4">{t('myCourses.notCreated')}</p>
                    <Link to="/dashboard/create-course" className="text-[#00E676] hover:underline">{t('myCourses.createFirst')}</Link>
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course._id} className="relative group">
                        <CourseCard course={{
                            ...course,
                            image: course.thumbnail,
                            duration: course.durationMinutes + ' min'
                        }} />

                        {/* Creator Options Overlay */}
                        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3 rounded-xl p-4">
                            <Link
                                to={`/dashboard/manage-course/${course._id}`}
                                className="bg-[#00E676] text-black w-full text-center py-2 rounded-lg font-bold hover:bg-[#00c853] transition-colors"
                            >
                                {t('myCourses.manageContent')}
                            </Link>
                            <Link
                                to={`/dashboard/edit-course/${course._id}`}
                                className="bg-white text-black w-full text-center py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                            >
                                {t('myCourses.editDetails')}
                            </Link>
                            <button
                                onClick={async () => {
                                    if (window.confirm(t('myCourses.deleteConfirm'))) {
                                        try {
                                            await api.delete(`/courses/${course._id}`);
                                            // Refresh list (simple way)
                                            setCourses(courses.filter(c => c._id !== course._id));
                                        } catch (err) {
                                            alert('Failed to delete course');
                                        }
                                    }
                                }}
                                className="bg-red-500/20 text-red-500 border border-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-colors"
                            >
                                {t('myCourses.delete')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyCourses;
