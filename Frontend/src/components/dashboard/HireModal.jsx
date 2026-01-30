import { useState } from 'react';
import { X, Calendar, MapPin, Clock, FileText, DollarSign, Send, Loader2, Briefcase } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const HireModal = ({ isOpen, onClose, recipientId, recipientName }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        eventType: '',
        date: '',
        location: '',
        duration: '',
        budget: '',
        requirements: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const messageContent = `
🎬 **Hiring Request**

📌 **Event Type:** ${formData.eventType}
📅 **Date:** ${formData.date}
📍 **Location:** ${formData.location}
⏳ **Duration:** ${formData.duration}
💰 **Budget:** ${formData.budget ? '₹' + formData.budget : 'Negotiable'}

📝 **Requirements:**
${formData.requirements}
        `.trim();

        try {
            // Create official booking
            await api.post('/bookings', {
                professionalId: recipientId,
                eventType: formData.eventType,
                date: formData.date,
                location: formData.location,
                duration: formData.duration,
                budget: formData.budget,
                requirements: formData.requirements
            });

            // Also send a notification message
            await api.post('/messages', {
                recipientId,
                content: messageContent
            });

            onClose();
            if (window.confirm("Hiring request sent! View it in your bookings?")) {
                navigate(`/dashboard/my-hires`);
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.message || "Unknown Error";
            alert(`Failed to send hiring request: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-6 border-b border-white/10 bg-white/5 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Briefcase className="text-[#00E676]" />
                        Hire {recipientName}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Fill in the event details to send a formal request.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

                    {/* Event Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
                            Event Type
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Wedding, Corporate Event, Music Video"
                            value={formData.eventType}
                            onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-[#00E676] outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
                                <Calendar size={14} /> Event Date
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-[#00E676] outline-none "
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
                                <Clock size={14} /> Duration
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. 5 Hours, 2 Days"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-[#00E676] outline-none"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
                            <MapPin size={14} /> Location
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="City, Venue, or Remote"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-[#00E676] outline-none"
                        />
                    </div>

                    {/* Budget */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
                            <DollarSign size={14} /> Estimated Budget (₹)
                        </label>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={formData.budget}
                            onChange={e => setFormData({ ...formData, budget: e.target.value })}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-[#00E676] outline-none"
                        />
                    </div>

                    {/* Requirements */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
                            <FileText size={14} /> Specific Requirements
                        </label>
                        <textarea
                            rows={4}
                            required
                            placeholder="Describe your vision, equipment needed, or any special requests..."
                            value={formData.requirements}
                            onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-[#00E676] outline-none resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00E676] text-black font-bold py-3 rounded-xl hover:bg-[#00c853] transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                        Send Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HireModal;
