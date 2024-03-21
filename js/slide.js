import { info } from "./info.js";

const information = info;
const layoutStart = $('.layoutStart');
const layoutEnd   = $('.layoutEnd');

const slideStart = layoutStart.find('.slideWrapper');
const slideEnd = layoutEnd.find('.slideWrapper');
// var defaultTranslateXValues = ['-100', '0', '12', '22', '30', '36'];
const defaultTranslateXValues = ['-100', '0', '14'];

// get data url
// const currentURL = window.location.href;
// const url = new URL(currentURL);
// let lang = url.searchParams.get("lang");

let lang = languageExport();

isDomReady(async function() {
    generateHTML();
    LazyLoadingImage();

    executeClickToChangeNextSlide();
});

function isDomReady(fn) {
    return document.readyState === 'interactive' || document.readyState === 'complete'
        ? setTimeout(fn, 1)
        : document.addEventListener('DOMContentLoaded', fn);
} 


function generateHTML() {
    const generateSlideItem = (index, item) => {
        return `
            <div class="slide-item skeleton" data-class="${item.class}" data-slide="${index}" style="opacity: 1;">
                <div class="dp-content">
                    <div class="contentBox">
                        <div class="job">
                            <div class="jobItem" data-translate-key="slideWrapperContainer_user_job_${index + 1}">${item.job}</div>
                            ${item.jobItem ? `<div class="jobItem" data-translate-key="slideWrapperContainer_user_job_item_${index + 1}">${item.jobItem}</div>` : ''}
                        </div>
                        <div class="name">
                            <span class="artistName" data-translate-key="slideWrapperContainer_artistName_${index + 1}">${item.name}</span>
                            
                            <button class="btn btnSeeMore">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/></svg>
                            </button>
                        </div>
                        
                        <div class="divider"></div>
                        <div class="describe">
                            <p class="content" data-translate-key="slideWrapperContainer_content_${index + 1}">${lang.toLowerCase() === 'EN'.toLowerCase() ? item.describe_EN : item.describe_VI}</p>
                        </div>
                    </div>

                    <div class="icon">
                        ${item.fblink ? `<a href=${item.fblink} target="_blank"><img decoding="async" loading="lazy" class="img-fluid"" src="./assets/icons/facebook.svg" alt="facebook" /></a>` : ''}
                        ${item.instagram ? `<a href=${item.instagram} target="_blank"><img decoding="async" loading="lazy" class="img-fluid"" src="./assets/icons/instagram.svg" alt="spotify" /></a>` : ''}
                        ${item.ytblink ? `<a href=${item.ytblink} target="_blank"><img decoding="async" loading="lazy" class="img-fluid"" src="./assets/icons/youtube.svg" alt="youtube" /></a>` : ''}
                        ${item.tiktok ? `<a href=${item.tiktok} target="_blank"><img decoding="async" loading="lazy" class="img-fluid"" src="./assets/icons/tiktok.svg" alt="spotify" /></a>` : ''}
                        ${item.splink ? `<a href=${item.splink} target="_blank"><img decoding="async" loading="lazy" class="img-fluid"" src="./assets/icons/spotify.svg" alt="spotify" /></a>` : '' }
                    </div>
                </div>
                <div class="dp-img">
                    <img
                        width="900"
                        height="645"
                        decoding="async"
                        loading="lazy"
                        class="img-fluid" src="${item.img}"
                        alt="${item.name}"
                    />
                </div>
            </div>
        `
    }
    
    const generateSlideItemEnd = (index, item) => {
        const zIndex = `z-index: ${information.length - index}`;
        const translateXValues = defaultTranslateXValues; // Add more values if needed
        const scaleValues = ['0.8', '1', '0.95', '0.9', '0.85']; // Add more values if needed
        const translateX = index < translateXValues.length ? translateXValues[index] : index * 9;
        const scale = index < scaleValues.length ? scaleValues[index] : '0.8';
        const transform = `transform: translateX(${translateX}%) scale(${scale})`;
        
        const style = `${zIndex}; ${transform}`;

        return `
            <div class="slide-item ${index > 0 && index <= 5 ? 'active' : ''}" data-slide="${index}"
            style="${style}">
                <div class="view skeleton">
                    <img 
                        width="900"
                        height="645"
                        decoding="async"
                        loading="lazy"
                        class="img-fluid"
                        src="${item.imgHeight}"
                        alt="${item.name}"
                    />
                </div>
            </div>
        `
    }
    
    information.forEach(function (item, index) {
        slideStart.append(generateSlideItem(index, item));
        slideEnd.append(generateSlideItemEnd(index, item));

        slideStart.find('.slide-item').each(function (item, index) {
            const heightOfDescription = $(this).find('.describe .content').height();
        
            $(this).find('.contentBox').css('--height-of-description', `${heightOfDescription + 20}px`);
        });

        slideEnd.find('.slide-item').each(function (item, index) {
            const imagesCache = $(this).find('.view img');
            imagesCache.css('opacity', '0');
        });
    });

    return {
        slideStart: slideStart[0],
        slideEnd: slideEnd[0]
    }
};


// TODO: Lazy load images
function LazyLoadingImage () {
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;
    
            image.onload = () => {
                resolve(image);
            };
    
            image.onerror = () => {
                reject(new Error("Failed to load image"));
            };
        });
    }

    // Usage example:
    const imagePromises = slideStart.find('.slide-item').map(function (index, item) {
        const $this = $(this);
        const imagesCache = $(this).find('.dp-img img');

        return loadImage(imagesCache.attr('src'))
            .then((image) => {
                console.log("Image loaded successfully");
                // Do something with the loaded image
                $this.removeClass('.skeleton').css({ background: 'transparent', opacity: '' });
            })
            .catch((error) => {
                console.error(error);
                // Handle error condition
            });
    })

    return Promise.all(imagePromises).then(() => {
        console.log("All images loaded successfully");
        // Run your final action here after all images are loaded

        $('.skeleton').removeClass('skeleton');

        slideEnd.find('.slide-item').each(function (item, index) {
            const imagesCache = $(this).find('.view img');
            imagesCache.css('opacity', '1');
        });

        slideStart.find('.slide-item[data-slide="0"]').addClass('active canHover');
    
        return {
            slideStart: slideStart[0],
            slideEnd: slideEnd[0]
        }
    }).catch((error) => {
        console.error("Error loading images:", error);
        // Handle error condition

        return error.message
    });
}

let increasedIndex = 0;
function ClickToChangeNextSlide(event) {
    event.preventDefault();

    const prevSlide = slideStart.find(`.slide-item[data-slide="${increasedIndex}"]`);
    // prevSlide.css('position', 'absolute');
    prevSlide.css({'position': 'absolute', 'pointer-events': 'none'});

    increasedIndex = (increasedIndex + 1) % information.length;
    console.log('increasedIndex: ', increasedIndex);

    const slideEndItems = slideEnd.find('.slide-item');

    const slideConditionalArray = [];
    slideEndItems.each(function(index, item) {
        slideEndItems.eq(increasedIndex).removeClass('active');
        
        let conditional = (index + increasedIndex) % slideEndItems.length;

        slideConditionalArray.push(conditional);

        const zIndex = `z-index: ${slideEndItems.length - index}`;
        const translateXValues = defaultTranslateXValues; // Add more values if needed
        const translateX = index < translateXValues.length ? translateXValues[index] : index * 9;

        const scaleValues = ['0.999', '1', '0.95', '0.89', '0.85']; // Add more values if needed
        const scale = index < scaleValues.length ? scaleValues[index] : '0.8';
        const transform = `transform: translateX(${translateX}%) scale(${scale})`;

        const style = `${zIndex}; ${transform}`;

        slideEnd.find(`.slide-item[data-slide="${conditional}"]`).attr('style', style); 
    });

    console.log('slideConditionalArray: ', slideConditionalArray);
    const slideConditionalArrayLength = slideConditionalArray.length;
    
    function slideEndRemoveItems (conditional) {
        slideEndItems.filter(`[data-slide="${conditional}"]`).removeClass('active');
    }

    function slideEndAddItems (conditional) {
        return slideEndItems.filter(`[data-slide="${conditional}"]`).addClass('active')
    }

    slideEndItems.find(`[data-slide="${slideConditionalArray[0]}"]`).removeClass('active');
    if (slideConditionalArrayLength > 5) {
        const slideConditional = slideConditionalArray.slice(1, 5);
        const slideConditionalTail = slideConditionalArray.slice(5);

        slideConditionalTail.forEach((conditional) => slideEndRemoveItems(conditional));
        slideConditional.forEach((conditional) => slideEndAddItems([conditional]));
    } else {
        for (let i = 0; i < slideConditionalArrayLength; i++) {
            const conditional = slideConditionalArray[i];

            if (conditional === increasedIndex) {
                slideEndRemoveItems(conditional);
            }

            if (i === 0) continue;
            slideEndAddItems([conditional]);
        }
    }

    

    const nextSlide = slideStart.find(`.slide-item[data-slide="${increasedIndex}"]`);
    // nextSlide.addClass('active').animate({ position: 'relative', 'z-index': '1' }, function() {
    nextSlide
        .addClass('active')
        .css('pointer-events', 'auto')
        .animate({ 
            position: 'relative', 
            'z-index': '1' 
        },  function() {
            const $this = $(this);

            // const classItem = $this.attr('data-class');
            // const description = $this.find('.contentBox .describe .content');
            // const infoOfClass = info.find((obj) => obj.class === classItem);
            // const english = infoOfClass.describe_EN;
            // const vietnamese = infoOfClass.describe_VI;

            // if (lang === 'EN'.toLowerCase()) description.text(english)
            // else description.text(vietnamese)

            slideStart.find('.slide-item').each(function () {
                const heightOfDescription = $(this).find('.describe .content').height();
            
                $(this).find('.contentBox').css('--height-of-description', `${heightOfDescription + 20}px`);
            });


            // prevSlide.css('z-index', '0');
            prevSlide.css({'z-index': '0'});
            
            setTimeout(() => {
                prevSlide.removeClass('active canHover');
                if(window,innerWidth <= 768)
                    $(".slide-item").on("click", ClickToChangeNextSlide);
                else {
                    slideStart.find(".slide-item").off("click", ClickToChangeNextSlide);
                    slideEnd.find(".slide-item").on("click", ClickToChangeNextSlide);
                }
                afterIconRunAnimation($this.find('.icon'));

            }, 250
        );
    });

    $(".slide-item").off("click", ClickToChangeNextSlide);
}

function afterIconRunAnimation(element) {
    element.on('animationend', function() {
        $(this).parents('.slide-item').addClass('canHover');
        element.off('animationend');
    });
}

function executeClickToChangeNextSlide() {
    $(".slide-item").off("click", ClickToChangeNextSlide);

    debounce(function() {
        if(window.innerWidth <= 768) {
            $(".slide-item").on("click", ClickToChangeNextSlide);
        }
        else {
            slideStart.find(".slide-item").off("click", ClickToChangeNextSlide);
            slideEnd.find(".slide-item").on("click", ClickToChangeNextSlide);
        }
    },250)
}

let resizeTimer;

function debounce(func, delay) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(func, delay);
}