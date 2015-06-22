/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
/// <reference path="objects/label.ts" />
/// <reference path="objects/button.ts" />
/// <reference path="config/constant.ts" />
// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage;
var tiles = [];
var reelContainers = [];
var assets;
var manifest = [
    { id: "background", src: "assets/images/slotmachine.png" },
    { id: "clicked", src: "assets/audio/clicked.wav" }
];
//Sprite Sheet
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
var NUM_REELS = 3;
// Game Variables
var background;
var textureAtlas;
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
var playerBet = 0;
var winnings = 0;
var jackpot = 5000;
var turn = 0;
var playerBet = 0;
var winNumber = 0;
var lossNumber = 0;
var winRatio = 0;
//Slot Machine Button Variables
var spinButton;
var resetButton;
var betOneButton;
var betTenButton;
var powerButton;
//Slot Machine Labels
var jackpotLabel;
var playerCreditLabel;
var playerBetLabel;
var spinResultLabel;
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
            case checkRange(outCome[spin], 1, 29):
                betLine[spin] = "donkey";
                donkey++;
                break;
            case checkRange(outCome[spin], 30, 39):
                betLine[spin] = "banana";
                banana++;
                break;
            case checkRange(outCome[spin], 40, 48):
                betLine[spin] = "strawberry";
                strawberry++;
                break;
            case checkRange(outCome[spin], 49, 57):
                betLine[spin] = "cherry";
                cherry++;
                break;
            case checkRange(outCome[spin], 58, 61):
                betLine[spin] = "penguin";
                penguin++;
                break;
            case checkRange(outCome[spin], 62, 65):
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
        else if (penguin == 3) {
            winnings = playerBet * 30;
        }
        else if (cherry == 3) {
            winnings = playerBet * 40;
        }
        else if (money == 3) {
            winnings = playerBet * 50;
        }
        else if (penguin == 2) {
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
        else if (money == 2) {
            winnings = playerBet * 10;
        }
        else {
            winnings = playerBet * 1;
        }
        if (money == 1) {
            winnings = playerBet * 5;
        }
        winNumber++;
        showWinMessage();
    }
    else {
        lossNumber++;
        showLossMessage();
    }
}
//BetTen Function
function betTenButtonClicked() {
    playerBet += 10;
    if (playerMoney < playerBet) {
        playerBet -= 10;
    }
    stage.removeChild(playerBetLabel);
    playerBetLabel = new objects.Label(playerBet.toString(), 135, 313, false);
    stage.addChild(playerBetLabel);
}
//BetOne function
function betOneButtonClicked() {
    playerBet += 1;
    if (playerMoney < playerBet) {
        playerBet -= 1;
    }
    stage.removeChild(playerBetLabel);
    playerBetLabel = new objects.Label(playerBet.toString(), 135, 313, false);
    stage.addChild(playerBetLabel);
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
// Callback function that allows me to respond to button click events
function spinButtonClicked(event) {
    createjs.Sound.play("clicked");
    if (playerMoney == 0) {
        if (confirm("You ran out of Money! \nDo you want to play again?")) {
            resetAll();
        }
    }
    else if (playerBet > playerMoney) {
        alert("You don't have enough Money to place that bet.");
    }
    else if (playerBet < 0) {
        alert("All bets must be a positive $ amount.");
    }
    else if (playerBet == 0) {
        alert("Please place a bet first.");
    }
    else if (playerBet <= playerMoney) {
        spinResult = Reels();
        symbols = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
        for (var index = 0; index < NUM_REELS; index++) {
            reelContainers[index].removeAllChildren();
            tiles[index] = new createjs.Bitmap("assets/images/" + spinResult[index] + ".png");
            reelContainers[index].addChild(tiles[index]);
        }
        determineWinnings();
        turn++;
    }
    else {
        alert("Please enter a valid bet amount");
    }
}
/* Utility function to show a win message and increase player money */
function showWinMessage() {
    playerMoney += winnings;
    resetFruitTally();
    checkJackPot();
    stage.removeChild(spinResultLabel);
    spinResultLabel = new objects.Label(winnings.toString(), 235, 313, false);
    stage.addChild(spinResultLabel);
    stage.removeChild(playerCreditLabel);
    playerCreditLabel = new objects.Label(playerMoney.toString(), 35, 313, false);
    stage.addChild(playerCreditLabel);
    playerBet = 0;
    stage.removeChild(playerBetLabel);
    playerBetLabel = new objects.Label(playerBet.toString(), 135, 313, false);
    stage.addChild(playerBetLabel);
    checkJackPot();
}
/* Utility function to show a loss message and reduce player money */
function showLossMessage() {
    playerMoney -= playerBet;
    resetFruitTally();
    stage.removeChild(spinResultLabel);
    spinResultLabel = new objects.Label(lossNumber.toString(), 235, 313, false);
    stage.addChild(spinResultLabel);
    stage.removeChild(playerCreditLabel);
    playerCreditLabel = new objects.Label(playerMoney.toString(), 35, 313, false);
    stage.addChild(playerCreditLabel);
    playerBet = 0;
    stage.removeChild(playerBetLabel);
    playerBetLabel = new objects.Label(playerBet.toString(), 135, 313, false);
    stage.addChild(playerBetLabel);
}
function checkJackPot() {
    /* compare two random values */
    var jackPotTry = Math.floor(Math.random() * 51 + 1);
    var jackPotWin = Math.floor(Math.random() * 51 + 1);
    if (jackPotTry == jackPotWin) {
        alert("You Won the $" + jackpot + " Jackpot!!");
        playerMoney += jackpot;
        jackpot = 1000;
    }
    stage.removeChild(jackpotLabel);
    stage.removeChild(playerCreditLabel);
    jackpotLabel = new objects.Label(jackpot.toString(), 128, 95, false);
    stage.addChild(jackpotLabel);
    playerCreditLabel = new objects.Label(playerMoney.toString(), 35, 313, false);
    stage.addChild(playerCreditLabel);
}
function resetButtonClicked(event) {
    createjs.Sound.play("clicked");
    resetAll();
    main();
}
function powerButtonClicked(event) {
    window.open('', '_self', '');
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
    spinButton = new objects.Button("spinButton", 250, 333, false);
    stage.addChild(spinButton);
    spinButton.on("click", spinButtonClicked, this);
    powerButton = new objects.Button("red-power-button", 242, 47, false);
    stage.addChild(powerButton);
    powerButton.on("click", powerButtonClicked, this);
    resetButton = new objects.Button("resetButton", 37, 333, false);
    stage.addChild(resetButton);
    resetButton.on("click", resetButtonClicked, this);
    betOneButton = new objects.Button("betOneButton", 110, 333, false);
    stage.addChild(betOneButton);
    betOneButton.on("click", betOneButtonClicked, this);
    betTenButton = new objects.Button("betTenButton", 181, 333, false);
    stage.addChild(betTenButton);
    betTenButton.on("click", betTenButtonClicked, this);
    playerCreditLabel = new objects.Label(playerMoney.toString(), 35, 313, false);
    stage.addChild(playerCreditLabel);
    jackpotLabel = new objects.Label(jackpot.toString(), 128, 95, false);
    stage.addChild(jackpotLabel);
    playerBetLabel = new objects.Label(playerBet.toString(), 135, 313, false);
    stage.addChild(playerBetLabel);
    spinResultLabel = new objects.Label(winnings.toString(), 235, 313, false);
    stage.addChild(spinResultLabel);
}
//# sourceMappingURL=game.js.map