import { info } from "./info.js";

const information = info;
const layoutStart = $('.layoutStart');
const layoutEnd   = $('.layoutEnd');

const slideStart = layoutStart.find('.slideWrapper');
const slideEnd = layoutEnd.find('.slideWrapper');


function generateHTML() {
    const generateSlideItem = (index, item) => {
        return `
            <div class="slide-item" data-slide="${index}">
                <div class="dp-content">
                    <div class="job">
                        <div class="jobItem">${item.job}</div>
                        <div class="jobItem">${item.jobItem}</div>
                    </div>
                    <div class="name">${item.name}</div>
                    <div class="quantity">${item.quantity}</div>
                    <div class="social">${item.social}</div>
                    <div class="icon">
                        <img decoding="async" loading="lazy" class="img-fluid" style="filter: invert(1);" src="./assets/icons/facebook.svg" alt="facebook" />
                        <img decoding="async" loading="lazy" class="img-fluid" style="filter: invert(1);" src="./assets/icons/youtube.svg" alt="youtube" />
                        <img decoding="async" loading="lazy" class="img-fluid" style="filter: invert(1);" src="./assets/icons/spotify.svg" alt="spotify" />
                    </div>
                </div>
                <div class="dp-img skeleton">
                    <img
                        width="900"
                        height="645"
                        decoding="async"
                        loading="lazy"
                        class="img-fluid" src="https://source.unsplash.com/random/900x645/?japan-temple?${index}"
                        alt="${item.name}"
                    />
                </div>
            </div>
        `
    }
    
    const generateSlideItemEnd = (index, item) => {
        const zIndex = `z-index: ${information.length - index}`;
        const translateXValues = ['-100', '0', '14']; // Add more values if needed
        const scaleValues = ['0.8', '1', '0.95', '0.89', '0.85']; // Add more values if needed
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
                        src="https://source.unsplash.com/random/900x645/?japan-temple?${index}"
                        alt="${item.name}"
                    />
                </div>
            </div>
        `
    }
    
    information.forEach(function (item, index) {
        slideStart.append(generateSlideItem(index, item));
        slideEnd.append(generateSlideItemEnd(index, item));
    });
}


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
        return loadImage(`https://source.unsplash.com/random/900x645/?japan-temple?${index}`)
            .then((image) => {
                console.log("Image loaded successfully");
                // Do something with the loaded image
                $('.skeleton').removeClass('skeleton');
            })
            .catch((error) => {
                console.error(error);
                // Handle error condition
            });
    })

    Promise.all(imagePromises).then(() => {
        console.log("All images loaded successfully");
        // Run your final action here after all images are loaded

        slideStart.find('.slide-item[data-slide="0"]').addClass('active');
    }).catch((error) => {
        console.error("Error loading images:", error);
        // Handle error condition
    });
}

generateHTML();
LazyLoadingImage();


let increasedIndex = 0;
function ClickToChangeNextSlide(event) {
    event.preventDefault();

    const prevSlide = slideStart.find(`.slide-item[data-slide="${increasedIndex}"]`);
    prevSlide.css('position', 'absolute');

    increasedIndex = (increasedIndex + 1) % information.length;

    const slideEndItems = slideEnd.find('.slide-item');

    const slideConditionalArray = [];
    slideEndItems.each(function(index, item) {
        slideEndItems.eq(increasedIndex).removeClass('active');
        
        let conditional = (index + increasedIndex) % slideEndItems.length;

        slideConditionalArray.push(conditional);

        const zIndex = `z-index: ${slideEndItems.length - index}`;
        const translateXValues = ['-100', '0', '14']; // Add more values if needed
        const translateX = index < translateXValues.length ? translateXValues[index] : index * 9;

        const scaleValues = ['0.5', '1', '0.95', '0.89', '0.85']; // Add more values if needed
        const scale = index < scaleValues.length ? scaleValues[index] : '0.8';
        const transform = `transform: translateX(${translateX}%) scale(${scale})`;

        const style = `${zIndex}; ${transform}`;

        slideEnd.find(`.slide-item[data-slide="${conditional}"]`).attr('style', style);
    });

    console.log('slideConditionalArray: ', slideConditionalArray);
    
    const slideConditional = slideConditionalArray.slice(0, slideConditionalArray.length - 2);
    const slideConditionalTail = [...slideConditionalArray.slice(-2)];

    slideConditionalTail.forEach(function(conditional) {
        slideEnd.find(`.slide-item[data-slide="${conditional}"]`).removeClass('active');
    })
    slideConditional.forEach(function(conditional) {
        slideEnd.find(`.slide-item[data-slide="${conditional}"]`).addClass('active');
    })


    const nextSlide = slideStart.find(`.slide-item[data-slide="${increasedIndex}"]`);
    nextSlide.addClass('active').animate({ position: 'relative', 'z-index': '1' }, function() {
        prevSlide.css('z-index', '0');
        setTimeout(() => {
            prevSlide.removeClass('active');

            $(".slide-item").on("click", ClickToChangeNextSlide);
        }, 1000);
    });

    $(".slide-item").off("click", ClickToChangeNextSlide);
}

$(".slide-item").on("click", ClickToChangeNextSlide);