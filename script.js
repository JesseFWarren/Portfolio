function toggleMenu() {
    var x = document.getElementById("dropdown");
    var bar1 = document.getElementById("bar1");
    var bar2 = document.getElementById("bar2");
    var bar3 = document.getElementById("bar3");
    if (x.className === "dropdown-hide") {
        x.className = "dropdown-show";
        bar1.style.backgroundColor = 'grey';
        bar2.style.backgroundColor = 'grey';
        bar3.style.backgroundColor = 'grey';
        bar1.style.transform = 'rotate(-45deg) translate(-9px, 6px)';
        bar2.style.opacity = '0';
        bar3.style.transform = 'rotate(45deg) translate(-9px, -6px)';
    } else {
        x.className = "dropdown-hide";
        bar1.style.backgroundColor = 'black';
        bar2.style.backgroundColor = 'black';
        bar3.style.backgroundColor = 'black';
        bar1.style.transform = 'none';
        bar2.style.opacity = '1';
        bar3.style.transform = 'none';
    }
}





