import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';
import { Save, Loader2, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

const ProfilePage = () => {
    const { user, login } = useAuth(); // login behaves like 'updateUser' if we were to re-fetch
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        title: '',
        hourlyRate: '',
        experience: '',
        isOpenToWork: false,
        portfolio: [] // Array of { title, url }
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                title: user.title || '',
                hourlyRate: user.hourlyRate || '',
                experience: user.experience || '',
                isOpenToWork: user.isOpenToWork || false,
                portfolio: user.portfolio || []
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePortfolioChange = (index, field, value) => {
        const newPortfolio = [...formData.portfolio];
        newPortfolio[index][field] = value;
        setFormData(prev => ({ ...prev, portfolio: newPortfolio }));
    };

    const addPortfolioItem = () => {
        setFormData(prev => ({
            ...prev,
            portfolio: [...prev.portfolio, { title: '', url: '' }]
        }));
    };

    const removePortfolioItem = (index) => {
        setFormData(prev => ({
            ...prev,
            portfolio: prev.portfolio.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const res = await api.patch('/users/update-me', formData);
            // Ideally update context user here if api returns updated user
            // accessing login/updateUser function from AuthContext might be needed if strictly separating state
            // For now, prompt user reload or silent update
            if (res.data.data.user) {
                // Update local storage or trigger context refresh if available. 
                // Assuming page refresh is acceptable or context updates automatically on reload.
            }
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white">{t('profile.settings')}</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="glass-panel p-8 rounded-2xl space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-8 bg-[#00E676] rounded-full"></span>
                        {t('editCourse.basicInfo')}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">{t('auth.fullName')}</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E676]"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">{t('auth.email')}</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Info */}
                <div className="glass-panel p-8 rounded-2xl space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                        {t('profile.professionalDetails')}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">{t('profile.jobTitle')}</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Senior Video Editor"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E676]"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">{t('profile.rate')} ($/hr)</label>
                            <input
                                type="number"
                                name="hourlyRate"
                                placeholder="0"
                                value={formData.hourlyRate}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E676]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">{t('profile.experience')}</label>
                        <textarea
                            name="experience"
                            rows="4"
                            placeholder="Tell clients about your skills and past projects..."
                            value={formData.experience}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00E676]"
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#00E676]/50 transition-colors cursor-pointer" onClick={() => setFormData(p => ({ ...p, isOpenToWork: !p.isOpenToWork }))}>
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${formData.isOpenToWork ? 'bg-[#00E676] border-[#00E676]' : 'border-gray-500'}`}>
                            {formData.isOpenToWork && <span className="text-black font-bold text-sm">✓</span>}
                        </div>
                        <div>
                            <p className="text-white font-bold">{t('profile.openToWork')}</p>
                            <p className="text-gray-400 text-xs">{t('profile.openToWorkDesc')}</p>
                        </div>
                    </div>
                </div>

                {/* Portfolio */}
                <div className="glass-panel p-8 rounded-2xl space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                        {t('profile.portfolio')}
                    </h2>

                    {formData.portfolio.map((item, index) => (
                        <div key={index} className="flex gap-4 items-start bg-black/20 p-4 rounded-xl">
                            <div className="flex-1 space-y-4">
                                <input
                                    type="text"
                                    placeholder="Project Title"
                                    value={item.title}
                                    onChange={(e) => handlePortfolioChange(index, 'title', e.target.value)}
                                    className="w-full bg-transparent border-b border-white/10 focus:border-[#00E676] py-2 text-white outline-none"
                                />
                                <div className="flex items-center gap-2">
                                    <LinkIcon size={16} className="text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Project URL"
                                        value={item.url}
                                        onChange={(e) => handlePortfolioChange(index, 'url', e.target.value)}
                                        className="flex-1 bg-transparent border-b border-white/10 focus:border-[#00E676] py-2 text-sm text-gray-300 outline-none"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removePortfolioItem(index)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addPortfolioItem}
                        className="w-full py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:border-[#00E676] hover:text-[#00E676] transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={18} /> {t('profile.addWork')}
                    </button>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 sticky bottom-6 bg-[#0a0a0a]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl z-40">
                    {success && (
                        <span className="text-[#00E676] flex items-center mr-4 animate-fade-in">
                            {t('profile.saved')}
                        </span>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary px-8 py-3 flex items-center gap-2 rounded-xl"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                        {t('profile.save')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;
