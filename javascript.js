window.addEventListener('resize', sizeChanged);

document.addEventListener('keydown', (e) => {
    if (e.code === "ArrowRight") {
        window.open(document.getElementById("next").href, "_self")
    }
    else if (e.code === "ArrowLeft") {
        window.open(document.getElementById("previous").href, "_self")
    }
});

function closeAllDonoMenus() {
    var items = document.getElementsByClassName("donoMenu");
    for (var i = 0; i < items.length; i++) {
        if (items[i].style.display == "block") {
            items[i].style.display = "none";
        }
    }
}

function sizeChanged() {
    if (document.documentElement.clientWidth > 760) {
        document.getElementById("sideButton").style.marginLeft = "";
        document.getElementById("sidenavLeft").style.width = "";
        closeAllDonoMenus();
    }
}

function toggleNav() {
    if (document.getElementById("sidenavLeft").style.width == 0) {
        document.getElementById('sideButton').classList.add('pressed');
        document.getElementById("sidenavLeft").style.width = "21.5em";
    }
    else {
        document.getElementById("sidenavLeft").style.width = "";
        document.getElementById('sideButton').classList.remove('pressed');
        closeAllDonoMenus();
    }
}

function titleGlow(enable) {
    if (enable) {
        document.getElementById("title").classList.add("glow");
        document.getElementById("backdrop").classList.add("blur");
    }
    else {
        document.getElementById("title").classList.remove("glow");
        document.getElementById("backdrop").classList.remove("blur");
    }
}

function handleButtonClick(event, element) {
    event.stopPropagation();

    toggleDonationMenu(element);
}

function toggleDonationMenu(element) {
    closeAllDonoMenus();
    if (element.style.display == "none") {
        element.style.display = "block";

        // Close the popup after 20 seconds
        setTimeout(function() {
            element.style.display = "none";
        }, 20000);
    }
    else {
        element.style.display = "none";
    }
}

document.addEventListener('click', function(event) {
    closeAllDonoMenus();
});

function fadeOut(element) {
    element.style.opacity = "0%";
}

function rotate(element, rotation = 180) {
    element.style.transform = 'rotatex(' + rotation + 'deg)';
}

function expandCard(thisObj, $open, $dontReset) {
    const chevron = thisObj.getElementsByClassName("expander-info")[0]
    if ($open.classList.contains('expander-opened') && !$dontReset) {
        chevron.textContent = "Show";
        $open.classList.remove('expander-opened');
        setTimeout(() => $open.style.display = "none", 400);
        thisObj.classList.remove('active');
    }
    else {
        $open.classList.add('expander-opened');
        chevron.textContent = "Hide";
        $open.style.display = "block";
        thisObj.classList.add('active');
    }
}