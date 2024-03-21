let globalObserver = null;
let currentOnChange = null;

const url = window.location.href;
const getParams = getUrlAndTakeParams(url);
const getLanguageObject = getParams.find(param => param.key === 'lang');
let lang = getLanguageObject ? getLanguageObject.value : 'EN';

localStorage.setItem('selectedLang', getLanguageObject ? getLanguageObject.value : 'EN');

const languageExport = () => lang.toLowerCase();


function getUrlAndTakeParams (url) {
    const arr = [];
    const urlConvert = new URLSearchParams(url);

    for (const key of urlConvert.keys()) {
        const value = urlConvert.get(key);

        function conditionalForSplit (keyValue) {
            if (keyValue.split('?').length > 1) {
                const keySplit = key.split('?');
                const keySplitValue = keySplit[1];
                return keySplitValue;
            } else {
                return keyValue.split('?')[0]
            }
        }

        arr.push({
            key: conditionalForSplit(key),
            value: value
        })
    };

    return arr;
}

function ObserverTargetEl (props) {
    const { selector, attribute, className, onChange } = props;

    if (!selector) {
        throw new Error('You are missing selector'); // Better to throw an Error
    }

    if (globalObserver) {
        console.log(onChange)
        currentOnChange = onChange;
        return;
    }

    globalObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === (attribute ? attribute : 'class')) {
                if (className && mutation.target.classList.contains(className)) {
                    const $this = mutation.target;
                    const selectedLang = $this.dataset.lang.toLowerCase();

                    lang = selectedLang;
                    localStorage.setItem('selectedLang', selectedLang);
                    currentOnChange?.(selectedLang);
                }
            }
        });
    });

    function singleObserve () {
        globalObserver.observe(selector, { attributes: true });
        currentOnChange = onChange;
    }

    return Array.isArray(selector) || selector.hasOwnProperty('length')
        ? Array.from(selector).forEach((item) => {
            globalObserver.observe(item, { attributes: true });
            currentOnChange = onChange;
        }) : singleObserve();
}

function resetOrReconfigureObserver() {
    if (globalObserver) {
        // Decide if you want to fully reset or reconfigure the observer
        globalObserver.disconnect(); 
        globalObserver = null;
    }
}

export {
    languageExport,
    getUrlAndTakeParams,
    ObserverTargetEl,
    resetOrReconfigureObserver
}
