import { CheckCircle2, Trophy, Users, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ValueProps = () => {
    const { t } = useTranslation();

    const features = [
        { icon: <Trophy size={24} />, title: t('home.features.certified.title'), desc: t('home.features.certified.desc') },
        { icon: <Users size={24} />, title: t('home.features.expert.title'), desc: t('home.features.expert.desc') },
        { icon: <Zap size={24} />, title: t('home.features.fast.title'), desc: t('home.features.fast.desc') },
        { icon: <CheckCircle2 size={24} />, title: t('home.features.quality.title'), desc: t('home.features.quality.desc') }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 50 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <div className="py-20 bg-black/50 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -5, borderColor: "rgba(0, 230, 118, 0.3)" }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <div className="w-12 h-12 bg-[#00E676]/10 rounded-xl flex items-center justify-center text-[#00E676] mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default ValueProps;
