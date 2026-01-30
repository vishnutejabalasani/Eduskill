import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader2, Calendar, MapPin, CheckCircle, Star, AlertCircle } from 'lucide-react';

const MyHiresPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewingId, setReviewingId] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/my-bookings');
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

    const handleMarkComplete = async (id) => {
        if (!window.confirm("Mark this job as completed? You will then be able to leave a review.")) return;
        try {
            await api.patch(`/bookings/${id}/status`, { status: 'completed' });
            fetchBookings();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleSubmitReview = async (e, id) => {
        e.preventDefault();
        try {
            await api.post(`/bookings/${id}/review`, reviewForm);
            alert("Review submitted successfully!");
            setReviewingId(null);
            fetchBookings();
        } catch (err) {
            alert("Failed to submit review: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#00E676]" /></div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">My Hires</h1>

            {bookings.length === 0 ? (
                <div className="bg-white/5 rounded-xl p-8 text-center text-gray-400">
                    <p>You haven't hired anyone yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{booking.professional.name}</h3>
                                    <p className="text-[#00E676] text-sm mb-4">{booking.eventType}</p>

                                    <div className="flex gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {booking.date}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {booking.location}</span>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                booking.status === 'accepted' ? 'bg-blue-500/20 text-blue-400' :
                                                    booking.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-yellow-500/20 text-yellow-500'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>

                                <div className=" md:text-right">
                                    {booking.status === 'accepted' && (
                                        <button
                                            onClick={() => handleMarkComplete(booking._id)}
                                            className="bg-[#00E676] text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#00c853]"
                                        >
                                            Mark Complete
                                        </button>
                                    )}

                                    {booking.status === 'completed' && !booking.review && (
                                        <button
                                            onClick={() => setReviewingId(booking._id)}
                                            className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 flex items-center gap-2 ml-auto"
                                        >
                                            <Star size={16} /> Leave Review
                                        </button>
                                    )}

                                    {booking.review && (
                                        <div className="text-yellow-500 flex items-center gap-1 justify-end">
                                            {[...Array(booking.review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                            <span className="text-gray-400 text-sm ml-2">Reviewed</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Review Form */}
                            {reviewingId === booking._id && (
                                <div className="mt-6 pt-6 border-t border-white/10 animate-in fade-in">
                                    <form onSubmit={(e) => handleSubmitReview(e, booking._id)} className="max-w-md ml-auto bg-black/30 p-4 rounded-xl border border-white/10">
                                        <h4 className="font-bold text-white mb-3">Rate your experience</h4>
                                        <div className="flex gap-2 mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                    className={`hover:scale-110 transition-transform ${reviewForm.rating >= star ? 'text-yellow-500' : 'text-gray-600'}`}
                                                >
                                                    <Star size={24} fill={reviewForm.rating >= star ? "currentColor" : "none"} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            placeholder="Write your feedback..."
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white text-sm mb-3 focus:border-[#00E676] outline-none"
                                            rows="3"
                                            required
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setReviewingId(null)}
                                                className="text-gray-400 text-sm hover:text-white px-3 py-1.5"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-[#00E676] text-black px-4 py-1.5 rounded font-bold text-sm"
                                            >
                                                Submit Review
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyHiresPage;
