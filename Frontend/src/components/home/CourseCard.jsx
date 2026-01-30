import { Star, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const CourseCard = ({ course }) => {
    const { t } = useTranslation();

    return (
        <Link to={`/courses/${course._id}`} className="block h-full">
            <motion.div
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="glass-card rounded-2xl overflow-hidden h-full flex flex-col group"
            >
                <div className="relative aspect-video overflow-hidden">
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        4.8
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 rounded-md bg-[#00E676]/10 text-[#00E676] text-xs font-bold uppercase tracking-wider">
                            {course.category || 'General'}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock size={12} /> {course.durationMinutes || 60}m
                        </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-[#00E676] transition-colors">
                        {course.title}
                    </h3>

                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                        {course.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                            <span className="text-sm text-gray-400">{course.instructor?.name || 'Instructor'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Award size={16} className="text-[#00E676]" />
                            <span className="text-xs font-bold text-[#00E676]">{t('courses.certified')}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default CourseCard;
