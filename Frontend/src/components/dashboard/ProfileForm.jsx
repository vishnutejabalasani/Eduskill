import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Save, Loader2, CheckCircle, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProfileForm = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        title: user?.title || '',
        hourlyRate: user?.hourlyRate || '',
        experience: user?.experience || '',
        isOpenToWork: user?.isOpenToWork || false,
        availability: user?.availability || 'both',
        portfolio: user?.portfolio || []
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError('');

        try {
            const res = await api.patch('/users/updateMe', formData);
            updateUser(res.data.data.user);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update profile.');
            setLoading(false);
        }
    };

    const handleImageUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingIndex(index);
        const uploadData = new FormData();
        uploadData.append('photo', file);

        try {
            // Using a specific upload endpoint
            // Note: In a real app, use environment variable for base URL
            const res = await api.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Construct full URL (assuming server runs on port 5000)
            const fullUrl = `http://localhost:5000${res.data.data.url}`;

            const newPortfolio = [...formData.portfolio];
            newPortfolio[index].thumbnail = fullUrl;
            setFormData({ ...formData, portfolio: newPortfolio });

        } catch (err) {
            console.error("Upload failed", err);
            const msg = err.response?.data?.message || err.message || "Failed to upload image.";
            setError(msg);
        } finally {
            setUploadingIndex(null);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">{t('profile.settings')}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        {t('auth.fullName')}
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00E676] focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        {t('auth.email')}
                    </label>
                    <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                    />
                </div>

                {/* Professional Info */}
                <div className="pt-4 border-t border-white/10 space-y-6">
                    <h3 className="text-lg font-semibold">{t('profile.professionalDetails')}</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">{t('profile.jobTitle')}</label>
                            <input
                                type="text"
                                placeholder="e.g. Professional Video Editor"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00E676] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">{t('profile.rate')} (₹)</label>
                            <input
                                type="number"
                                placeholder="50"
                                value={formData.hourlyRate}
                                onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00E676] outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('profile.experience')}</label>
                        <textarea
                            rows="4"
                            placeholder="Tell clients about your skills and experience..."
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00E676] outline-none resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
                        <input
                            type="checkbox"
                            id="openToWork"
                            checked={formData.isOpenToWork}
                            onChange={(e) => setFormData({ ...formData, isOpenToWork: e.target.checked })}
                            className="w-5 h-5 accent-[#00E676] cursor-pointer"
                        />
                        <label htmlFor="openToWork" className="cursor-pointer select-none">
                            <span className="block font-medium text-white">{t('profile.openToWork')}</span>
                            <span className="block text-xs text-gray-400">{t('profile.openToWorkDesc')}</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Availability</label>
                        <select
                            value={formData.availability || 'both'}
                            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00E676] outline-none text-white"
                        >
                            <option value="both">Open to Both</option>
                            <option value="full-time">Full Time Only</option>
                            <option value="part-time">Part Time Only</option>
                            <option value="freelance">Freelance</option>
                        </select>
                    </div>
                </div>

                {/* Portfolio Management */}
                <div className="pt-4 border-t border-white/10 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center justify-between">
                        {t('profile.portfolio')}
                        <button type="button" onClick={() => {
                            const newPortfolio = [...(formData.portfolio || []), { title: 'New Work', url: '', thumbnail: '', description: '' }];
                            setFormData({ ...formData, portfolio: newPortfolio });
                        }} className="text-xs bg-[#00E676] text-black px-3 py-1 rounded font-bold hover:bg-[#00c853]">{t('profile.addWork')}</button>
                    </h3>

                    <div className="space-y-4">
                        {(formData.portfolio || []).map((item, index) => (
                            <div key={index} className="bg-black/30 p-4 rounded-lg border border-white/10 space-y-3">
                                <div className="flex justify-between">
                                    <h4 className="text-sm font-medium text-gray-300">Item #{index + 1}</h4>
                                    <button type="button" onClick={() => {
                                        const newP = formData.portfolio.filter((_, i) => i !== index);
                                        setFormData({ ...formData, portfolio: newP });
                                    }} className="text-red-500 text-xs hover:text-red-400">Remove</button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Title (e.g. Wedding Highlight Reel)"
                                    value={item.title}
                                    onChange={(e) => {
                                        const newP = [...formData.portfolio];
                                        newP[index].title = e.target.value;
                                        setFormData({ ...formData, portfolio: newP });
                                    }}
                                    className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#00E676]"
                                />
                                <input
                                    type="url"
                                    placeholder="URL (Image Link or YouTube URL)"
                                    value={item.url}
                                    onChange={(e) => {
                                        const newP = [...formData.portfolio];
                                        newP[index].url = e.target.value;
                                        setFormData({ ...formData, portfolio: newP });
                                    }}
                                    className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#00E676]"
                                />
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            {item.thumbnail && (
                                                <img src={item.thumbnail} alt="Preview" className="w-12 h-12 object-cover rounded border border-white/20" />
                                            )}
                                            <label className={`cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded flex items-center gap-2 text-sm transition-colors border border-white/10 ${uploadingIndex === index ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                {uploadingIndex === index ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                                {item.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, index)}
                                                    disabled={uploadingIndex === index}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <textarea
                                    placeholder="Description"
                                    rows="2"
                                    value={item.description}
                                    onChange={(e) => {
                                        const newP = [...formData.portfolio];
                                        newP[index].description = e.target.value;
                                        setFormData({ ...formData, portfolio: newP });
                                    }}
                                    className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#00E676] resize-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center gap-2 px-6 py-2.5"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {t('profile.save')}
                    </button>

                    {success && (
                        <div className="flex items-center gap-2 text-[#00E676] text-sm font-medium animate-in fade-in slide-in-from-left-2">
                            <CheckCircle size={18} /> {t('profile.saved')}
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-sm font-medium">
                            {error}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;
