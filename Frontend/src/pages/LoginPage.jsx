import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
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
                    <h2 className="text-3xl font-bold text-white tracking-tight">{t('auth.welcomeBack')}</h2>
                    <p className="mt-2 text-sm text-gray-400">{t('auth.signInToAccount')}</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
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
                            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : t('auth.signIn')}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-400">{t('auth.noAccount')} </span>
                    <Link to="/signup" className="font-medium text-[#00E676] hover:text-[#00c853]">
                        {t('auth.signUp')}
                    </Link>
                </div>
                <div className="text-center text-sm mt-4">
                    <p className="text-gray-400">Looking to hire? <Link to="/signup?role=client" className="text-[#00E676] hover:underline">Find Talent Here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
