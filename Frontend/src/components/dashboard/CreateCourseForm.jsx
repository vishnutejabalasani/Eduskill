import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Loader2, PlusCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CreateCourseForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        setFormData({
            ...formData,
            [name]: type === 'number' ? Number(value) : value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/courses', formData);
            navigate('/dashboard/courses');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">{t('createCourse.title')}</h1>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-3">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('createCourse.courseTitle')}</label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder={t('createCourse.courseTitlePlaceholder')}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('createCourse.desc')}</label>
                    <textarea
                        name="description"
                        required
                        rows="4"
                        placeholder={t('createCourse.descPlaceholder')}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('createCourse.category')}</label>
                        <select
                            name="category"
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none text-white"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option>Video Editing</option>
                            <option>Photography</option>
                            <option>Cooking</option>
                            <option>Event Management</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Level */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('createCourse.level')}</label>
                        <select
                            name="level"
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none text-white"
                            value={formData.level}
                            onChange={handleChange}
                        >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('createCourse.duration')}</label>
                        <input
                            type="number"
                            name="durationMinutes"
                            required
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none"
                            value={formData.durationMinutes}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('createCourse.price')} (₹)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Thumbnail URL (Temporary) */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('createCourse.thumbnail')}</label>
                    <input
                        type="url"
                        name="thumbnail"
                        required
                        placeholder="https://..."
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none"
                        value={formData.thumbnail}
                        onChange={handleChange}
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex justify-center items-center gap-2 py-4 text-lg"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <PlusCircle size={20} />}
                        {t('createCourse.publish')}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default CreateCourseForm;
