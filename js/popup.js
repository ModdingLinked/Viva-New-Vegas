var lastPopupWindow = null;
var lastPopupButton = null;

function openPopup(thisObj, $target) {
    const rect = thisObj.getBoundingClientRect();
    var popup = $target;

    const isVisible = popup.classList.contains('show');
    if (!isVisible) {
        popup.style.top = `${rect.top}` - emToPixels(2) + "px";
        popup.style.left = `${rect.right}px`;
        popup.style.display = 'block';
        requestAnimationFrame(() => popup.classList.add('show'));
    } else {
        popup.classList.remove('show');
        setTimeout(() => (popup.style.display = 'none'), 200);
    }

    lastPopupWindow = $target;
    lastPopupButton = thisObj;
};

document.addEventListener('click', (e) => {
    if (lastPopupWindow && !lastPopupWindow.contains(e.target) && !lastPopupButton.contains(e.target)) {
        lastPopupWindow.classList.remove('show');
        setTimeout(() => (lastPopupWindow.style.display = 'none', lastPopupWindow = null), 200);
    }
});

window.addEventListener('scroll', () => {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.classList.remove('show');
        setTimeout(() => (popup.style.display = 'none'), 200);
    });
}, true);