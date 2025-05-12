document.addEventListener('DOMContentLoaded', function () {
    initImageSliders();
});

function initImageSliders() {
    const imagePairs = {};
    const basePath = './img/LOD/Comparison/';

    // Get sliders and options
    document.querySelectorAll('.slider-select').forEach(select => {
        const options = Array.from(select.querySelectorAll('option'))
            .filter(option => option.value.startsWith('comparison-'));

        // Create image pairs
        options.forEach(option => {
            const comparisonNum = option.value.split('-')[1];
            if (!imagePairs[option.value]) {
                imagePairs[option.value] = {
                    before: `${basePath}${comparisonNum} - Before.webp`,
                    after: `${basePath}${comparisonNum} - After.webp`
                };
            }
        });
    });

    // Find all slider containers
    const sliders = document.querySelectorAll('.image-slider');

    sliders.forEach(slider => {
        const select = slider.querySelector('.slider-select');
        const sliderContainer = slider.querySelector('.slider-container');
        const beforeDiv = slider.querySelector('.slider-before');
        const beforeImg = beforeDiv.querySelector('img');
        const afterImg = slider.querySelector('.slider-after');
        const handle = slider.querySelector('.slider-handle');

        let lastPosition = 0.5; // Track position (50% default)

        // Initial setup
        loadImagePair(select.value);

        // Dropdown
        select.addEventListener('change', function () {
            loadImagePair(this.value);
        });

        setupSlider();

        function loadImagePair(value) {
            const pair = imagePairs[value];
            if (!pair) return;

            // Reset slider position before loading images
            resetSliderPosition();

            // Set image sources
            beforeImg.src = pair.before;
            afterImg.src = pair.after;
        }

        function resetSliderPosition() {
            const middlePosition = 0.5; // 50%
            const containerWidth = sliderContainer.offsetWidth;

            // Apply all position changes at once to avoid stutter
            Object.assign(beforeDiv.style, {
                width: '50%',
                transition: 'none'
            });

            Object.assign(handle.style, {
                left: '0',
                transform: `translateX(${middlePosition * containerWidth}px) translateX(-50%)`,
                transition: 'none'
            });

            lastPosition = 0.5;

            // Force browser to apply changes immediately
            void beforeDiv.offsetWidth;

            // Remove the transition properties after a short delay
            setTimeout(() => {
                beforeDiv.style.transition = '';
                handle.style.transition = '';
            }, 50);
        }

        // Setup slider interaction
        function setupSlider() {
            let isDragging = false;
            let animationFrame = null;

            // Update slider position
            function updateSliderPosition(clientX) {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }

                animationFrame = requestAnimationFrame(() => {
                    const rect = sliderContainer.getBoundingClientRect();
                    let position = (clientX - rect.left) / rect.width;
                    position = Math.max(0, Math.min(1, position));

                    if (Math.abs(position - lastPosition) > 0.001) {
                        lastPosition = position;
                        beforeDiv.style.width = (position * 100) + '%';
                        handle.style.transform = `translateX(${position * sliderContainer.offsetWidth}px) translateX(-50%)`;
                        handle.style.left = '0';

                        const containerWidth = sliderContainer.offsetWidth;
                        beforeImg.style.width = `${containerWidth}px`;
                        beforeImg.style.maxWidth = 'none';

                        const beforeImgRightPosition = containerWidth * (1 - position);
                        if (window.innerWidth <= 470) {
                            beforeImg.style.width = `${containerWidth}px`;
                            beforeImg.style.left = '0';
                        }
                    }
                });
            }

            // Mouse events
            sliderContainer.addEventListener('mousedown', function (e) {
                e.preventDefault();
                isDragging = true;
                updateSliderPosition(e.clientX);
            });

            handle.addEventListener('mousedown', function (e) {
                e.preventDefault();
                e.stopPropagation();
                isDragging = true;
            });

            document.addEventListener('pointermove', function (e) {
                if (!isDragging) return;
                e.preventDefault();
                updateSliderPosition(e.clientX);
            });

            document.addEventListener('pointerup', function () {
                isDragging = false;
            });

            // Touch events
            sliderContainer.addEventListener('touchstart', function (e) {
                e.preventDefault();
                isDragging = true;
                updateSliderPosition(e.touches[0].clientX);
            }, { passive: false });

            handle.addEventListener('touchstart', function (e) {
                e.preventDefault();
                isDragging = true;
            }, { passive: false });

            document.addEventListener('touchmove', function (e) {
                if (!isDragging) return;
                e.preventDefault();
                updateSliderPosition(e.touches[0].clientX);
            }, { passive: false });

            document.addEventListener('touchend', function () {
                isDragging = false;
            });

            sliderContainer.addEventListener('dragstart', e => e.preventDefault());
            beforeImg.addEventListener('dragstart', e => e.preventDefault());
            afterImg.addEventListener('dragstart', e => e.preventDefault());

            // Window resize
            let resizeTimeout;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function () {
                    if (afterImg.complete) {
                        const aspectRatio = afterImg.naturalHeight / afterImg.naturalWidth;
                        sliderContainer.style.height = (sliderContainer.offsetWidth * aspectRatio) + 'px';

                        // Make sure image width is always correct on resize
                        const containerWidth = sliderContainer.offsetWidth;
                        beforeImg.style.width = `${containerWidth}px`;
                        beforeImg.style.maxWidth = 'none';

                        // Update handle position on resize
                        handle.style.transform = `translateX(${lastPosition * containerWidth}px) translateX(-50%)`;
                    }
                }, 100);
            });

            // Set initial width and make sure maxWidth doesn't interfere
            beforeImg.style.width = sliderContainer.offsetWidth + 'px';
            beforeImg.style.maxWidth = 'none';
        }
    });
}