function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.vectorTo = function(destination, duration) {
    if (duration === undefined) {
        duration = 1;
    }
    return new Point(
            (destination.x - this.x) / duration,
            (destination.y - this.y) / duration);
};


function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Rect.prototype.containsPoint = function(point) {
    return point.x >= this.x && point.x < this.x + this.width &&
        point.y >= this.y && point.y < this.y + this.height;
};

Rect.prototype.topLeft = function() {
    return new Point(this.x, this.y);
};


function Layer() {
    this.gameObjects = [];
}

Layer.prototype.addGameObject = function(obj) {
    this.gameObjects.push(obj);
};

Layer.prototype.removeObject = function(obj) {
    var idx = this.gameObjects.indexOf(obj);
    if (idx !== -1) {
        this.gameObjects.splice(idx, 1);
    }
};

Layer.prototype.removeObjects = function(objs) {
    var i;
    for (i = 0; i < objs.length; i++) {
        this.removeObject(objs[i]);
    }
};

Layer.prototype.draw = function(ctx) {
    var i;
    for (i = 0; i < this.gameObjects.length; i++) {
        this.gameObjects[i].draw(ctx);
    }
};

Layer.prototype.hit = function(point) {
    var i;
    for (i = 0; i < this.gameObjects.length; i++) {
        var hitObj = this.gameObjects[i].hit(point);
        if (hitObj) {
            return hitObj;
        }
    }
    return null;
};


function TickManager(redraw) {
    this.animations = [];
    this.interval = null;
    this.redraw = redraw;
}

TickManager.prototype.addAnimation = function(anim, completion) {
    if (completion === undefined) {
        completion = function() {};
    }
    this.animations.push({
        anim: anim,
        completion: completion
    });

    // Nothing to do if the interval timer has been started
    if (this.interval !== null) {
        return;
    }

    // Start interval timer
    var this_ = this;
    this.lastTick = new Date().getTime();
    this.interval = setInterval(function() {
            var now = new Date().getTime();
            var dt = (now - this_.lastTick) / 1000;
            this_.tick(dt);
            this_.lastTick = now;

            // Stop interval timer when there are no more animations
            if (this_.animations.length === 0) {
                clearInterval(this_.interval);
                this_.interval = null;
            }
        }, TICK_INTERVAL);
};

TickManager.prototype.tick = function(dt) {
    var deadAnimations = [];
    var i;
    for (i = 0; i < this.animations.length; i++) {
        if (!this.animations[i].anim.tick(dt)) {
            deadAnimations.push(i);
            this.animations[i].completion();
        }
    }

    while (deadAnimations.length > 0) {
        i = deadAnimations.pop();
        this.animations.splice(i, 1);
    }

    this.redraw();
};


function MoveAnimation(obj, destination, duration) {
    this.obj = obj;
    this.destination = destination;
    this.duration = duration;
    this.direction = this.obj.rect.topLeft().vectorTo(destination, duration);
}

MoveAnimation.prototype.tick = function(dt) {
    this.obj.rect.x += this.direction.x * dt;
    this.obj.rect.y += this.direction.y * dt;

    this.duration -= dt;
    if (this.duration <= 0) {
        this.obj.rect.x = this.destination.x;
        this.obj.rect.y = this.destination.y;
        return false;
    }
    return true;
};

function multiCompletion(count, completion) {
    if (completion === undefined) {
        completion = function() {};
    }
    return function() {
        if (--count === 0) {
            completion();
        }
    };
}
