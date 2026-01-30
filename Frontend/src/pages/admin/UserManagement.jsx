import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Loader2, Trash2, Mail, User as UserIcon } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, statsRes] = await Promise.all([
                    api.get('/admin/users'),
                    api.get('/admin/stats')
                ]);
                setUsers(usersRes.data.data.users);
                setStats(statsRes.data.data.stats);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-[#00E676]" /></div>;

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">User Management</h1>
                    <p className="text-gray-400">Manage platform users and access.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-gray-400 text-xs uppercase">Total Users</span>
                        <div className="text-xl font-bold">{stats?.users || 0}</div>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                        <span className="text-gray-400 text-xs uppercase">Creators</span>
                        <div className="text-xl font-bold">{users.filter(u => u.role === 'creator').length}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-black/50 border-b border-white/10 text-gray-400 text-xs uppercase">
                            <th className="px-6 py-4 font-medium">User</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Joined</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs">
                                            <UserIcon size={14} />
                                        </div>
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                                        ${user.role === 'admin' ? 'bg-red-500/10 text-red-500' :
                                            user.role === 'creator' ? 'bg-purple-500/10 text-purple-500' :
                                                'bg-green-500/10 text-green-500'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-500 hover:text-red-500 transition-colors" title="Delete User">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
