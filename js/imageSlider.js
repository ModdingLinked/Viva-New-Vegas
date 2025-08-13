document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.image-slider').forEach(initUnifiedSlider);
});

function initUnifiedSlider(slider) {
    const imagePath = slider.dataset.imagePath;
    const images = (slider.dataset.images || '').split('|').map(s => s.trim()).filter(Boolean);
    const sets = (slider.dataset.sets || '').split('|').map(s => s.trim()).filter(Boolean);

    const setSelect = slider.querySelector('.comparison-set-select');
    const leftSelect = slider.querySelector('.comparison-select-left');
    const rightSelect = slider.querySelector('.comparison-select-right');
    const beforeImage = slider.querySelector('.comparison-before');
    const afterImage = slider.querySelector('.comparison-after');
    const handle = slider.querySelector('.comparison-handle');
    const sliderEl = slider.querySelector('.comparison-slider');
    const beforeLabel = slider.querySelector('.label-before');
    const afterLabel = slider.querySelector('.label-after');
    let isResizing = false, rect;

    // Populate set select if sets exist
    if (setSelect && sets.length) {
        sets.forEach(set => {
            const opt = document.createElement('option');
            opt.value = set;
            opt.textContent = set;
            setSelect.appendChild(opt);
        });
    }

    // Populate left/right selects if present
    if (leftSelect && rightSelect) {
        [leftSelect, rightSelect].forEach(select => {
            images.forEach(img => {
                const opt = document.createElement('option');
                opt.value = img;
                opt.textContent = img;
                opt.dataset.label = img;
                select.appendChild(opt.cloneNode(true));
            });
        });

        // Set default selections
        leftSelect.selectedIndex = 0;
        rightSelect.selectedIndex = images.length > 1 ? images.length - 1 : 0;
        if (setSelect && sets.length) setSelect.selectedIndex = 0;
    }

    function getImgSrc(imgName) {
        if (setSelect && sets.length) {
            return `${imagePath}/${setSelect.value}/${imgName}.webp`;
        }
        return `${imagePath}/${imgName}.webp`;
    }

    function updateLabels() {
        if (leftSelect && leftSelect.selectedOptions[0]) {
            beforeLabel.textContent = leftSelect.selectedOptions[0].dataset.label;
        } else {
            beforeLabel.textContent = images[0] || '';
        }
        if (rightSelect && rightSelect.selectedOptions[0]) {
            afterLabel.textContent = rightSelect.selectedOptions[0].dataset.label;
        } else {
            afterLabel.textContent = images.length > 1 ? images[images.length - 1] : images[0] || '';
        }
    }

    function updateImages() {
        let leftImg = images[0];
        let rightImg = images.length > 1 ? images[images.length - 1] : images[0];
        if (leftSelect && rightSelect) {
            leftImg = leftSelect.value;
            rightImg = rightSelect.value;
        }
        beforeImage.src = getImgSrc(leftImg);
        afterImage.src = getImgSrc(rightImg);
        updateLabels();
        beforeImage.style.clipPath = `polygon(0 0, 50% 0, 50% 100%, 0 100%)`;
        handle.style.left = '50%';
    }

    // Initial update
    updateImages();

    // Dropdown change events
    if (setSelect) setSelect.addEventListener('change', updateImages);
    if (leftSelect) leftSelect.addEventListener('change', updateImages);
    if (rightSelect) rightSelect.addEventListener('change', updateImages);

    // Drag/touch events
    handle.addEventListener('mousedown', e => {
        isResizing = true;
        rect = sliderEl.getBoundingClientRect();
        e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
        if (!isResizing) return;
        handleResize(e.clientX);
    });
    document.addEventListener('mouseup', () => { isResizing = false; });

    handle.addEventListener('touchstart', e => {
        isResizing = true;
        rect = sliderEl.getBoundingClientRect();
        e.preventDefault();
    });
    document.addEventListener('touchmove', e => {
        if (!isResizing) return;
        handleResize(e.touches[0].clientX);
    });
    document.addEventListener('touchend', () => { isResizing = false; });

    function handleResize(clientX) {
        const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
        const percent = (x / rect.width) * 100;
        requestAnimationFrame(() => {
            beforeImage.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
            handle.style.left = `${percent}%`;
        });
    }
}