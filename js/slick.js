import { info } from "./info.js";

const information = info;
const layoutMobile = $('.image-slider');

function generateHTML() {
    const generateSlideItem = (index, item) => {
        return `
        <div class="image-item">
            <div class="image">
            <img src="${item.imgHeight}" alt="">
            </div>
            <div class="image-content">
                <div class="image-job">
                    <div class="image-jobItem">${item.job}</div>
                    <div class="image-jobItem">${item.jobItem}</div>
                </div>
                <div class="name">${item.name}</div>
                    <div class="quantity">${item.quantity}</div>
                    <div class="social">${item.social}</div>
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