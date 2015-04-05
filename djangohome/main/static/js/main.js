// global configs
var fps = 30;
var gridw = 60;
var gridh = 60;
var tailsPerApple = 4;
var speedIncreasingRate = 1.05;
var maxSpeed = 1.0;
var width;
var height;
var ctx;

// game states
var latestUpdate;
var tick;
var speed = 0.1;
var snake = null;
var apple = null;
var grids = [];


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
        initState();
        onTick();
    });
    $('#replay').on('click', function() {
        $('.monitor').removeClass('state-gameover').addClass('state-stage');
        ga('send', 'pageview', {'page': '/stage','title': 'Stage'});
        initState();
        onTick();
    });
    $('#left').on('touchstart', function() {
        onLeft();
    });
    $('#right').on('touchstart', function() {
        onRight();
    });
    $(document).on('keydown', function(e) {
        if(e.keyCode == 37) {
            onLeft();
        } else if(e.keyCode == 39) {
            onRight();
        }
    });
}

function onLeft() {
    snake.onCommand('left');
}

function onRight() {
    snake.onCommand('right');
}

function onTick() {
    var now = Date.now();
    var latest = latestUpdate;
    if (now - latest < 1000 / fps) {
        requestAnimationFrame(onTick);
        return;
    }

    if(snake.isDead()) {
        $('.monitor').removeClass('state-stage').addClass('state-gameover');
        ga('send', 'pageview', {'page': '/gameover','title': 'Game Over'});
        tick = 0;
    } else {
        tick++;
        onTick.latestUpdate = now;
        updateState();
        renderStage();
        requestAnimationFrame(onTick);
    }
}

function onResize() {
    var $monitor = $('.monitor');
    width = $monitor.width();
    height = $monitor.height();

    var $canvas = $('canvas');
    $canvas.attr({
        width: width,
        height: height
    });
    ctx = $canvas[0].getContext('2d');
}

function initState() {
    latestUpdate = 0;
    tick = 0;
    speed = 0;
    snake = new Snake();
    grids = [];
    for(var i = 0; i < gridw * gridh; i++) {
        grids[i] = 0;
    }

    deployApple();
}

function updateState() {
    if(tick % Math.floor(1 / speed) === 0) {
        snake.step();
    }
}

function deployApple() {
    while(true) {
        var x = Math.floor(Math.random() * gridw);
        var y = Math.floor(Math.random() * gridh);
        if(grids[x + y * gridw] === 0) {
            grids[x + y * gridw] = 'a';
            apple = {x: x, y: y};
            break;
        }
    }
}

function renderStage() {
    var unitx = width / gridw;
    var unity = height / gridh;

    // clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // draw snake
    ctx.fillStyle = '#00ff31';
    var tails = snake.getTails();
    for(var i = 0; i < tails.length; i++) {
        var tail = tails[i];
        ctx.fillRect(tail.x * unitx + 1, tail.y * unity + 1, unitx - 1, unity - 1);
    }

    // draw apple
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(apple.x * unitx + 1, apple.y * unity + 1, unitx - 1, unity - 1);
}


var Snake = function() {
    var initx = Math.floor(gridw * 0.5);
    var inity = Math.floor(gridh * 0.7);

    this._dir = 'up';
    this._commands = [];
    this._newTails = tailsPerApple;
    this._dead = false;

    this._tails = [{x: initx, y: inity}];
    grids[initx + inity * gridw] = this;
};
Snake.prototype.step = function() {
    // remove or retain tail
    if(this._newTails === 0) {
        var tail = this._tails.splice(this._tails.length - 1, 1)[0];
        grids[tail.x + tail.y * gridw] = 0;
    } else {
        this._newTails--;
    }

    // update direction
    if(this._commands.length) {
        var command = this._commands.splice(0, 1)[0];
        if(command === 'left') {
            if(this._dir === 'up') {
                this._dir = 'left';
            } else if(this._dir === 'right') {
                this._dir = 'up';
            } else if(this._dir === 'bottom') {
                this._dir = 'right';
            } else {
                this._dir = 'bottom';
            }
        } else {
            if(this._dir === 'up') {
                this._dir = 'right';
            } else if(this._dir === 'right') {
                this._dir = 'bottom';
            } else if(this._dir === 'bottom') {
                this._dir = 'left';
            } else {
                this._dir = 'up';
            }
        }
    }

    // add head
    var oldHead = this._tails[0];
    var newHead = {x: oldHead.x, y: oldHead.y};
    if(this._dir === 'up') {
        newHead.y -= 1;
        if(newHead.y < 0) newHead.y = gridh - 1;
    } else if(this._dir === 'left') {
        newHead.x -= 1;
        if(newHead.x < 0) newHead.x = gridw - 1;
    } else if(this._dir === 'right') {
        newHead.x += 1;
        if(newHead.x === gridw) newHead.x = 0;
    } else {
        newHead.y += 1;
        if(newHead.y === gridh) newHead.y = 0;
    }
    this._tails.splice(0, 0, newHead);

    // check collision
    var index = newHead.x + newHead.y * gridw;
    if(grids[index] === 0) {
        grids[index] = this;
    } else if(grids[index] === 'a') {
        grids[index] = this;
        this._newTails += tailsPerApple;
        speed = Math.min(speed * speedIncreasingRate, maxSpeed);
        deployApple();
    } else {
        this._dead = true;
    }
};
Snake.prototype.getTails = function() {
    return this._tails;
};
Snake.prototype.onCommand = function(cmd) {
    this._commands.push(cmd);
};
Snake.prototype.isDead = function() {
    return this._dead;
}