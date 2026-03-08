const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// load a bird icon to use for the player
const birdImg = new Image();
birdImg.src = "bird.png"; // put a bird.png image in the same folder

// desired size for the bird on canvas; keeps it small relative to pipes
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;

let bird = {
    x: 80,
    y: canvas.height / 2,          // start in middle of screen
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT,
    gravity: 0.6,
    lift: -10,
    velocity: 0
};

// no need to resize based on the actual image; we will draw scaled
birdImg.onload = function() {
    // you could adjust BIRD_WIDTH/BIRD_HEIGHT here if you want to keep aspect ratio,
    // but for now we just use the constants above.
};

let pipes = [];
let pipeWidth = 50;
let gap = 150;

function createPipe(){
    let topHeight = Math.random() * (canvas.height - gap - 100) + 20;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - gap
    });
}

document.addEventListener("keydown", function(){
    bird.velocity = bird.lift;
});

function update(){

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if(bird.y > canvas.height){
        bird.y = canvas.height;
        bird.velocity = 0;
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    if(pipes.length == 0 || pipes[pipes.length-1].x < 250){
        createPipe();
    }

    pipes.forEach(pipe => {

        if(
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.top + gap)
        ){
            alert("Game Over");
            document.location.reload();
        }

    });

}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // draw bird image (scaled) instead of simple rectangle
    if (birdImg.complete) {
        ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    } else {
        // fallback until image loads
        ctx.fillStyle = "yellow";
        ctx.fillRect(bird.x,bird.y,bird.width,bird.height);
    }

    ctx.fillStyle = "green";

    pipes.forEach(pipe=>{
        ctx.fillRect(pipe.x,0,pipeWidth,pipe.top);
        ctx.fillRect(pipe.x,pipe.top + gap,pipeWidth,pipe.bottom);
    });

}

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();