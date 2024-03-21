const arr = [];

// Touch
const carousel = document.querySelector(".carousel");
const firstImg = carousel.querySelectorAll("img")[0];
const arrowIcons = document.querySelectorAll(".wrapper i");

let isDragStart = false
let isDragging = false
let prevPageX
let prevScrollLeft
let positionDiff;

const getUrlAndTakeParams = () => {
    const url = window.location.href;
    const urlConvert = new URL(url);
    console.log("urlConvert: ", urlConvert);
}

getUrlAndTakeParams();

const showHideIcons = () => {
    // showing and hiding prev/next icon according to carousel scroll left value
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth; // getting max scrollable width
    arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
    arrowIcons[1].style.display = carousel.scrollLeft == scrollWidth ? "none" : "block";
}

const autoSlide = () => {
    // if there is no image left to scroll then return from here
    if(carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 || carousel.scrollLeft <= 0) return;

    positionDiff = Math.abs(positionDiff); // making positionDiff value to positive
    let firstImgWidth;
    if(screen.width == 375)
        firstImgWidth = firstImg.clientWidth + 20;
    else
        firstImgWidth = firstImg.clientWidth + 10;
    // getting difference value that needs to add or reduce from carousel left to take middle img center
    let valDifference = firstImgWidth - positionDiff;

    if(carousel.scrollLeft > prevScrollLeft) { // if user is scrolling to the right
        return carousel.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
    }
    // if user is scrolling to the left
    carousel.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
}

const dragStart = (e) => {
    // updating global variables value on mouse down event
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    // scrolling images/carousel to left according to mouse pointer
    if(!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    showHideIcons();
}

const dragStop = () => {
    isDragStart = false;
    carousel.classList.remove("dragging");

    if(!isDragging) return;
    isDragging = false;
    autoSlide();
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);

$("#dp-slider .dp_item").on("click", function () {
    if ($(this).index() > 0) {
        $("#dp-slider .dp_item:first-child").hide().appendTo("#dp-slider").fadeIn(function () {
            console.log($(this));

            setTimeout(() => {
                $.each($('.dp_item'), function (index, dp_item) {
                    $(dp_item).attr('data-position', index + 1);
                    // 
                    var get_slide = $(this).attr('data-class');
                    get_slide = Number(get_slide);
                    var imgPath = "./assets/images/S" + Number(get_slide) + ".jpg";
                    $('.img-fluid-default').attr('src', imgPath)
                });
            }, 1000);
        });
    }

    // const $this = $(this);

    // $("#dp-slider .dp_item:first-child").hide().appendTo("#dp-slider").fadeIn();

    // $.each($('.dp_item'), function (index, dp_item) {
    //     $(dp_item).attr('data-position', index + 1);
    //     // 
    //     var get_slide = $(this).attr('data-class');
    //     get_slide = Number(get_slide);
    //     var imgPath = "./assets/images/S" + Number(get_slide) + ".jpg";
    //     $('.img-fluid-default').attr('src', imgPath)
    // });
});
