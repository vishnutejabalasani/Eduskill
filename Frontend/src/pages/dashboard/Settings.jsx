import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const Settings = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">{t('settings.title')}</h1>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Globe className="text-[#00E676]" size={24} />
                    <h2 className="text-xl font-bold">{t('settings.language')}</h2>
                </div>

                <p className="text-gray-400 mb-6">{t('settings.selectLanguage')}</p>

                <LanguageSwitcher variant="settings" />
            </div>
        </div>
    );
};

export default Settings;
