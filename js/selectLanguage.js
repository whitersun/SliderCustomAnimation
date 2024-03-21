import { languageExport } from "./lang.js";

const lang = languageExport();
const languageDom = [...document.querySelectorAll('.items-laguages')];

const selectedLanguageFunction = () => {
    
    if (lang.toLowerCase() === 'EN'.toLowerCase()) {
        const engEl = languageDom.find((langs) => langs.dataset.lang.toLowerCase() === 'EN'.toLowerCase());
        engEl.classList.add('active_lag');
    }

    return languageDom.forEach((item) => {
        item.addEventListener('click', function () {
            const $this = this;

            if (
                $this.previousElementSibling 
                && $this.previousElementSibling
                    .classList.contains('active_lag')) {
                $this.previousElementSibling.classList.remove('active_lag')
            }

            if (
                $this.nextElementSibling 
                && $this.nextElementSibling
                    .classList.contains('active_lag')) {
                $this.nextElementSibling.classList.remove('active_lag')
            }

            $this.classList.add('active_lag');
            const currentLanugae = $this.dataset.lang.toLowerCase();
            localStorage.setItem('selectedLang', currentLanugae);

            const getLanguageFromLocalStorage = localStorage.getItem('selectedLang');
            const dataTranslateKey  = $('[data-translate-key]');

            const langSelected = getLanguageFromLocalStorage.toUpperCase() === 'EN' ? 'EN' : 'VI';
            const translateInfo = localStorage.getItem('translationsData');

            // Assuming 'translateInfo' is already available

            // Parse translateInfo once, outside the conditional
            const translations = translateInfo ? JSON.parse(translateInfo) : { EN: {}, VI: {} };

            // Select the language data efficiently:
            const langData = translations[langSelected] || {}; 

            dataTranslateKey.each(function () {
                const $this = $(this);
                const key = $this.data('translateKey');
                const value = langData[key]; 
                $this.text(value); 
            });

            return $this;
        });
    });
}

selectedLanguageFunction();

export {
    languageDom
}