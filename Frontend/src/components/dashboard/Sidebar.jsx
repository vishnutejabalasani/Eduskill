import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Settings, BookOpen, CreditCard, MessageSquare, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
    const location = useLocation();
    const { user } = useAuth();
    const { t } = useTranslation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: LayoutDashboard, label: t('dashboard.overview'), path: '/dashboard' },
        { icon: Briefcase, label: 'Incoming Jobs', path: '/dashboard/job-requests' },
        { icon: MessageSquare, label: t('messages.title'), path: '/dashboard/messages' },
        { icon: Briefcase, label: 'My Hires', path: '/dashboard/my-hires' },
        { icon: BookOpen, label: t('dashboard.myCourses'), path: '/dashboard/courses' },
        // Add Create Course if Creator/Admin
        ...((user?.role === 'creator' || user?.role === 'admin') ? [{ icon: BookOpen, label: t('dashboard.createCourse'), path: '/dashboard/create-course' }] : []),
        { icon: User, label: t('dashboard.myProfile'), path: '/dashboard/profile' },
        { icon: CreditCard, label: t('dashboard.billing'), path: '/dashboard/billing' },
        { icon: Settings, label: t('nav.settings'), path: '/dashboard/settings' },
    ];

    return (
        <aside className="w-64 glass-panel border-r-0 min-h-[calc(100vh-5rem)] mt-20 ml-4 rounded-2xl hidden md:block fixed">
            <div className="px-6 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00E676] flex items-center justify-center text-black font-bold text-lg">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-200">{user?.name}</h3>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>

            <nav className="px-3 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                            ? 'bg-[#00E676]/10 text-[#00E676]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
