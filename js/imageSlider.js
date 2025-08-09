document.addEventListener('DOMContentLoaded', () => {
    initializeComparisons();
});

function initializeComparisons() {
    const sliders = document.querySelectorAll('.image-slider');

    sliders.forEach(slider => {
        const handle = slider.querySelector('.comparison-handle');
        const beforeImage = slider.querySelector('.comparison-before');
        const afterImage = slider.querySelector('.comparison-after');
        const select = slider.querySelector('.comparison-select');
        const sliderEl = slider.querySelector('.comparison-slider');
        let isResizing = false;
        let rect;

        // Get the image path from data attribute
        const imagePath = slider.dataset.imagePath;

        // Initialize with first option
        if (select && select.options.length > 0) {
            const firstValue = select.options[0].value;
            beforeImage.src = `${imagePath}/${firstValue} - Before.webp`;
            afterImage.src = `${imagePath}/${firstValue} - After.webp`;
        }

        // Handle image set changes
        if (select) {
            select.addEventListener('change', (e) => {
                const value = e.target.value;
                beforeImage.src = `${imagePath}/${value} - Before.webp`;
                afterImage.src = `${imagePath}/${value} - After.webp`;
                beforeImage.style.clipPath = `polygon(0 0, 50% 0, 50% 100%, 0 100%)`;
                handle.style.left = '50%';
            });
        }

        // Mouse events
        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            rect = sliderEl.getBoundingClientRect();
            // Prevent text selection while dragging
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            handleResize(e.clientX);
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });

        // Touch events
        handle.addEventListener('touchstart', (e) => {
            isResizing = true;
            rect = sliderEl.getBoundingClientRect();
            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            if (!isResizing) return;
            handleResize(e.touches[0].clientX);
        });

        document.addEventListener('touchend', () => {
            isResizing = false;
        });

        // Optimized resize handler
        function handleResize(clientX) {
            const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
            const percent = (x / rect.width) * 100;

            // Use requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                beforeImage.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
                handle.style.left = `${percent}%`;
            });
        }
    });
}