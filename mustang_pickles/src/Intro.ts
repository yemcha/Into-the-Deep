class Intro extends Phaser.State {
    
        bg;
        begin;
        line1;
        line2;
        text;
        
    octopus;
        preload() {
            this.load.atlas('intro', 'assets/tilemaps/tiles/intro.png', 'assets/tilemaps/tiles/intro.json');
            
        }

       
        
      
    
        create() {
            console.log(this.world.centerX, this.world.centerY)
          //  this.begin = this.add.tileSprite(0, 0, 1600, 1600, 'intro');
          //  var frameNames = Phaser.Animation.generateFrameNames('logo', 1, 25, '', 4);
           // this.begin.callAll('animations.add', 'animations', 'swim', frameNames, 3, true, false);
          //  this.begin.callAll('play', null, 'swim');
            this.begin = this.add.sprite(0, 0, 'intro');
            var frameNames = Phaser.Animation.generateFrameNames('logo', 1, 37, '', 4);
            console.log(frameNames)
            this.begin.animations.add('logo2', frameNames, 1, false);
            this.begin.animations.play('logo2');
           // this.begin.animations.stop();
          // var text = this.add.bitmapText(400, 300, 'desyrel', 'click to skip', 64);
         //  text.anchor.x = 0.5;
         //  text.anchor.y = 0.5;
       
          // line1 = new Phaser.Line(400, 0, 400, 600);
          // line2 = new Phaser.Line(0, 300, 800, 300);
          var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.begin.width, align: "center", backgroundColor: "" };

         this.text = this.add.text(0, 0, "CLICK \nTO START", style);
         this.text.anchor.set(0.5);

        
        }
    
        update() {
            //the "click to restart" handler
           // this.input.onTap.addOnce(this.startLevelPicker.bind(this));
           this.input.onTap.addOnce(this.startLevelPicker.bind(this));
           this.text.x = Math.floor(this.begin.x + this.begin.width / 2);
           this.text.y = Math.floor(this.begin.y + this.begin.height / 5);
       
        }

         
    
        startLevelPicker = () => {
    
            (<GameLoader>this.game).player_coordinate = Object.create((<GameLoader>this.game).player_coordinate_original);
            (<GameLoader>this.game).player_oxygen = (<GameLoader>this.game).player_oxygen_original;
            (<GameLoader>this.game).blowfishs_coordinates = (<GameLoader>this.game).blowfishs_coordinates_original;
            (<GameLoader>this.game).octopi_coordinates = (<GameLoader>this.game).octopi_coordinates_original;
    
            this.game.state.start('LevelPicker');
        }
    }