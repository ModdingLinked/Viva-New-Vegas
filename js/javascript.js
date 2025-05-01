
var menuIsOpen = false;

// Global variables
const progressBars  = document.getElementsByClassName("progress-bar");
const sections      = document.getElementsByClassName("section");
const sidebars      = document.getElementsByClassName("sidebar");
const leftSideBar   = document.getElementsByClassName("left-sidebar");
const autoSizeAreas = document.querySelectorAll('.auto-resize');

window.addEventListener('resize', sizeChanged);
document.addEventListener('DOMContentLoaded', function () {
    updateProgressBarAndFadeIn();
    createRightSidebar();
    markActivePage();
    resizeAllTextAreas();
});
window.onscroll = updateProgressBarAndFadeIn;

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiCodeIndex = 0;

document.addEventListener('keydown', (e) => {
    if (konamiCodeIndex > 1) {
        return;
    }

    if (e.code === "ArrowRight") {
        window.open(document.getElementById("next").href, "_self")
    }
    else if (e.code === "ArrowLeft") {
        window.open(document.getElementById("previous").href, "_self")
    }
});

function sizeChanged() {
    if (leftSideBar && leftSideBar.length > 0) {
        if (document.documentElement.clientWidth > 760) {
            leftSideBar[0].style.width = "";
        }
    }

    resizeAllTextAreas();
}

function toggleNav() {
    var sideBar = leftSideBar[0];
    if (sideBar.style.width == 0) {
        sideBar.style.width = "75%";
        globalThis.menuIsOpen = true;
    }
    else {
        sideBar.style.width = "";
        globalThis.menuIsOpen = false;
    }
}

function fadeOut(element) {
    element.style.opacity = "0%";
}

function rotate(element, rotation = 180) {
    element.style.transform = 'rotatex(' + rotation + 'deg)';
}

function expandCard(thisObj, $open, $dontReset) {
    const chevron = thisObj.getElementsByClassName("chevron")[0]
    if ($open.classList.contains('expander-opened') && !$dontReset) {
        rotate(chevron, 0)
        $open.classList.remove('expander-opened');
        setTimeout(() => $open.style.display = "none", 400);
        thisObj.classList.remove('active');
    }
    else {
        $open.classList.add('expander-opened');
        rotate(chevron, 180);
        $open.style.display = "block";
        thisObj.classList.add('active');

        const textareas = $open.querySelectorAll('.auto-resize');
        if (textareas) {
            for (var i = 0; i < textareas.length; i++) {
                autoResize(textareas[i]);
            }
        }
    }
}

function resizeAllTextAreas() {
    if (autoSizeAreas && autoSizeAreas.length > 0) {
        for (var i = 0; i < autoSizeAreas.length; i++) {
            autoResize(autoSizeAreas[i]);
        }
    }
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function emToPixels(em) {
    const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return em * baseFontSize;
}

function updateProgressBarAndFadeIn() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = window.innerHeight;

    if (sections) {
        for (var i = 0; i < sections.length; i++) {
            var sectionTop = sections[i].getBoundingClientRect().top;
            var sectionHeight = sections[i].clientHeight;

            if (sectionTop < height && sectionTop + sectionHeight > 0) {
                sections[i].classList.add("fade-in");
            }
        }
    }

    var progressBar = progressBars[0];
    if (progressBar) {
        height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scroll = (winScroll / height);
        var bottomMargin = (height - 25) / height;
        progressBar.style.width = scroll * 100 + "%";
    }


    if (sidebars) {
        var styleVal = "calc(100vh - 6.25em)";

        if (document.documentElement.clientHeight > 900 && scroll > bottomMargin) {
            styleVal = "calc(100vh - 8.5em)";
        }

        for (var i = 0; i < sidebars.length; i++) {
            sidebars[i].style.height = styleVal;
        }
    }
}

function createRightSidebar() {
    const content = document.getElementsByClassName('content')[0];
    if (!content) return;

    const sections = content.getElementsByClassName('section');
    if (!sections) return;

    const sidebarContent = document.getElementById('sidebarContent');
    if (!sidebarContent) return;

    // Create fragment for batch updates
    const fragment = document.createDocumentFragment();

    for (const section of sections) {
        // Get only direct children and sort them
        const elements = [
            ...section.children
        ].filter(el => 
            (el.classList.contains('card') || el.classList.contains('expander-top')) &&
            el.parentNode === section
        ).sort((a, b) =>
            a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );

        // Process headers within each section
        section.querySelectorAll('h2').forEach(header => {
            if (!header.innerHTML) return;

            const sectionDiv = document.createElement('div');

            // Create header elements
            const bold = document.createElement('b');
            const separator = Object.assign(document.createElement('a'), {
                href: `#${section.id}`,
                textContent: header.innerHTML
            });
            bold.appendChild(separator);
            sectionDiv.appendChild(bold);

            // Add all elements for this section
            elements.forEach(element => {
                const text = element.getAttribute('title') ||
                    element.id.replace(/([A-Z])/g, ' $1').trim();

                if (!text) return;

                sectionDiv.appendChild(Object.assign(document.createElement('a'), {
                    href: `#${element.id}`,
                    textContent: text
                }));
            });

            fragment.appendChild(sectionDiv);
        });
    }

    sidebarContent.appendChild(fragment);
}

