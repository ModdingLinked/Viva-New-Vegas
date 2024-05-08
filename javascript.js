window.addEventListener('resize', sizeChanged);

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
        setTimeout(function () {
            element.style.display = "none";
        }, 20000);
    }
    else {
        element.style.display = "none";
    }
}

document.addEventListener('click', function (event) {
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

function replaceText(node, textToReplace, replacementText) {
    if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = node.textContent.replace(new RegExp(textToReplace, 'g'), replacementText);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        node.childNodes.forEach(childNode => replaceText(childNode, textToReplace, replacementText));
    }
}

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