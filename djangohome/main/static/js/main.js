// global configs
var fps = 30;
var gridw = 30;
var gridh = 30;
var tailsPerApple = 3;
var initialSpeed = 0.15;
var speedIncreasing = 0.003;
var maxSpeed = 0.8;
var width;
var height;
var ctx;

// game states
var latestUpdate;
var tick;
var snake;
var enemy;
var enemyAi;
var apple;
var appleAppearedAt;
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
    if (now - latestUpdate < 1000 / fps) {
        requestAnimationFrame(onTick);
        return;
    }

    if(snake.isDead()) {
        $('.monitor').removeClass('state-stage').addClass('state-gameover');
        ga('send', 'pageview', {'page': '/gameover', 'title': 'Game Over'});
        tick = 0;
    } else {
        tick++;
        onTick.latestUpdate = now;
        updateState();
        renderStage();
        requestAnimationFrame(onTick);
    }

    if(!enemy && Math.random() > 0.99) {
        deployEnemy();
    } else if(enemy && enemy.isDead()) {
        snake.increaseScore(enemy.getScore());

        enemy.remove();
        enemy = null;
        enemyAi = null;
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

    grids = [];
    for(var i = 0; i < gridw * gridh; i++) {
        grids[i] = 0;
    }

    var initx = Math.floor(gridw * 0.5);
    var inity = Math.floor(gridh * 0.7);
    snake = new Snake('player', initx, inity, initialSpeed, tailsPerApple);
    enemy = null;
    enemyAi = null;

    renderScore();
    deployApple();
}

function updateState() {
    snake.step();
    if(enemy) {
        enemyAi.step();
        enemy.step();
    }

    renderScore();

    if(!apple) {
        deployApple();
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
    appleAppearedAt = tick;
}

function deployEnemy() {
    while(true) {
        var x = Math.floor(Math.random() * gridw);
        var y = Math.floor(Math.random() * gridh);
        if(grids[x + y * gridw] === 0) {
            enemy = new Snake('enemy', x, y, snake.getSpeed() * 0.8, Math.ceil(snake.getTails().length * 0.8));
            enemyAi = new AI(enemy);
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

    if(enemy) {
        ctx.fillStyle = '#ffaaff';
        var tails = enemy.getTails();
        for(var i = 0; i < tails.length; i++) {
            var tail = tails[i];
            ctx.fillRect(tail.x * unitx + 1, tail.y * unity + 1, unitx - 1, unity - 1);
        }
    }

    // draw apple
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(apple.x * unitx + 1, apple.y * unity + 1, unitx - 1, unity - 1);
}

function renderScore() {
    $('.score .current .value').text(snake.getScore());

    if(+$('.score .high .value').text() < snake.getScore()) {
        $('.score .high .value').text(snake.getScore());
        $('.score .high .name').text('You');
    }
}


var Snake = function(name, initx, inity, speed, initTails) {
    this._name = name;
    this._dir = 'up';
    this._commands = [];
    this._newTails = initTails;
    this._speed = speed;
    this._dead = false;
    this._score = 0;

    this._tails = [{x: initx, y: inity}];
    grids[initx + inity * gridw] = this;
};
Snake.prototype.step = function() {
    if(tick % Math.floor(1 / this._speed) !== 0) return;

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
    var newHead = moveForward(oldHead, this._dir);
    this._tails.splice(0, 0, newHead);

    // check collision
    var index = newHead.x + newHead.y * gridw;
    if(grids[index] === 0) {
        grids[index] = this;
    } else if(grids[index] === 'a') {
        grids[index] = this;
        apple = null;
        this._newTails += tailsPerApple;
        this._speed = Math.min(this._speed + speedIncreasing, maxSpeed);
        this.increaseScore(Math.floor(Math.max(10, 300 - (tick - appleAppearedAt)) * this._speed));
        ga('send', 'event', 'in-game', this._name + '-eat-apple');
    } else {
        this._dead = true;
        ga('send', 'event', 'in-game', this._name + '-dead');
    }
};
Snake.prototype.increaseScore = function(delta) {
    this._score += delta;
}
Snake.prototype.getTails = function() {
    return this._tails;
};
Snake.prototype.onCommand = function(cmd) {
    this._commands.push(cmd);
};
Snake.prototype.isDead = function() {
    return this._dead;
};
Snake.prototype.getDirection = function() {
    return this._dir;
};
Snake.prototype.getScore = function() {
    return this._score;
};
Snake.prototype.getSpeed = function() {
    return this._speed;
};
Snake.prototype.remove = function() {
    for(var i = 0; i < this._tails.length; i++) {
        var tail = this._tails[i];
        grids[tail.x + tail.y * gridw] = 0;
    }
};


var AI = function(snake) {
    this._snake = snake;
};
AI.prototype.step = function() {
    if(tick % Math.floor(1 / this._snake.getSpeed()) !== 0) return;

    var head = this._snake.getTails()[0];
    var dir = this._snake.getDirection();

    // Obstacle avoidance behavior
    if(this.checkObstacle(head, dir)) {
        this._snake.onCommand(Math.random() > 0.5 ? 'left' : 'right');
        return;
    }

    // Walk randomly if there's no apple
    if(!apple) {
        var random = Math.random();
        if(random < 0.1 && !this.checkObstacle(head, 'left')) {
            this._snake.onCommand('left');
        } else if(random < 0.2 && !this.checkObstacle(head, 'right')) {
            this._snake.onCommand('right');
        } else {
            // do nothing
        }
        return;
    }

    // Seek apple
    if(apple.x === head.x && (dir === 'up' || dir === 'down')) {
        // do nothing
    } else if(apple.y === head.y && (dir === 'left' || dir === 'right')) {
        // do nothing
    } else if(apple.x === head.x && (dir === 'left' || dir === 'right')) {
        this._snake.onCommand(Math.random() > 0.5 ? 'left' : 'right');
    } else if(apple.y === head.y && (dir === 'up' || dir === 'down')) {
        this._snake.onCommand(Math.random() > 0.5 ? 'left' : 'right');
    }
};
AI.prototype.checkObstacle = function(head, dir) {
    var ahead = moveForward(head, dir);
    var stuff = grids[ahead.x + ahead.y * gridw];
    return stuff !== 0 && stuff !== 'a';
};

function moveForward(pos, dir) {
    var newPos = {x: pos.x, y: pos.y};
    if(dir === 'up') {
        newPos.y -= 1;
        if(newPos.y < 0) newPos.y = gridh - 1;
    } else if(dir === 'left') {
        newPos.x -= 1;
        if(newPos.x < 0) newPos.x = gridw - 1;
    } else if(dir === 'right') {
        newPos.x += 1;
        if(newPos.x === gridw) newPos.x = 0;
    } else {
        newPos.y += 1;
        if(newPos.y === gridh) newPos.y = 0;
    }
    return newPos;
}