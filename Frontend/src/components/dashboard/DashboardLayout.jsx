import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 md:ml-64 pt-20 p-8 min-h-screen">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
