class Bullet extends Phaser.Sprite {
    tracking;
    scaleSpeed;

    constructor(game, key) {
        super(game, 0, 0, key);

        this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

        this.anchor.set(0.5);

        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        this.exists = false;

        this.tracking = false;
        this.scaleSpeed = 0;
    }

    fire = (x, y, angle, speed, gx, gy) => {
        gx = gx || 0;
        gy = gy || 0;

        this.reset(x, y);
        this.scale.set(1);

        this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

        this.angle = angle;

        this.body.gravity.set(gx, gy);
    }

    update() {
        //console.log(this);
        if (this.tracking) {
            this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
        }

        if (this.scaleSpeed > 0) {
            this.scale.x += this.scaleSpeed;
            this.scale.y += this.scaleSpeed;
        }
    };
}

class WeaponEightWay extends Phaser.Group {

    nextFire;
    bulletSpeed;
    fireRate;
    width_sprite;
    height_sprite;

    constructor(game, spriteKey, width, height) {
        super(game, game.world, 'Eight Way', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 5000;
        this.width_sprite = width;
        this.height_sprite = height;

        for (var i = 0; i < 96; i++) {
            this.add(new Bullet(game, spriteKey), true);
        }
    }

    fire = (source) => {

        if (this.game.time.time < this.nextFire) { return; }

        // 
        var x = source.x + (this.width_sprite / 2); // half width, to center it on blowfish
        var y = source.y + (this.height_sprite / 2); // half height, to center it on blowfish

        console.log('x: ' + x + ', y: ' + y)
        console.log('width: ' + this.width + ', height: ' + this.height)

        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 45, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 135, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 225, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 315, this.bulletSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;
    }
}

class HashTable {
    hashes;
    constructor() {
        this.hashes = {};
    }
    put(key, value) {
        this.hashes[JSON.stringify(key)] = value;
    }

    get(key) {
        return this.hashes[JSON.stringify(key)];
    }
}