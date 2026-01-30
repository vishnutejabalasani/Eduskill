import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Video Editing',
        level: 'Beginner',
        price: 0,
        thumbnail: '',
        durationMinutes: 60
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                const course = res.data.data.course;
                setFormData({
                    title: course.title,
                    description: course.description,
                    category: course.category,
                    level: course.level,
                    price: course.price,
                    thumbnail: course.thumbnail,
                    durationMinutes: course.durationMinutes
                });
            } catch (err) {
                setError('Failed to fetch course details');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? Number(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await api.patch(`/courses/${id}`, formData);
            navigate('/dashboard/courses');
        } catch (err) {
            setError(err.response?.data?.message || t('editCourse.failure'));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#00E676]" /></div>;
    if (error) return <div className="text-red-500 text-center p-12">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/dashboard/courses" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ArrowLeft size={18} /> {t('courseDetails.backToCourses')}
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {t('editCourse.title')}
                </h1>
                <p className="text-gray-400 mt-2">{t('editCourse.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-12">
                {/* Basic Info Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                    <h2 className="text-xl font-semibold border-b border-white/10 pb-4">{t('editCourse.basicInfo')}</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('createCourse.courseTitle')}</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none transition-all"
                                placeholder={t('createCourse.courseTitlePlaceholder')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('createCourse.desc')}</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none transition-all resize-none"
                                placeholder={t('createCourse.descPlaceholder')}
                            />
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                    <h2 className="text-xl font-semibold border-b border-white/10 pb-4">{t('editCourse.courseDetails')}</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('createCourse.category')}</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="Video Editing">Video Editing</option>
                                <option value="Photography">Photography</option>
                                <option value="Cooking">Cooking</option>
                                <option value="Event Management">Event Management</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('createCourse.level')}</label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('createCourse.duration')}</label>
                            <input
                                type="number"
                                name="durationMinutes"
                                value={formData.durationMinutes}
                                onChange={handleChange}
                                min="0"
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('createCourse.price')} (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Media Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                    <h2 className="text-xl font-semibold border-b border-white/10 pb-4">{t('editCourse.media')}</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t('createCourse.thumbnail')}</label>
                        <input
                            type="url"
                            name="thumbnail"
                            value={formData.thumbnail}
                            onChange={handleChange}
                            required
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none transition-all"
                            placeholder="https://..."
                        />
                        {formData.thumbnail && (
                            <div className="mt-4 relative aspect-video w-64 rounded-lg overflow-hidden border border-white/10">
                                <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/courses')}
                        className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        {t('editCourse.cancel')}
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#00E676] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#00c853] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {t('profile.save')}</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCourse;
