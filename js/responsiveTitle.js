document.addEventListener('DOMContentLoaded', function () {
    setupResponsiveElements();
    window.addEventListener('resize', setupResponsiveElements);
});

function setupResponsiveElements() {
    const headerTitle = document.getElementById('headerTitle');
    if (headerTitle) {
        const fullTitle = headerTitle.getAttribute('data-full-title') || headerTitle.textContent;

        const abbreviations = {
            "Viva New Vegas": "VNV",
            "The Best of Times": "TBoT",
            "The Midnight Ride": "TMR",
            "A Dragonborn's Fate": "DBF"
        };

        const shortTitle = abbreviations[fullTitle] || fullTitle.split(' ').map(word => word[0]).join('');

        if (window.innerWidth < 900) {
            if (headerTitle.textContent !== shortTitle) {
                headerTitle.textContent = shortTitle;
                if (!headerTitle.hasAttribute('data-full-title')) {
                    headerTitle.setAttribute('data-full-title', fullTitle);
                }
            }
        } else if (headerTitle.textContent !== fullTitle) {
            headerTitle.textContent = fullTitle;
        }
    }

    const headerLinks = document.getElementById('headerLinks');
    if (headerLinks) {
        const abbreviations = {
            "Viva New Vegas": "VNV",
            "The Best of Times": "TBoT",
            "The Midnight Ride": "TMR",
            "A Dragonborn's Fate": "DBF"
        };

        headerLinks.querySelectorAll('a').forEach(link => {
            const fullText = link.getAttribute('data-full-text') || link.textContent;

            if (!link.hasAttribute('data-full-text')) {
                link.setAttribute('data-full-text', fullText);
            }

            const abbr = abbreviations[fullText] || fullText;

            link.textContent = window.innerWidth < 900 ? abbr : fullText;
        });
    }
}