function markActivePage() {
    const leftSidebar = document.querySelector(".sidebar.left-sidebar");

    if (!leftSidebar)
        return;

    const sidebarLinks = leftSidebar.querySelectorAll(".sidebar a");

    if (!sidebarLinks)
        return;

    const currentPage = "./" + window.location.pathname.split("/").pop();

    let currentIndex = -1;

    // Loop through the links to find the current page index
    sidebarLinks.forEach((link, index) => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
            currentIndex = index;

            if (link.classList.contains("sublink")) {
                link.setAttribute('style', 'display:flex !important');
            }
        }
    });

    const allowedPageLinks = leftSidebar.querySelectorAll(".pageLinks");
    if (allowedPageLinks) {
        let linkCount = 0;

        for (let i = 0; i < allowedPageLinks.length; i++) {
            linkCount += allowedPageLinks[i].children.length;
        }

        if (currentIndex > linkCount - 1)
            currentIndex = -1;

        createPageArrows(currentIndex);
    }
}

function createPageArrows(currentIndex) {
    const linkSections = document.querySelectorAll(".pageLinks");

    if (!linkSections)
        return;

    const prevLink = document.getElementById("previous");
    const nextLink = document.getElementById("next");

    let sidebarLinks = [];

    for (let i = 0; i < linkSections.length; i++) {
        var list = linkSections[i].querySelectorAll(".sidebar a");
        for (let j = 0; j < list.length; j++) {
            sidebarLinks.push(list[j]);
        }
    }

    // Set the previous and next links if the current page is found
    // Otherwise default to the home page
    if (currentIndex !== -1) {
        if (prevLink) {
            if (currentIndex > 0) {
                const prevPage = sidebarLinks[currentIndex - 1];
                prevLink.href = prevPage.getAttribute("href");
                prevLink.querySelector(".arrowText").textContent = prevPage.textContent.trim();
            } else {
                prevLink.style.display = "none";
            }
        }

        if (nextLink) {
            if (currentIndex < sidebarLinks.length - 1) {
                const nextPage = sidebarLinks[currentIndex + 1];
                nextLink.href = nextPage.getAttribute("href");
                nextLink.querySelector(".arrowText").textContent = nextPage.textContent.trim();
            } else {
                nextLink.style.display = "none";
            }
        }
    }
    else if (prevLink) {
        console.log("Current page not found in sidebar links");
        const prevPage = sidebarLinks[0];
        prevLink.href = prevPage.getAttribute("href");
        prevLink.querySelector(".arrowText").textContent = prevPage.textContent.trim();
    }
}

function isChildOfSidebar(element) {
    while (element) {
        if (element.classList && element.classList.contains('sidebar') && element.classList.contains('left-sidebar')) {
            return true;
        }
        element = element.parentElement;
    }
    return false;
}

document.addEventListener('click', function (event) {
    if (globalThis.menuIsOpen) {
        const target = event.target;
        if (target.id != "navButton" && isChildOfSidebar(target) == false) {
            toggleNav();
        }
    }
});

// Keylogger by yours truly
document.addEventListener('keydown', function (event) {
    if (event.key === konamiCode[konamiCodeIndex]) {
        konamiCodeIndex++;

        if (konamiCodeIndex === konamiCode.length) {
            const konamiEvent = new Event('konamiCodeEntered');
            document.dispatchEvent(konamiEvent);

            konamiCodeIndex = 0;
        }
    } else {
        konamiCodeIndex = 0;
    }
});

function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onload = function () {
        if (callback) callback();
    };

    document.head.appendChild(script);
}

function loadConfigScript() {
    var configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.textContent = atob("KGZ1bmN0aW9uIChjZmcpIHsgQnJvd3NlclBvbmllcy5zZXRCYXNlVXJsKGNmZy5iYXNldXJsKTsgQnJvd3NlclBvbmllcy5sb2FkQ29uZmlnKEJyb3dzZXJQb25pZXNCYXNlQ29uZmlnKTsgQnJvd3NlclBvbmllcy5sb2FkQ29uZmlnKGNmZyk7IH0pKHsgImJhc2V1cmwiOiAiaHR0cHM6Ly9icm93c2VyLnBvbnkuaG91c2UvIiwgImZhZGVEdXJhdGlvbiI6IDUwMCwgInZvbHVtZSI6IDEsICJmcHMiOiAyNSwgInNwZWVkIjogMywgImF1ZGlvRW5hYmxlZCI6IGZhbHNlLCAiZG9udFNwZWFrIjogdHJ1ZSwgInNob3dGcHMiOiBmYWxzZSwgInNob3dMb2FkUHJvZ3Jlc3MiOiB0cnVlLCAic3BlYWtQcm9iYWJpbGl0eSI6IDAuMSwgInNwYXduIjogeyAidHJpeGllIjogMSB9LCAiYXV0b3N0YXJ0IjogdHJ1ZSB9KTs");
    document.head.appendChild(configScript);
}


// Boredom is a dangerous thing
function konamiEventHandler() {
    const a = atob("aHR0cHM6Ly9icm93c2VyLnBvbnkuaG91c2UvanMvcG9ueWJhc2UuanM");
    const b = atob("aHR0cHM6Ly9icm93c2VyLnBvbnkuaG91c2UvanMvYnJvd3NlcnBvbmllcy5qcw");
    loadScript(a, function () {
        loadScript(b, function () {
            loadConfigScript();
        });
    });
}

document.addEventListener('konamiCodeEntered', konamiEventHandler);