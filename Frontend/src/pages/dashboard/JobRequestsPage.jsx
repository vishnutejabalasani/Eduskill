import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader2, Calendar, MapPin, CheckCircle, XCircle, Clock, DollarSign, FileText } from 'lucide-react';

const JobRequestsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/job-requests');
            setBookings(res.data.data.bookings);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.patch(`/bookings/${id}/status`, { status: newStatus });
            fetchBookings(); // Refresh list
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#00E676]" /></div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Incoming Job Requests</h1>

            {bookings.length === 0 ? (
                <div className="bg-white/5 rounded-xl p-8 text-center text-gray-400">
                    <p>No job requests received yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white/5 border border-white/10 rounded-xl p-6 transition-all hover:bg-white/[0.07]">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-white">{booking.client.name}</h3>
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                booking.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                    booking.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-300">
                                        <div className="flex items-center gap-2"><BriefcaseIcon className="text-[#00E676]" size={16} /> {booking.eventType}</div>
                                        <div className="flex items-center gap-2"><Calendar className="text-[#00E676]" size={16} /> {booking.date}</div>
                                        <div className="flex items-center gap-2"><Clock className="text-[#00E676]" size={16} /> {booking.duration}</div>
                                        <div className="flex items-center gap-2"><MapPin className="text-[#00E676]" size={16} /> {booking.location}</div>
                                        <div className="flex items-center gap-2"><DollarSign className="text-[#00E676]" size={16} /> {booking.budget}</div>
                                    </div>

                                    <div className="bg-black/30 p-3 rounded-lg border border-white/5 text-sm text-gray-400 mt-2">
                                        <strong className="text-gray-300 block mb-1 flex items-center gap-2"><FileText size={14} /> Requirements:</strong>
                                        {booking.requirements}
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center gap-3 md:border-l md:border-white/10 md:pl-6 md:w-48">
                                    {booking.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                                                className="bg-[#00E676] text-black w-full py-2 rounded-lg font-bold hover:bg-[#00c853] flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={18} /> Accept
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                                className="bg-red-500/10 text-red-500 border border-red-500/50 w-full py-2 rounded-lg font-bold hover:bg-red-500/20 flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={18} /> Reject
                                            </button>
                                        </>
                                    )}

                                    {booking.status === 'accepted' && (
                                        <div className="text-center">
                                            <p className="text-sm text-gray-400 mb-2">Job is active.</p>
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'completed')}
                                                className="bg-gray-700 text-white w-full py-2 rounded-lg font-bold hover:bg-gray-600 text-xs"
                                            >
                                                Mark Completed
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Helper icon
const BriefcaseIcon = ({ className, size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
);

export default JobRequestsPage;
