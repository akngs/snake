var fps = 30;
var gridw = 60;
var gridh = 60;


function main() {
    onResize();

    $(window).on('resize', function() {
        onResize();
    });

    $('#play').on('click', function() {
        $('.monitor').removeClass('state-intro').addClass('state-help');
        ga('send', 'pageview', {'page': '/help','title': 'Help'});
    });
    $('#ok').on('click', function() {
        $('.monitor').removeClass('state-help').addClass('state-stage');
        ga('send', 'pageview', {'page': '/stage','title': 'Stage'});
        onTick();
    });
    $('#replay').on('click', function() {
        $('.monitor').removeClass('state-gameover').addClass('state-stage');
        ga('send', 'pageview', {'page': '/stage','title': 'Stage'});
        onTick();
    });
}

function onTick() {
    var now = Date.now();
    var latest = onTick.latestUpdate || 0;
    if (now - latest < 1000 / fps) {
        requestAnimationFrame(onTick);
        return;
    }

    var dead = onTick.tick > 30;
    if(dead) {
        $('.monitor').removeClass('state-stage').addClass('state-gameover');
        ga('send', 'pageview', {'page': '/gameover','title': 'Game Over'});
        onTick.tick = 0;
    } else {
        if(!onTick.tick) onTick.tick = 0;
        onTick.tick++;
        onTick.latestUpdate = now;
        requestAnimationFrame(onTick);
    }
}

function onResize() {
    var $monitor = $('.monitor');
    var width = $monitor.width();
    var height = $monitor.height();
    $('canvas').width(width).height(height);
}


var Snake = function(x, y, l) {
    this._x = x;
    this._y = y;
    this._l = l;
};
Snake.prototype.render = function(canvas, w, h) {

};