let move_speed = 5 
gravity = 0.5
game_state = 'Start' 
bird_dy = 0
pipe_separation = 0;

const bird = document.querySelector('.bird'),
message = document.querySelector('.message'),
score_val = document.querySelector('.score_val'),
score_title = document.querySelector('.score_title'),
background = document.querySelector('.background').getBoundingClientRect();

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') startGame();
});

function startGame() {
    document.querySelectorAll('.pipe_sprite').forEach(pipe => pipe.remove());
    bird.style.top = '40vh';
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    play();
}

function play() {
    requestAnimationFrame(movePipes);
    requestAnimationFrame(applyGravity);
    requestAnimationFrame(createPipe);
}

function applyGravity() {
    if (game_state !== 'Play') return;
    bird_dy += gravity;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') bird_dy = -7.6;
    });
    const bird_props = bird.getBoundingClientRect();
    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) endGame();
    bird.style.top = bird_props.top + bird_dy + 'px';
    requestAnimationFrame(applyGravity);
}

function movePipes() {
    if (game_state !== 'Play') return;
    document.querySelectorAll('.pipe_sprite').forEach(pipe => {
        const pipe_props = pipe.getBoundingClientRect();
        const bird_props = bird.getBoundingClientRect();
        if (pipe_props.right <= 0) pipe.remove();
        else {
            if (detectCollision(bird_props, pipe_props)) endGame();
            else if (pipe_props.right < bird_props.left && pipe.increase_score) {
                score_val.innerHTML = +score_val.innerHTML + 1;
                pipe.increase_score = false;
            }
            pipe.style.left = pipe_props.left - move_speed + 'px';
        }
    });
    requestAnimationFrame(movePipes);
}

function createPipe() {
    if (game_state !== 'Play') return;
    if (pipe_separation > 115) {
        pipe_separation = 0;
        const gap = 65; 
        const maxTop = 60 - gap; 
        const pipe_posi = Math.floor(Math.random() * maxTop); 
        const pipe_top = createPipeElement(pipe_posi + 'vh');
        const pipe_bottom = createPipeElement((pipe_posi + gap) + 'vh', true);
        document.body.appendChild(pipe_top);
        document.body.appendChild(pipe_bottom);
    }
    pipe_separation++;
    requestAnimationFrame(createPipe);
}

function createPipeElement(top, score = false) {
    const pipe = document.createElement('div');
    pipe.className = 'pipe_sprite';
    pipe.style.top = top;
    pipe.style.left = '100vw';
    if (score) pipe.increase_score = true;
    return pipe;
}

function detectCollision(bird_props, pipe_props) {
    return (
        bird_props.left < pipe_props.left + pipe_props.width &&
        bird_props.left + bird_props.width > pipe_props.left &&
        bird_props.top < pipe_props.top + pipe_props.height &&
        bird_props.top + bird_props.height > pipe_props.top
    );
}

function endGame() {
    game_state = 'End';
    message.innerHTML = 'Press Enter To Restart';
    message.style.left = '28vw';
}





