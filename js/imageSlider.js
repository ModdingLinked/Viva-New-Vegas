document.addEventListener('DOMContentLoaded', function () {
    initImageSliders();
});

function initImageSliders() {
    // Initialize regular comparison sliders
    const standardSliders = document.querySelectorAll('.image-slider:not(.custom-comparison-slider)');
    standardSliders.forEach(slider => {
        initStandardSlider(slider);
    });

    // Initialize custom comparison sliders
    const customSliders = document.querySelectorAll('.custom-comparison-slider');
    customSliders.forEach(slider => {
        initCustomComparisonSlider(slider);
    });
}

function initStandardSlider(slider) {
    const imagePairs = {};

    // Get base path from data attribute or use default
    const basePath = slider.dataset.basePath || './img/LOD/Comparison/';

    // Update labels if they exist and data attributes are provided
    const beforeLabelElement = slider.querySelector('.slider-label-before');
    const afterLabelElement = slider.querySelector('.slider-label-after');

    if (beforeLabelElement && slider.dataset.beforeLabel) {
        beforeLabelElement.textContent = slider.dataset.beforeLabel;
    }

    if (afterLabelElement && slider.dataset.afterLabel) {
        afterLabelElement.textContent = slider.dataset.afterLabel;
    }

    // Get options from select dropdown
    const select = slider.querySelector('.slider-select');
    if (!select) {
        console.error('Standard slider is missing select element');
        return;
    }

    // Parse options and create image pairs
    Array.from(select.querySelectorAll('option')).forEach(option => {
        // Support both explicit paths and automatic paths
        if (option.dataset.before && option.dataset.after) {
            // Explicit image paths
            imagePairs[option.value] = {
                before: option.dataset.before,
                after: option.dataset.after
            };
        } else if (option.value.includes('-')) {
            // Automatic path generation (e.g., "comparison-1")
            const comparisonNum = option.value.split('-')[1];
            imagePairs[option.value] = {
                before: `${basePath}${comparisonNum} - Before.webp`,
                after: `${basePath}${comparisonNum} - After.webp`
            };
        }
    });

    // Get DOM elements
    const sliderContainer = slider.querySelector('.slider-container');
    const beforeDiv = slider.querySelector('.slider-before');
    const beforeImg = beforeDiv.querySelector('img');
    const afterImg = slider.querySelector('.slider-after');
    const handle = slider.querySelector('.slider-handle');

    // Initialize state
    let lastPosition = 0.5; // Track position (50% default)
    let currentImagePair = select.value;

    // Preload images for better performance
    preloadImages(imagePairs);

    // Initial setup
    loadImagePair(currentImagePair);

    // Dropdown change handler
    select.addEventListener('change', function () {
        currentImagePair = this.value;
        loadImagePair(currentImagePair);
    });

    setupSliderControls(slider, beforeDiv, beforeImg, afterImg, handle, lastPosition);

    function loadImagePair(value) {
        const pair = imagePairs[value];
        if (!pair) {
            console.error(`No image pair found for value: ${value}`);
            return;
        }

        // Reset slider position before loading images
        resetSliderPosition(sliderContainer, beforeDiv, handle);

        // Set image sources
        beforeImg.src = pair.before;
        afterImg.src = pair.after;

        // Update container height once image is loaded
        afterImg.onload = function () {
            updateContainerHeight(sliderContainer, afterImg);
        };
    }

    function preloadImages(pairs) {
        Object.values(pairs).forEach(pair => {
            const beforePreload = new Image();
            const afterPreload = new Image();
            beforePreload.src = pair.before;
            afterPreload.src = pair.after;
        });
    }
}

