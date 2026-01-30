import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="glass-panel border-t border-b-0 border-x-0 rounded-t-2xl py-12 mt-20 mx-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center font-bold text-[#00E676] text-xs">E</div>
                        <span className="text-lg font-bold text-gray-300">EduSkill Platform</span>
                    </div>

                    <div className="flex gap-8 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Investors</a>
                    </div>

                    <div className="text-sm text-gray-600">
                        {t('footer.rights')}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
