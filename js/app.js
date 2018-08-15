//------VARIABLES------
let die = new Audio('sounds/die.mp3');
let moneypickup = new Audio('sounds/moneypickup.wav');
let moneydeposit = new Audio('sounds/moneydeposit.wav');
let bank = 0;
let musicOn = false;
let backgroundMusic = new Audio('sounds/kraid_hideout.mp3');


//------SIMPLE FUNCTIONS------

// Runs when Ninja girl successfully warps a gem she picked up back to her lair
function addMoney() {
    bank += 1000000;
    //document.getElementById('playerstat').innerHTML = ('YOU HAVE WARPED $' + bank + '<br>BACK TO YOUR LAIR.');
};

// Music Settings and Toggling Function
function toggleMusic() {
    backgroundMusic.volume = 0.15;
    backgroundMusic.loop = true;
    if (musicOn == false) {
        setTimeout(() => {
            backgroundMusic.play();
            musicOn = true;
        }, 1000);
    } else {
        backgroundMusic.pause();
        musicOn = false;
    };
};

// Alerts the player that they have collected a million dollars and that the game is over
function stopGame() {
	setTimeout(function() {
        alert('Mission accomplished. You\'ve collected enough gems to be a millionaire. Go home. For you may now spend the rest of your days at your indulgence.  GAME OVER.  Press F5 to play again.')
	}, 800);
};


//------THE ENEMY------

// Enemies ninja girl must avoid
let Enemy = function(x, y, rate) {
	this.x = x;
	this.y = y;
	this.rate = rate;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.rate * dt;

// Draws the enemy on the screen, required method for game
    Enemy.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    if (this.x < -150) {
        this.y = 310 - (Math.floor(Math.random() * 4)*83);
        this.rate = (Math.floor((Math.random() + 0.5) * 300));
        this.x += this.rate * dt;
        this.sprite = 'images/enemy-bug.png';
    };

    if (this.x > 625) {
        this.rate = -(Math.floor((Math.random() + 0.5) * 300));
        this.x += this.rate * dt;
        this.sprite = 'images/enemy-bug-reverse.png';
    };

    // Checks for collisions between ninja girl and the enemies
    if (player.x < this.x + 60 &&
        player.x > this.x - 60 &&
        player.y < this.y + 60 &&
        60 + player.y > this.y) {
            die.play();
            player.psprite = 'images/NinjaGirlKOed_A.png';                          
            setTimeout(() => {
                player.psprite = 'images/NinjaGirl_A.png';
                player.x = 202;
                player.y = 405;
                gem.deal();
            }, 800);
    };
};


//------THE MONEY------

// Randomly places the gems Ninja girl collects during gameplay
class Gem {
	constructor() {
        this.x = Math.floor(Math.random() * 5) * 102 - 2;
		this.y = Math.ceil(Math.random() * 4) * 83 - 10;
        this.gsprite = 'images/GemOnBlock.png';
	};
};

// places the gem off screen when Ninja girl picks them up and updates the image of Ninja girl holding the gem
Gem.prototype.update = function() {
    Gem.prototype.render = function() {
        ctx.drawImage(Resources.get(this.gsprite), this.x, this.y);
    };
    if (player.x == gem.x && player.y == gem.y) {
            moneypickup.play();
            player.psprite = 'images/NinjaGirlwithGem.png';
            this.x = -300;
            this.y = -300;
    };
};

// Randomly places the gem back on screen after death or lair deposit
Gem.prototype.deal = function() {
    this.x = Math.floor(Math.random() * 5) * 102 - 2;
    this.y = Math.ceil(Math.random() * 4) * 83 - 10;
};


//------THE PLAYER (NINJA GIRL)------

class Player {
	constructor(x, y) {
	   this.x = x;
	   this.y = y;
       this.psprite = 'images/NinjaGirl_A.png';
	};
	update(dt) {
	};
	render() {
		ctx.drawImage(Resources.get(this.psprite), this.x, this.y);
	};
	handleInput(keyPress) {
	    // moves player LEFT 102 pixels and prevents player from moving out of bounds on the left.
        if (keyPress == 'left' && this.x > 0) {
            this.x -= 102;
        };
        // moves player RIGHT 102 pixels and prevents player from moving out of bounds on the right.
        if (keyPress == 'right' && this.x < 405) {
            this.x += 102;
        };
        // moves player UP 83 pixels and prevents player from moving out of bounds on the top.
        if (keyPress == 'up' && this.y > 0) {
            this.y -= 83;
        };
        // moves player DOWN 83 pixels and prevents player from moving out of bounds on the bottom.
        if (keyPress == 'down' && this.y < 405) {
            this.y += 83;
        };
        // when the player reaches the last row with Gem, she deposits the money into her lair.
        if (this.y < 0 && this.psprite == 'images/NinjaGirlwithGem.png') {
            moneydeposit.play();
            addMoney();
            this.psprite = 'images/NinjaGirl_A.png';
            //gem.deal();
            player.x = 202;
            player.y = 405;
            if (bank == 1000000){
                stopGame();
            };
        };
        //keyPress to toggle backgroundMusic on and off
        if (keyPress == 'music') {
            toggleMusic();
        };
	};
};


//------INSTANTIATE OBJECTS------

// Place the player object in a variable called player
var player = new Player(202, 405);

// Gem object in the variable called gem
var gem = new Gem();

// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i=1; i<6; i++) {
    let zy = 310 - (Math.floor(Math.random() * 4)*83);
    let howfast = (Math.floor((Math.random() + 0.5) * 300));
    enemy = new Enemy(-202, zy, howfast);
    allEnemies.push(enemy);
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method.  You don't need to modify this. (added 'music').
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        77: 'music'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});