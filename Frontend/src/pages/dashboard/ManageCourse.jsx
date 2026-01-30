import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Loader2, Plus, PlayCircle, ArrowLeft, Trash2 } from 'lucide-react';

const ManageCourse = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [moduleForm, setModuleForm] = useState({ title: '', videoUrl: '', duration: 15 });
    const [submitting, setSubmitting] = useState(false);

    const fetchCourse = async () => {
        try {
            const res = await api.get(`/courses/${id}`);
            setCourse(res.data.data.course);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const handleAddModule = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/courses/${id}/modules`, moduleForm);
            setModuleForm({ title: '', videoUrl: '', duration: 15 });
            fetchCourse(); // Refresh data
        } catch (err) {
            alert('Failed to add module');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#00E676]" /></div>;
    if (!course) return <div className="text-white text-center">Course not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/dashboard/courses" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ArrowLeft size={18} /> Back to My Courses
            </Link>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="text-gray-400">Manage Syllabus and Content</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => window.open(`/dashboard/edit-course/${id}`, '_self')}
                        className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                    >
                        Edit Details
                    </button>
                    <Link
                        to={`/dashboard/manage-exam/${id}`}
                        className="bg-[#00E676]/10 text-[#00E676] px-4 py-2 rounded-lg hover:bg-[#00E676]/20 transition-colors font-bold border border-[#00E676]/50"
                    >
                        Setup Exam
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Module List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold mb-4">Current Modules ({course.modules?.length || 0})</h2>
                    <div className="space-y-3">
                        {course.modules?.map((mod, idx) => (
                            <a
                                key={idx}
                                href={mod.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center group hover:bg-white/10 transition-colors cursor-pointer block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#00E676]/10 text-[#00E676] flex items-center justify-center text-sm font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white group-hover:text-[#00E676] transition-colors">{mod.title}</div>
                                        <div className="text-xs text-gray-500">{mod.duration} mins</div>
                                    </div>
                                </div>
                                <div className="text-gray-600 group-hover:text-[#00E676] transition-colors">
                                    <PlayCircle size={20} />
                                </div>
                            </a>
                        ))}
                        {course.modules?.length === 0 && (
                            <div className="text-gray-500 text-sm italic">No modules added yet.</div>
                        )}
                    </div>
                </div>

                {/* Add Module Form */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-fit sticky top-24">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Plus size={20} className="text-[#00E676]" /> Add New Module
                    </h2>
                    <form onSubmit={handleAddModule} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Module Title</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Introduction to Editing"
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-[#00E676] outline-none"
                                value={moduleForm.title}
                                onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Video URL (MP4/Youtube)</label>
                            <input
                                required
                                type="url"
                                placeholder="https://..."
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-[#00E676] outline-none"
                                value={moduleForm.videoUrl}
                                onChange={e => setModuleForm({ ...moduleForm, videoUrl: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Duration (Minutes)</label>
                            <input
                                required
                                type="number"
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-[#00E676] outline-none"
                                value={moduleForm.duration}
                                onChange={e => setModuleForm({ ...moduleForm, duration: Number(e.target.value) })}
                            />
                        </div>

                        <button
                            disabled={submitting}
                            type="submit"
                            className="btn-primary w-full py-3 mt-2 flex justify-center"
                        >
                            {submitting ? <Loader2 className="animate-spin" /> : 'Add Module'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageCourse;
