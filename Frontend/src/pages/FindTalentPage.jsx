import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2, Search, MapPin, Briefcase, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FindTalentPage = () => {
    const [talents, setTalents] = useState([]);
    const [filteredTalents, setFilteredTalents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'full-time', 'part-time'
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchTalent = async () => {
            try {
                const res = await api.get('/users/talent');
                console.log("DEBUG: Talent Response:", res.data);
                setTalents(res.data.data.talent);
                setFilteredTalents(res.data.data.talent);
            } catch (err) {
                console.error("Failed to fetch talent", err);
                setError("Failed to load talent. Please ensure the backend is running.");
            } finally {
                setLoading(false);
            }
        };
        fetchTalent();
    }, []);

    useEffect(() => {
        if (filter === 'all') {
            setFilteredTalents(talents);
        } else {
            setFilteredTalents(talents.filter(user =>
                user.availability === filter || user.availability === 'both' || !user.availability
            ));
        }
    }, [filter, talents]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        {t('findTalent.title')}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        {t('findTalent.subtitle')}
                    </p>

                    <div className="flex justify-center gap-4">
                        {['all', 'full-time', 'part-time'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${filter === type
                                    ? 'bg-[#00E676] text-black shadow-[0_0_20px_rgba(0,230,118,0.4)]'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                {type === 'all' ? 'All Talent' : type === 'full-time' ? 'Full Time' : 'Part Time'}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <Loader2 className="animate-spin text-[#00E676] w-12 h-12" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-500/10 border border-red-500/20 rounded-2xl">
                        <p className="text-red-500 font-bold mb-2">Connection Error</p>
                        <p className="text-gray-400">{error}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTalents.map((user) => {
                            const availability = user.availability || 'both';
                            return (
                                <div key={user._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#00E676]/50 transition-all hover:shadow-lg group relative overflow-hidden">
                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${availability === 'full-time' ? 'bg-[#00E676]/20 text-[#00E676]' :
                                            availability === 'part-time' ? 'bg-orange-500/20 text-orange-500' :
                                                availability === 'freelance' ? 'bg-blue-500/20 text-blue-500' :
                                                    'bg-white/10 text-gray-300'
                                        }`}>
                                        {availability === 'both' ? 'Open to Work' : availability}
                                    </div>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-[#00E676] flex items-center justify-center text-xl font-bold text-white">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-[#00E676] transition-colors">{user.name}</h3>
                                            <p className="text-[#00E676] text-sm font-medium uppercase tracking-wider">{user.title || 'Creative Professional'}</p>
                                            <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                                <span>4.9 ({t('findTalent.verified')})</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 min-h-[60px]">
                                        {user.experience || "No bio added yet."}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <div className="text-white font-bold">
                                            ₹{user.hourlyRate || 0}<span className="text-gray-500 text-sm font-normal">/hr</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {currentUser?._id !== user._id && (
                                                <Link to={`/dashboard/messages?userId=${user._id}`} className="px-4 py-2 border border-[#00E676] text-[#00E676] rounded-lg text-sm font-bold hover:bg-[#00E676]/10 transition-colors">
                                                    {t('findTalent.message')}
                                                </Link>
                                            )}
                                            <Link to={`/creators/${user._id}`} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#00E676] transition-colors">
                                                {t('findTalent.viewProfile')}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {talents.length === 0 && (
                            <div className="col-span-3 text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">{t('findTalent.noTalentTitle')}</h3>
                                <p className="text-gray-400">{t('findTalent.noTalentDesc')}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
};

export default FindTalentPage;
