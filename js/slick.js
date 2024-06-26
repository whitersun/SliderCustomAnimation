import { info } from "./info.js";

const information = info;
const layoutMobile = $('.image-slider');

let lastLang;
let lang = localStorage.getItem('selectedLang').toLowerCase() || 'EN'.toLowerCase();

let resizeTimer;

function debounce(func, delay) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(func, delay);
}

generateHTML();

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
}

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

window.addEventListener('resize', function () {
    return debounce(function () {

        const allActive = layoutMobile.find('.image-item.active');
        const allActiveContent = allActive.find('.describe');

        // remove active
        if (this.innerWidth >= 768) {
            allActive.removeClass('active');
            allActiveContent.css({'max-height': '0', 'top': '0',  'opacity': '0'});
        }
    }, 250);
})

slickObj.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    prevSlide = currentSlide;
    return prevSlide;
});

slickObj.on('afterChange', function (event, slick, currentSlide, nextSlide) {
    const $this = $(this);

    if (currentSlide === prevSlide) {
        return;
    }

    const getAllHaveActive = $this.find('.image-item.active');
    const lastSlide = $this.find(`.image-item[data-slick-index="${prevSlide}"]`);

    const activeSlick = $this.find(`.image-item[data-slick-index="${currentSlide}"]`);
    const contentBox = lastSlide.find('.describe .content');

    lastSlide.removeClass('active'); 

    getAllHaveActive.each(function (index, item) {
        // TODO: remove Active

        const $$this = $(this);
        $$this.removeClass('active');
        $$this.find('.describe').animate({'max-height': '0', 'top': '0',  'opacity': '0'}, 'fast');
    });
});