import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/home/CourseCard';
import { Loader2, Filter, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();

    // Filters state
    const category = searchParams.get('category') || '';
    const level = searchParams.get('level') || '';

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                // Construct query string
                const query = new URLSearchParams();
                if (category && category !== 'All') query.append('category', category);
                if (level && level !== 'All') query.append('level', level);

                const res = await api.get(`/courses?${query.toString()}`);
                setCourses(res.data.data.courses);
            } catch (err) {
                console.error("Failed to fetch courses", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [category, level]);

    const handleFilterChange = (key, value) => {
        if (value === 'All') {
            searchParams.delete(key);
        } else {
            searchParams.set(key, value);
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-4 text-white">{t('courses.exploreTitle')}</h1>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            {t('courses.exploreSubtitle')}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-10 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-2 text-gray-400 mr-4">
                        <Filter size={18} />
                        <span className="text-sm font-medium uppercase tracking-wider">{t('courses.filters')}</span>
                    </div>

                    <select
                        value={category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="bg-white/5 border border-white/10 text-white text-sm rounded-full px-4 py-2 outline-none focus:border-[#00E676] transition-colors"
                    >
                        <option value="All">{t('courses.allCategories')}</option>
                        <option value="Video Editing">Video Editing</option>
                        <option value="Photography">Photography</option>
                        <option value="Cooking">Cooking</option>
                        <option value="Event Management">Event Management</option>
                    </select>

                    <select
                        value={level}
                        onChange={(e) => handleFilterChange('level', e.target.value)}
                        className="bg-white/5 border border-white/10 text-white text-sm rounded-full px-4 py-2 outline-none focus:border-[#00E676] transition-colors"
                    >
                        <option value="All">{t('courses.allLevels')}</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex h-96 items-center justify-center">
                        <Loader2 className="animate-spin text-[#00E676] w-12 h-12" />
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map(course => (
                            <Link key={course._id} to={`/courses/${course._id}`} className="block">
                                <CourseCard course={{
                                    ...course,
                                    // Normalize fields for the card component if needed
                                    image: course.thumbnail,
                                    duration: course.durationMinutes + ' min'
                                }} />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10">
                        <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">{t('courses.noCourses')}</h3>
                        <p className="text-gray-400">{t('courses.tryFilters')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesPage;
