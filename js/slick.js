import { info } from "./info.js";

const information = info;
const layoutMobile = $('.image-slider');

function generateHTML() {
    const generateSlideItem = (index, item) => {
        return `
        <div class="image-item">
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
                        <span class="content">${item.describe_EN}</span>
                    </div>

                    <!-- <div class="quantity">${item.quantity}</div> -->
                    <!-- <div class="social">${item.social}</div> -->
                </div>
                
                <div class="icon">
                    <img class="img-fluid" src="./assets/icons/facebook.svg" alt="facebook" /></a>
                    <img class="img-fluid" src="./assets/icons/youtube.svg" alt="youtube" /></a>
                    <img class="img-fluid" src="./assets/icons/spotify.svg" alt="spotify" /></a>
                </div>
            </div>
        </div>
        `
    }

    information.forEach(function (item, index) {
        layoutMobile.append(generateSlideItem(index, item));
    });

    $('.btnSeeMore').on('click', function () {
        const $this = $(this);

        $this.parents('.image-item').toggleClass('active');

        const contentBox = $this.parents('.contentBox').find('.describe .content')
        const currentContentHeight = contentBox.height();

        if (!$this.parents('.image-item').hasClass('active')) {
            contentBox.parent().css({'max-height': '0', 'top': '3rem',  'opacity': '0'});
        } else {
            contentBox.parent().css({'max-height': `${currentContentHeight}px`, 'top': '0', 'opacity': '1'});
        }


    });
}

generateHTML();

$('.image-slider').slick({
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

let prevSlide = 0;
$('.image-slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    prevSlide = currentSlide;
    return prevSlide;
});

$('.image-slider').on('afterChange', function (event, slick, currentSlide, nextSlide) {
    const $this = $(this);

    if (currentSlide === prevSlide) {
        return;
    }

    const lastSlide = $this.find(`.image-item[data-slick-index="${prevSlide}"]`);

    const contentBox = lastSlide.find('.describe .content')
    const currentContentHeight = contentBox.height();

    lastSlide.removeClass('active');
    if (!lastSlide.hasClass('active')) {
        contentBox.parent().css({'max-height': '0', 'top': '3rem',  'opacity': '0'});
    } else {
        contentBox.parent().css({'max-height': `${currentContentHeight}px`, 'top': '0', 'opacity': '1'});
    }
});