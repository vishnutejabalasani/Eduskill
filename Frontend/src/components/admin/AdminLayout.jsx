import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../dashboard/Sidebar'; // Reusing for now, will pass admin prop
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, RefreshCw, AlertTriangle } from 'lucide-react';

const AdminLayout = () => {
    const { user, loading } = useAuth();

    if (loading) return null;

    // Hard security check (though ProtectedRoute should handle this too)
    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white">
            <Navbar />
            <div className="flex">
                <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 min-h-screen pt-20 hidden md:block fixed">
                    <div className="px-6 mb-8">
                        <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 mb-3">
                            <AlertTriangle size={12} /> ADMIN MODE
                        </div>
                        <h3 className="font-bold text-xl">Admin Panel</h3>
                    </div>

                    <nav className="px-3 space-y-1">
                        <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5 text-gray-300 transition-colors">
                            <LayoutDashboard size={18} /> Overview
                        </a>
                        <a href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-[#00E676]/10 text-[#00E676] transition-colors">
                            <Users size={18} /> User Management
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5 text-gray-300 transition-colors">
                            <RefreshCw size={18} /> Review Courses (Soon)
                        </a>
                    </nav>
                </aside>

                <main className="flex-1 md:ml-64 pt-20 p-8 min-h-screen">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
