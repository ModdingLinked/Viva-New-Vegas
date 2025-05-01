// Image overlay

document.addEventListener('DOMContentLoaded', function () {
    createImageHandlers();
});

function createImageHandlers() {
    const imageOverlay  = document.getElementById('image-overlay');
    const enlargedImage = document.getElementById('enlarged-image');
    if (!enlargedImage || !imageOverlay)
        return;

    const images = document.querySelectorAll('.content-img');

    if (!images)
        return;

    images.forEach(image => {
        image.addEventListener('click', function () {
            imageOverlay.style.display = "flex";
            enlargedImage.src = this.src;
        });
    });

    imageOverlay.addEventListener('click', function () {
        imageOverlay.style.display = "none";
        enlargedImage.src = '';
    });
}