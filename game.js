let boxes = document.querySelectorAll(".box");
let reset_btn = document.querySelector("#rst-btn");
let new_game_btn = document.querySelector("#new-game");
let msg = document.querySelector(".msg");
let msgContainer = document.querySelector(".msg-container");
let container = document.querySelector(".container");
let victory_animation = document.querySelector(".victory-animation");
let turn_msg = document.querySelector(".turn-msg");

let turnX = true;
let timeouts = [];

let clickSound = new Audio('media/box_click.mp3');
let victorySound_trumpet = new Audio('media/victory_trumpets.mp3');
let victorySound_henchman = new Audio('media/victory_henchman.wav');
let match_draw = new Audio('media/match_draw.mp3');

const winning_case = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];

const hideElement = (element) => {
    element.classList.add("hide");
};

const showElement = (element) => {
    element.classList.remove("hide");
};

const disable_boxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enable_boxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

const resetGame = () => {
    turnX = true;
    hideElement(msgContainer);
    hideElement(turn_msg);
    // msgContainer.classList.add("hide");
    enable_boxes();
    clearAllTimeouts();
    boxes.forEach((box) => {
            box.innerText = "";
            box.disabled = false;
            box.classList.remove('fade');
    });
};

const sound = () => {
    
}

const newGame = () => {
    turnX = true;
    victorySound_trumpet.pause();
    hideElement(msgContainer);
    hideElement(new_game_btn);
    showElement(reset_btn);
    showElement(container);
    // new_game_btn.classList.add("hide");
    // reset_btn.classList.remove("hide");
    // msgContainer.classList.add("hide");
    container.classList.remove("hide");
    hideElement(victory_animation);
    enable_boxes();
    clearAllTimeouts();
    boxes.forEach((box) => {
            box.innerText = "";
            box.disabled = false;
            box.classList.remove('fade');
    });
};

const clearAllTimeouts = () => {
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {

        clickSound.play();

        if (turnX) {
            box.innerText = "X";
            turnX = false;
            showElement(turn_msg);
            turn_msg.innerText = "Now it's time for O's turn!";
        } else {
            box.innerText = "O";
            turnX = true;
            showElement(turn_msg);
            turn_msg.innerText = "Now it's time for X's turn!";
        }
        box.disabled = true;

        // Set a timeout to fade the box value after 7 seconds
        const fadeTimeout = setTimeout(() => {
            box.classList.add('fade');
        }, 7000);

        // Set a timeout to clear the box value after 10 seconds
        const clearTimeout = setTimeout(() => {
            box.innerText = "";
            box.disabled = false;
            box.classList.remove('fade');
        }, 10000);

        timeouts.push(fadeTimeout);
        timeouts.push(clearTimeout);

        if (checkWinner()) {
            clearAllTimeouts();
            return;
        }

        if (box_full()) {
            showElement(msgContainer);
            match_draw.play();
            msg.innerText = "Oops! Match Draw 😅 😅 , Try again";
            hideElement(turn_msg);
            clearAllTimeouts();
        }
    });
});

const box_full = () => {
    let count = 0;
    boxes.forEach((box) => {
        if (box.innerText != "") {
            count += 1;
        }
    });
    return count === 9;
};

const checkWinner = () => {
    for (let cases of winning_case) {
        let pos1Val = boxes[cases[0]].innerText;
        let pos2Val = boxes[cases[1]].innerText;
        let pos3Val = boxes[cases[2]].innerText;

        if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                disable_boxes();
                msg.innerText = "Hurray '" + pos1Val + "' Won the Match 🥳 🥳";
                victorySound_henchman.play();
                victorySound_trumpet.play();
                showElement(msgContainer);
                showElement(new_game_btn);
                hideElement(container);
                hideElement(reset_btn);
                // msgContainer.classList.remove("hide");
                container.classList.add("hide");
                // reset_btn.classList.add("hide");
                // new_game_btn.classList.remove("hide");
                fireworks();
                // showElement(victory_animation);
                hideElement(turn_msg);
                return true;
            }
        }
    }
    return false;
};

reset_btn.addEventListener("click", resetGame);
new_game_btn.addEventListener("click", newGame);

const fireworks = () => {
    const duration = 5 * 1000,
  animationEnd = Date.now() + duration,
  defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

const interval = setInterval(function() {
  const timeLeft = animationEnd - Date.now();

  if (timeLeft <= 0) {
    return clearInterval(interval);
  }

  const particleCount = 200 * (timeLeft / duration);

  // since particles fall down, start a bit higher than random
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
  );
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  );
}, 250);
};
