/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />

/// <reference path="objects/button.ts" />


// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage: createjs.Stage;
var tiles: createjs.Bitmap[] = [];
var reelContainers: createjs.Container[] = [];

var assets: createjs.LoadQueue;
//Sprite Sheet
var manifest = [
    { id: "background", src: "assets/images/slotmachine.png" },
    { id: "clicked", src: "assets/audio/clicked.wav" }
];

var atlas = {

    "images": ["assets/images/atlas.png"],

    "frames": [
        [2, 2, 47, 49, 0, -5, 0],
        [51, 2, 53, 48, 0, 0, 0],
        [106, 2, 53, 48, 0, 0, 0],
        [161, 2, 53, 48, 0, 0, 0],
        [216, 2, 53, 48, 0, 0, 0],
        [271, 2, 51, 48, 0, -4, -1],
        [324, 2, 55, 47, 0, -3, -2],
        [381, 2, 55, 44, 0, -2, -2],
        [438, 2, 59, 40, 0, 0, 0],
        [499, 2, 60, 39, 0, 0, -5],
        [561, 2, 54, 38, 0, -2, -6],
        [617, 2, 28, 28, 0, 0, 0]
    ],

    "animations": {
        "ace": [0],
        "betOneButton": [1],
        "betTenButton": [2],
        "resetButton": [3],
        "spinButton": [4],
        "donkey": [5],
        "cherry": [6],
        "penguin": [7],
        "banana": [8],
        "money": [9],
        "strawberry": [10],
        "red-power-button": [11]
    }

};

// GAME CONSTANTS
var NUM_REELS: number = 3;

// Game Variables
var background: createjs.Bitmap;
var textureAtlas: createjs.SpriteSheet;

//Slot Machine Button Variables
var spinButton: objects.Button;
var resetButton: objects.Button;
var betOneButton: objects.Button;
var betTenButton: objects.Button;
var powerButton: objects.Button;

var spinResult; 
var symbols = "";
var banana = 0;
var cherry = 0;
var donkey = 0;
var strawberry = 0;
var money = 0;
var penguin = 0;

//Player Stats Variables
var playerMoney = 1000;
var winnings = 0;
var jackpot = 5000;
var turn = 0;
var playerBet = 0;
var winNumber = 0;
var lossNumber = 0;
var winRatio = 0;

/* Utility function to reset all fruit tallies */
function resetFruitTally() {
    cherry = 0;
    banana = 0;
    donkey = 0;
    cherry = 0;
    strawberry = 0;
    money = 0;
    penguin = 0;
}

/* Utility function to reset the player stats */
function resetAll() {
    playerMoney = 1000;
    winnings = 0;
    jackpot = 5000;
    turn = 0;
    playerBet = 0;
    winNumber = 0;
    lossNumber = 0;
    winRatio = 0;
}

// Preloader Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    // event listener triggers when assets are completely loaded
    assets.on("complete", init, this); 
    assets.loadManifest(manifest);

    //Load Texture atlas
    textureAtlas = new createjs.SpriteSheet(atlas);
}

// Callback function that initializes game objects
function init() {
    stage = new createjs.Stage(canvas); // reference to the stage
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60); // framerate 60 fps for the game
    // event listener triggers 60 times every second
    createjs.Ticker.on("tick", gameLoop); 

    // calling main game function
    main();
}

// Callback function that creates our Main Game Loop - refreshed 60 fps
function gameLoop() {
    stage.update();
}

/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 29):  // 41.5% probability
                betLine[spin] = "donkey";
                donkey++;
                break;
            case checkRange(outCome[spin], 30, 39): // 15.4% probability
                betLine[spin] = "banana";
                banana++;
                break;
            case checkRange(outCome[spin], 40, 48): // 13.8% probability
                betLine[spin] = "strawberry";
                strawberry++;
                break;
            case checkRange(outCome[spin], 49, 57): // 12.3% probability
                betLine[spin] = "cherry";
                cherry++;
                break;
            case checkRange(outCome[spin], 58, 61): //  7.7% probability
                betLine[spin] = "penguin";
                penguin++;
                break;
            case checkRange(outCome[spin], 62, 65): //  4.6% probability
                betLine[spin] = "money";
                money++;
                break;
        }
    }
    return betLine;
}

/* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (donkey == 0) {
        if (strawberry == 3) {
            winnings = playerBet * 10;
        }
        else if (banana == 3) {
            winnings = playerBet * 20;
        }
        else if (cherry == 3) {
            winnings = playerBet * 30;
        }
        else if (penguin == 3) {
            winnings = playerBet * 40;
        }
        else if (money == 3) {
            winnings = playerBet * 50;
        }
        else if (cherry == 3) {
            winnings = playerBet * 75;
        }
        else if (strawberry == 3) {
            winnings = playerBet * 100;
        }
        else if (penguin == 2) {
            winnings = playerBet * 2;
        }
        else if (money == 2) {
            winnings = playerBet * 2;
        }
        else if (strawberry == 2) {
            winnings = playerBet * 3;
        }
        else if (banana == 2) {
            winnings = playerBet * 4;
        }
        else if (cherry == 2) {
            winnings = playerBet * 5;
        }
        else if (banana == 2) {
            winnings = playerBet * 10;
        }
        else if (penguin == 2) {
            winnings = playerBet * 20;
        }
        else {
            winnings = playerBet * 1;
        }

        if (money == 1) {
            winnings = playerBet * 5;
        }
        winNumber++;
        //showWinMessage();
    }
    else {
        lossNumber++;
        //showLossMessage();
    }

}

// Callback function that allows me to respond to button click events
function spinButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");
    spinResult = Reels();
    symbols = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
    
    // Iterate over the number of reels
    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index].removeAllChildren();
        tiles[index] = new createjs.Bitmap("assets/images/" + spinResult[index] + ".png");
        reelContainers[index].addChild(tiles[index]);
    }
}

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}

function resetButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");
    resetAll();
    resetFruitTally();
}

function powerButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");
    window.close();
}

// Our Main Game Function
function main() {
    console.log("Game is Running");
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background);

    for (var index = 0; index < NUM_REELS; index++) {
        reelContainers[index] = new createjs.Container();
        stage.addChild(reelContainers[index]);
    }
    reelContainers[0].x = 58;
    reelContainers[0].y = 175;
    reelContainers[1].x = 134;
    reelContainers[1].y = 175;
    reelContainers[2].x = 210;
    reelContainers[2].y = 175;

    powerButton = new objects.Button("red-power-button", 242, 47, false);
    stage.addChild(powerButton);
    powerButton.on("click", powerButtonClicked, this);

    spinButton = new objects.Button("spinButton", 250, 333, false);
    stage.addChild(spinButton);
    spinButton.on("click", spinButtonClicked, this);

    resetButton = new objects.Button("resetButton", 37, 333, false);
    stage.addChild(resetButton);
    spinButton.on("click", resetButtonClicked, this);

    betOneButton = new objects.Button("betOneButton", 110, 333, false);
    stage.addChild(betOneButton);

    betTenButton = new objects.Button("betTenButton", 181, 333, false);
    stage.addChild(betTenButton);
}