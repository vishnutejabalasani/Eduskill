import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Loader2, ArrowLeft, Mail, Calendar, MapPin, Star, PlayCircle, Image as ImageIcon, CheckCircle } from 'lucide-react';
import HireModal from '../components/dashboard/HireModal';

const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};



const PublicProfilePage = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showHireModal, setShowHireModal] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/users/${id}`);
                setProfile(res.data.data.user);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]"><Loader2 className="animate-spin text-[#00E676] w-12 h-12" /></div>;
    if (error || !profile) return <div className="min-h-screen bg-[#0a0a0a] text-white flex justify-center items-center">{error || 'User not found'}</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <Link to="/find-talent" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back to Talent Directory
                </Link>

                {/* Header Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-[#00E676] flex items-center justify-center text-4xl font-bold text-white shrink-0">
                            {profile.name.charAt(0)}
                        </div>

                        <div className="flex-1 w-full">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2">{profile.name}</h1>
                                    <p className="text-[#00E676] text-xl font-medium tracking-wide flex items-center gap-2">
                                        {profile.title || 'Creative Professional'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white">₹{profile.hourlyRate || 0}<span className="text-gray-400 text-lg font-normal">/hr</span></div>
                                    <button
                                        onClick={() => setShowHireModal(true)}
                                        className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-[#00E676] transition-colors mt-2 flex items-center gap-2"
                                    >
                                        <Mail size={18} /> Hire Now
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                                {profile.experience || "This user hasn't added a bio yet."}
                            </p>

                            <div className="flex gap-6 mt-6 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><Calendar size={16} /> Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                                {profile.certifications && profile.certifications.length > 0 && (
                                    <span className="flex items-center gap-1 text-[#00E676]"><Star size={16} fill="currentColor" /> Verified by EduSkill</span>
                                )}
                            </div>

                            {/* Verified Skills / Badges */}
                            {profile.certifications && profile.certifications.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Verified Skills</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {profile.certifications.map((cert) => (
                                            <div key={cert._id} className="relative group flex items-center gap-2 bg-[#00E676]/10 border border-[#00E676]/30 px-4 py-2 rounded-full text-[#00E676] text-sm font-bold hover:bg-[#00E676]/20 transition-colors cursor-default">
                                                <div className="w-2 h-2 rounded-full bg-[#00E676]" />
                                                {cert.course?.title || 'Certified Skill'}
                                                <CheckCircle size={14} className="ml-1" />

                                                {/* Custom Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 border border-white/20 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                    Certified: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Portfolio Section */}
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <ImageIcon className="text-[#00E676]" /> Portfolio / Work
                </h2>

                {profile.portfolio && profile.portfolio.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {profile.portfolio.map((item, index) => (
                            <div key={index} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#00E676]/50 transition-all">
                                <div className="aspect-video relative overflow-hidden bg-black">
                                    {(item.thumbnail || (item.url && (item.url.includes('youtu') || item.url.includes('vimeo')))) ? (
                                        <div className="flex items-center justify-center h-full w-full">
                                            {(item.url && (item.url.includes('youtu') || item.url.includes('vimeo'))) && <PlayCircle size={48} className="text-white opacity-80 group-hover:opacity-100 transition-opacity z-10" />}
                                            <img
                                                src={
                                                    item.thumbnail ||
                                                    (getYouTubeId(item.url) ? `https://img.youtube.com/vi/${getYouTubeId(item.url)}/maxresdefault.jpg` : item.url)
                                                }
                                                alt="Video Thumbnail"
                                                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                onError={(e) => {
                                                    // Fallback if maxresdefault doesn't exist (some videos)
                                                    if (e.target.src.includes('maxresdefault')) {
                                                        e.target.src = e.target.src.replace('maxresdefault', 'hqdefault');
                                                    } else {
                                                        e.target.style.display = 'none';
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <img src={item.thumbnail || item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    )}
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0"></a>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                    <p className="text-gray-400 text-sm">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center text-gray-400">
                        <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No portfolio items showcased yet.</p>
                    </div>
                )}

            </div>
            {/* Hire Modal */}
            <HireModal
                isOpen={showHireModal}
                onClose={() => setShowHireModal(false)}
                recipientId={profile._id}
                recipientName={profile.name}
            />
        </div>
    );
};

export default PublicProfilePage;
