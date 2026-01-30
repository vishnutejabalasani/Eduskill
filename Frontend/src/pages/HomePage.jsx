import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/home/CourseCard';
import ValueProps from '../components/home/ValueProps';
import WelcomeLanding from '../components/home/WelcomeLanding';

const HomePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses');
                // Take top 3 courses for trending section
                setCourses(res.data.data.courses.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch courses", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="bg-[#0a0a0a] min-h-screen">
            <WelcomeLanding />
            {/* Featured Courses Section - Hide for Clients */}
            {user?.role !== 'client' && (
                <section className="py-20 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Trending Certifications</h2>
                                <p className="text-gray-400">Validate your skills with our top-rated courses.</p>
                            </div>
                            <Link to="/courses" className="hidden sm:block text-[#00E676] hover:text-[#00c853] font-semibold transition-colors">
                                View All Courses →
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.length > 0 ? (
                                courses.map(course => (
                                    <Link key={course._id} to={`/courses/${course._id}`} className="block">
                                        <CourseCard course={{
                                            ...course,
                                            image: course.thumbnail,
                                            duration: course.durationMinutes + ' min'
                                        }} />
                                    </Link>
                                ))
                            ) : (
                                !loading && <div className="col-span-3 text-center text-gray-500">No courses available yet.</div>
                            )}
                            {loading && <div className="col-span-3 text-center text-gray-500">Loading trends...</div>}
                        </div>
                    </div>
                </section>
            )}

            {user?.role !== 'client' && <ValueProps />}
        </div>
    );
};

export default HomePage;
