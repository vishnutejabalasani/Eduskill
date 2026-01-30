import { useState } from 'react';
import { Menu, X, LogOut, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    return (
        <nav className="fixed w-full z-50 glass-panel border-b-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.jpg" alt="EduSkill Logo" className="w-8 h-8 rounded" />
                        <span className="text-xl font-bold tracking-tight text-[#00E676]">EduSkill</span>
                    </Link>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {/* Hide Courses for strictly Client role, show for Student/Admin/etc */}
                            {user?.role !== 'client' && (
                                <Link to="/courses" className="text-gray-300 hover:text-[#00E676] transition-colors px-3 py-2 rounded-md text-sm font-medium">{t('nav.courses')}</Link>
                            )}
                            <Link to="/find-talent" className="text-gray-300 hover:text-[#00E676] transition-colors px-3 py-2 rounded-md text-sm font-medium">{t('nav.findTalent')}</Link>
                        </div>
                    </div>

                    <div className="hidden md:flex gap-4 items-center">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard" className="text-sm font-medium hover:text-[#00E676] text-gray-300 transition-colors">
                                    {t('nav.dashboard')}
                                </Link>
                                <Link to="/dashboard/messages" className="text-sm font-medium hover:text-[#00E676] text-gray-300 transition-colors flex items-center gap-2">
                                    <MessageSquare size={16} />
                                    <span className="hidden lg:inline">{t('nav.messages')}</span>
                                </Link>
                                <span className="text-sm font-medium text-gray-300">|</span>
                                <span className="text-sm font-medium text-gray-300">Hi, {user.name?.split(' ')[0] || 'User'}</span>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 text-sm font-medium hover:text-white text-gray-300 transition-colors py-2"
                                >
                                    <LogOut size={16} /> {t('nav.logout')}
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium hover:text-white text-gray-300 transition-colors py-2">
                                    {t('nav.login')}
                                </Link>
                                <Link to="/signup" className="bg-[#00E676] text-black hover:bg-[#00c853] px-4 py-2 rounded-md text-sm font-medium transition-all">
                                    {t('nav.getStarted')}
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-[#0a0a0a] border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {user?.role !== 'client' && (
                            <Link to="/courses" className="text-gray-300 hover:text-[#00E676] block px-3 py-2 rounded-md text-base font-medium">{t('nav.courses')}</Link>
                        )}
                        <Link to="/find-talent" className="text-gray-300 hover:text-[#00E676] block px-3 py-2 rounded-md text-base font-medium">{t('nav.findTalent')}</Link>
                        <div className="border-t border-gray-700 pt-4 mt-4">
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-[#00E676]">{t('nav.dashboard')}</Link>
                                    <Link to="/dashboard/messages" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-[#00E676]">{t('nav.messages')}</Link>
                                    <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white">{t('nav.logout')}</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white">{t('nav.login')}</Link>
                                    <Link to="/signup" className="block w-full text-center mt-2 bg-[#00E676] text-black px-3 py-2 rounded-md text-base font-medium">{t('nav.getStarted')}</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
