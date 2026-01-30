import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ variant = 'minimal' }) => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    if (variant === 'settings') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['en', 'hi', 'te'].map((lang) => (
                    <button
                        key={lang}
                        onClick={() => changeLanguage(lang)}
                        className={`p-4 rounded-xl border text-left transition-all ${i18n.language === lang
                            ? 'bg-[#00E676]/10 border-[#00E676] text-white'
                            : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'
                            }`}
                    >
                        <span className="font-bold">{t(`settings.languages.${lang}`)}</span>
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm p-1 rounded-lg border border-white/10">
            {['en', 'hi', 'te'].map((lang) => (
                <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${i18n.language === lang
                            ? 'bg-[#00E676] text-black'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
