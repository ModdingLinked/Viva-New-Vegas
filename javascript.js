window.addEventListener('resize', sizeChanged);

document.addEventListener('keyup', (e) => {
    if (e.code === "ArrowRight") {
        window.open(document.getElementById("next").href, "_self")
    }
    else if (e.code === "ArrowLeft") {
        window.open(document.getElementById("previous").href, "_self")
    }

});

function sizeChanged() {
    if (document.documentElement.clientWidth > 760) {
        document.getElementById("sideButton").style.marginLeft = "";
        document.getElementById("sidenavLeft").style.width = "";
        document.getElementById("paypalMenu").style.display = "none";
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
        document.getElementById("paypalMenu").style.display = "none";
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

function toggleDonationMenu() {
    if (document.getElementById("paypalMenu").style.display == "none") {
        document.getElementById("paypalMenu").style.display = "block";
    }
    else {
        document.getElementById("paypalMenu").style.display = "none";
    }
}