function initCustomComparisonSlider(slider) {
    // Get references to key elements
    const leftSelect = slider.querySelector('.slider-left-select');
    const rightSelect = slider.querySelector('.slider-right-select');
    const beforeImg = slider.querySelector('.slider-before img');
    const afterImg = slider.querySelector('.slider-after');
    const beforeLabel = slider.querySelector('.slider-label-before');
    const afterLabel = slider.querySelector('.slider-label-after');
    const sliderContainer = slider.querySelector('.slider-container');
    const beforeDiv = slider.querySelector('.slider-before');
    const handle = slider.querySelector('.slider-handle');

    if (!leftSelect || !rightSelect) {
        console.error('Custom slider is missing select elements');
        return;
    }

    // Get image set data
    let imageSets = {};
    let setSelectData = [];

    // Try to find image set data in the HTML
    const scriptElement = slider.querySelector('script[type="application/json"]');
    if (scriptElement) {
        try {
            setSelectData = JSON.parse(scriptElement.textContent);

            // Build image sets from JSON data
            setSelectData.forEach(set => {
                if (set.images) {
                    imageSets[set.value] = set.images;
                }
            });
        } catch (e) {
            console.error('Error parsing image sets from script tag:', e);
        }
    }

    if (Object.keys(imageSets).length === 0) {
        console.error('No image sets found for custom slider');
        return;
    }

    // Add set selector if it doesn't exist and we have set data
    let setSelect = slider.querySelector('.slider-set-select');
    if (!setSelect && setSelectData.length > 0) {
        const setSelectContainer = document.createElement('div');
        setSelectContainer.style.marginBottom = '15px';

        let setSelectHtml = `
            <label for="set-select" style="display: block; margin-bottom: 5px; color: white;">Image Set:</label>
            <select id="set-select" class="slider-select slider-set-select">
        `;

        setSelectData.forEach(set => {
            setSelectHtml += `<option value="${set.value}">${set.label}</option>`;
        });

        setSelectHtml += `</select>`;
        setSelectContainer.innerHTML = setSelectHtml;

        const selectContainer = slider.querySelector('.slider-select-container');
        if (selectContainer) {
            slider.insertBefore(setSelectContainer, selectContainer);
        } else {
            slider.insertBefore(setSelectContainer, slider.querySelector('.slider-container'));
        }

        setSelect = slider.querySelector('.slider-set-select');
    }

    // Preload all images
    preloadCustomImages(imageSets);

    // Initialize state with defaults or data attributes
    let currentSet = setSelect ? setSelect.value : Object.keys(imageSets)[0];
    let leftOption = slider.dataset.defaultLeft || leftSelect.value;
    let rightOption = slider.dataset.defaultRight || rightSelect.value;
    let lastPosition = 0.5;

    // Set initial selected options
    leftSelect.value = leftOption;
    rightSelect.value = rightOption;

    // Set initial image sources immediately
    if (beforeImg.src === '' && afterImg.src === '') {
        const initialSet = currentSet;
        const initialLeftOption = leftOption;
        const initialRightOption = rightOption;

        if (imageSets[initialSet] && imageSets[initialSet][initialLeftOption] && imageSets[initialSet][initialRightOption]) {
            beforeImg.src = imageSets[initialSet][initialLeftOption];
            afterImg.src = imageSets[initialSet][initialRightOption];
        } else {
            console.error('Unable to set initial images: invalid set or options');
        }
    }

    // Update labels immediately
    updateLabels();

    // Initial setup
    updateImages();

    // Update images based on current selections
    function updateImages() {
        if (!imageSets[currentSet]) {
            console.error(`No image set found with ID: ${currentSet}`);
            return;
        }

        const leftSrc = imageSets[currentSet][leftOption];
        const rightSrc = imageSets[currentSet][rightOption];

        if (!leftSrc) {
            console.error(`No image found for left option: ${leftOption} in set: ${currentSet}`);
            return;
        }

        if (!rightSrc) {
            console.error(`No image found for right option: ${rightOption} in set: ${currentSet}`);
            return;
        }

        beforeImg.src = leftSrc;
        afterImg.src = rightSrc;

        // Update container height once image is loaded
        afterImg.onload = function () {
            updateContainerHeight(sliderContainer, afterImg);
        };

        // Update labels
        updateLabels();

        // Reset slider position when changing images
        resetSliderPosition(sliderContainer, beforeDiv, handle);
    }

    function updateLabels() {
        if (beforeLabel && leftSelect.selectedIndex >= 0) {
            beforeLabel.textContent = leftSelect.options[leftSelect.selectedIndex].textContent;
        }
        if (afterLabel && rightSelect.selectedIndex >= 0) {
            afterLabel.textContent = rightSelect.options[rightSelect.selectedIndex].textContent;
        }
    }

    // Event listeners
    if (setSelect) {
        setSelect.addEventListener('change', function () {
            currentSet = this.value;
            updateImages();
        });
    }

    leftSelect.addEventListener('change', function () {
        leftOption = this.value;
        updateImages();
    });

    rightSelect.addEventListener('change', function () {
        rightOption = this.value;
        updateImages();
    });

    setupSliderControls(slider, beforeDiv, beforeImg, afterImg, handle, lastPosition);

    function preloadCustomImages(sets) {
        Object.values(sets).forEach(set => {
            Object.values(set).forEach(url => {
                const img = new Image();
                img.src = url;
            });
        });
    }
}

// Shared functions

function updateContainerHeight(container, image) {
    if (image.complete && image.naturalWidth) {
        const aspectRatio = image.naturalHeight / image.naturalWidth;
        container.style.height = (container.offsetWidth * aspectRatio) + 'px';
    }
}

function resetSliderPosition(sliderContainer, beforeDiv, handle) {
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

    // Force browser to apply changes immediately
    void beforeDiv.offsetWidth;

    // Remove the transition properties after a short delay
    setTimeout(() => {
        beforeDiv.style.transition = '';
        handle.style.transition = '';
    }, 50);
}

function setupSliderControls(slider, beforeDiv, beforeImg, afterImg, handle, initialPosition) {
    const sliderContainer = slider.querySelector('.slider-container');
    let isDragging = false;
    let animationFrame = null;
    let lastPosition = initialPosition || 0.5;

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

    // Prevent dragging of images
    sliderContainer.addEventListener('dragstart', e => e.preventDefault());
    beforeImg.addEventListener('dragstart', e => e.preventDefault());
    afterImg.addEventListener('dragstart', e => e.preventDefault());

    // Window resize
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            if (afterImg.complete) {
                updateContainerHeight(sliderContainer, afterImg);

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