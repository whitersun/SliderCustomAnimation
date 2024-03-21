import { info } from "./info.js";
import { languageExport, ObserverTargetEl } from "./lang.js"

const information = info;
const layoutMobile = $('.image-slider');

let lang = languageExport();

function generateHTML() {
    const generateSlideItem = (index, item) => {
        return `
        <div class="image-item" data-class="${item.class}">
            <div class="containerWrapper">
                <img  width="900" height="645" decoding="async" loading="lazy" class="img-fluid" src="${item.imgHeight}" alt="" />
            </div>
            <div class="image-content">
                <div class="contentBox">                
                    <div class="image-job">
                        <div class="image-jobItem">${item.job}</div>
                        ${item.jobItem ? `<div class="image-jobItem">${item.jobItem}</div>` : ''}
                    </div>
                    <div class="name">
                        <span class="artistName">${item.name}</span>
                        <button class="btn btnSeeMore">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/></svg>
                        </button>
                    </div>

                    <div class="divider"></div>
                    <div class="describe">
                        <p class="content">${
                            // default will be english
                            lang.toLowerCase() === ('EN').toLowerCase() ? item.describe_EN  : item.describe_VI
                        }</p>
                    </div>

                    <!-- <div class="quantity">${item.quantity}</div> -->
                    <!-- <div class="social">${item.social}</div> -->
                </div>
                
                <div class="icon">
                        ${item.fblink ? `<a href=${item.fblink} target="_blank"><img decoding="async" loading="lazy" class="img-fluid"" src="./assets/icons/facebook.svg" alt="facebook" /></a>` : ''}
                        ${item.instagram ? `<a href=${item.instagram} target="_blank"><img decoding="async" loading="lazy" class="img-fluid"" src="./assets/icons/instagram.svg" alt="spotify" /></a>` : ''}
                        ${item.ytblink ? `<a href=${item.ytblink} target="_blank"><img decoding="async" loading="lazy" class="img-fluid"" src="./assets/icons/youtube.svg" alt="youtube" /></a>` : ''}
                        ${item.tiktok ? `<a href=${item.tiktok} target="_blank"><img decoding="async" loading="lazy" class="img-fluid"" src="./assets/icons/tiktok.svg" alt="spotify" /></a>` : ''}
                        ${item.splink ? `<a href=${item.splink} target="_blank"><img decoding="async" loading="lazy" class="img-fluid"" src="./assets/icons/spotify.svg" alt="spotify" /></a>` : '' }
                    </div>
            </div>
        </div>
        `
    }

    information.forEach(function (item, index) {
        layoutMobile.append(generateSlideItem(index, item));
    });

    layoutMobile.find('.btnSeeMore').on('click', function () {
        const $this = $(this);

        $this.parents('.image-item').toggleClass('active');

        const contentBox = $this.parents('.contentBox').find('.describe .content')
        const currentContentHeight = contentBox.height();

        if (!$this.parents('.image-item').hasClass('active')) {
            contentBox.parent().css({'max-height': '0', 'top': '0',  'opacity': '0'});
        } else {
            contentBox.parent().css({'max-height': `${currentContentHeight}px`, 'top': '0', 'opacity': '1'});
        }
    });
    // $('.btnSeeMore').on('click', function () {
    //     const $this = $(this);

    //     $this.parents('.image-item').toggleClass('active');

    //     const contentBox = $this.parents('.contentBox').find('.describe .content')
    //     const currentContentHeight = contentBox.height();

    //     if (!$this.parents('.image-item').hasClass('active')) {
    //         contentBox.parent().css({'max-height': '0', 'top': '0',  'opacity': '0'});
    //     } else {
    //         contentBox.parent().css({'max-height': `${currentContentHeight}px`, 'top': '0', 'opacity': '1'});
    //     }
    // });
}

generateHTML();

const slickObj = $('.slideWrapperContainer .image-slider').slick({
    // dots: true,
    // infinite: true,
    slidesToShow: 3,
    speed: 300,
    // autoplay: true,
    // autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: '30px',
    responsive: [
    {
        breakpoint: 980, // tablet breakpoint
        settings: {
            slidesToShow: 3,
            slidesToScroll: 1
        }
    },
    {
        breakpoint: 680, // tablet breakpoint
        settings: {
            slidesToShow: 2,
            slidesToScroll: 1
        }
    },
    {
        breakpoint: 480, // mobile breakpoint
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1
        }
    }
]
});

function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function changeLanguageFunction (newLanguage) {
    const activeSlickHaveItem = slickObj.find('.slick-slide');
    console.log(activeSlickHaveItem)

    
    activeSlickHaveItem.each(function (index, item) {
        const $this = $(this);
        const currentClass = $this.data('class');
        const description = $this.find('.describe .content');
        
        const currentInfo = info.find((item) => item.class === String(currentClass));

        const vietnamese = currentInfo.describe_VI;
        const english = currentInfo.describe_EN;

        if (newLanguage.toLowerCase() === 'EN'.toLowerCase()) {
            description.text(english)
        } else {
            description.text(vietnamese)
        }

        if ($this.hasClass('active')) {
            const heightOfDescription = description.height();
            description.parent().css({'max-height': `${heightOfDescription}px`, 'top': '0', 'opacity': '1'});
        } else {
            description.parent().css({'max-height': '0', 'top': '0',  'opacity': '0'});
        }

    })
}

function setupObserverIfNeeded () {
    if (window.innerWidth < 768) {
        ObserverTargetEl({
            selector: $('.items-laguages'),
            attribute: 'class',
            className: 'active_lag',
            onChange: function (newLang) {
                lang = newLang;
                changeLanguageFunction(newLang);
            }
        })
    }
}

setupObserverIfNeeded();
window.addEventListener('resize', debounce(setupObserverIfNeeded));

let prevSlide = 0;
$('.slideWrapperContainer .image-slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    prevSlide = currentSlide;
    return prevSlide;
});

$('.slideWrapperContainer .image-slider').on('afterChange', function (event, slick, currentSlide, nextSlide) {
    const $this = $(this);

    if (currentSlide === prevSlide) {
        return;
    }

    const lastSlide = $this.find(`.image-item[data-slick-index="${prevSlide}"]`);

    const activeSlick = $this.find(`.image-item[data-slick-index="${currentSlide}"]`);
    const currentClass = activeSlick.data('class');
    
    // TODO: filter info from active slide
    const currentInfo = info.find((item) => item.class === String(currentClass));
    const vietnamese = currentInfo.describe_VI;
    const english = currentInfo.describe_EN;


    const contentBox = lastSlide.find('.describe .content');

    const currentContentBox = activeSlick.find('.describe .content');
    const currentContentHeight = contentBox.height();

    // TODO: translate language
    if (lang.toLowerCase() === 'EN'.toLowerCase()) {
        currentContentBox.text(english)
    } else {
        currentContentBox.text(vietnamese)
    }

    lastSlide.removeClass('active'); 

    if (!lastSlide.hasClass('active')) {
        contentBox.parent().css({'max-height': '0', 'top': '0',  'opacity': '0'});
    } else {
        contentBox.parent().css({'max-height': `${currentContentHeight}px`, 'top': '0', 'opacity': '1'});
    }
});