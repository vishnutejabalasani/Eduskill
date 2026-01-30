import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const WelcomeLanding = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-[#00E676]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[20%] w-[30vw] h-[30vw] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-8 font-['Space_Grotesk'] leading-[1.1]"
                    >
                        {t('landing.title').split('.').map((part, i, arr) => {
                            if (!part.trim()) return null;
                            const isCertified = part.includes('Get Certified') || part.includes('प्रमाणित') || part.includes('సర్టిఫికేట్');
                            return (
                                <span key={i}>
                                    <span className={isCertified ? "text-[#00E676]" : "text-white"}>
                                        {part.trim()}.
                                    </span>
                                    {i < arr.length - 2 && " "}
                                    {/* Add space except for last non-empty part */}
                                    {" "}
                                </span>
                            );
                        })}
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="mt-8 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
                    >
                        {t('landing.subtitle')}
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                    >
                        {user?.role === 'client' ? (
                            <Link to="/find-talent">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 230, 118, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-[#00E676] text-black font-bold px-10 py-4 rounded-xl hover:bg-[#00c853] transition-all flex items-center gap-2 text-lg"
                                >
                                    <Search size={22} /> {t('nav.findTalent')}
                                </motion.button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/courses">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 230, 118, 0.3)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-[#00E676] text-black font-bold px-10 py-4 rounded-xl hover:bg-[#00c853] transition-all flex items-center gap-2 text-lg"
                                    >
                                        {t('landing.explore')} <ArrowRight size={22} />
                                    </motion.button>
                                </Link>
                                <Link to="/signup">
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="border border-white/20 text-white font-medium px-10 py-4 rounded-xl hover:border-white transition-all text-lg"
                                    >
                                        {t('landing.start')}
                                    </motion.button>
                                </Link>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default WelcomeLanding;
