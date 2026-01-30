import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default to student
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Check for role param
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const roleParam = params.get('role');
        if (roleParam === 'client') setRole('client');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await signup({ name, email, password, role });
            // Redirect based on role
            // If client, maybe go to find-talent? Default to dashboard is fine too.
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative">
            <div className="absolute top-8 left-8">
                <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} /> {t('auth.backHome')}
                </Link>
            </div>

            <div className="absolute top-8 right-8">
                <LanguageSwitcher />
            </div>

            <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-2xl relative z-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white tracking-tight">{t('auth.createAccount')}</h2>
                    <p className="mt-2 text-sm text-gray-400">{t('auth.startJourney')}</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setRole('client')}
                            className={`p-4 rounded-xl border transition-all text-center ${role === 'client' ? 'bg-[#00E676]/20 border-[#00E676] text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                            <div className="font-bold text-sm mb-1">{t('auth.roleClient')}</div>
                            <div className="text-[10px] opacity-70">{t('auth.roleClientDesc')}</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`p-4 rounded-xl border transition-all text-center ${role === 'student' ? 'bg-[#00E676]/20 border-[#00E676] text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                            <div className="font-bold text-sm mb-1">{t('auth.roleStudent')}</div>
                            <div className="text-[10px] opacity-70">{t('auth.roleStudentDesc')}</div>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">{t('auth.fullName')}</label>
                            <input
                                id="name"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-black/50 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent focus:z-10 sm:text-sm"
                                placeholder={t('auth.fullName')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">{t('auth.email')}</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-black/50 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent focus:z-10 sm:text-sm"
                                placeholder={t('auth.email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">{t('auth.password')}</label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-black/50 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00E676] focus:border-transparent focus:z-10 sm:text-sm"
                                placeholder={t('auth.password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-black bg-[#00E676] hover:bg-[#00c853] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E676] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : t('auth.createAccount')}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-400">{t('auth.haveAccount')} </span>
                    <Link to="/login" className="font-medium text-[#00E676] hover:text-[#00c853]">
                        {t('auth.signIn')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
