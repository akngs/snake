var fps = 30;

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
        ga('send', 'pageview', {'page': '/gameover','title': 'Game Over'});
        onTick();
    });
}

function onTick() {
    var now = Date.now();
    var latest = onTick.latestUpdate || 0;
    if (now - latest < 1000 / fps) {
        return;
    }
    onTick.latestUpdate = now;

    var dead = true;
    if(dead) {
        $('.monitor').removeClass('state-stage').addClass('state-gameover');
    } else {
        requestAnimationFrame(onTick);
    }
}

function onResize() {
    var $monitor = $('.monitor');
    $('canvas').width($monitor.width()).height($monitor.height());
}
