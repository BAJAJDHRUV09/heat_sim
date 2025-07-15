var MainSketch = function(mc) {
    // Responsive canvas sizing
    if (window.innerWidth <= 991) {
        mc.cwidth = window.innerWidth;
        // Use a reasonable height for mobile, e.g., 40% of viewport height
        mc.cheight = Math.max(window.innerHeight * 0.4, 220);
    } else {
        mc.cwidth = window.innerWidth > 1100 ? window.innerWidth * 57 / 100 : window.innerWidth;
        mc.cheight = window.innerWidth > 1100 ? window.innerHeight - (100) : window.innerHeight - window.innerHeight/2;
    }

    mc.origin = {
        x : mc.cwidth / 2,
        y : mc.cheight / 2
    };
}

var MainCanvas = new p5(MainSketch, "p5Container");

export {
    MainCanvas
}