const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score-value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const audio = new Audio("../assets/audio.mp3")

const size = 30

const initialPosition = { x: 270, y: 240 }

let snake = [initialPosition]

const incrementScore = () => {
    score.innerText = +score.innerText + Number(10)
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * ( max - min) + min)
}

const randomPositicion = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const ramdomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPositicion(0, 570),
    y: randomPositicion(0, 570),
    color: ramdomColor()
}

let direction, LoopId

const drawFood = () => {

    const {x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = ramdomColor()
    
    snake.forEach((position, index) => {

        if (index == snake.length - 1) {
            ctx.fillStyle = ramdomColor()
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }

    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }

    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }

    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "green"

    for (let i = 30; i < canvas.width; i += 30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()
        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPositicion()
        let y = randomPositicion()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPositicion()
            y = randomPositicion()
        }

        food.x = x
        food.y = y
        food.color = ramdomColor()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(6px)"
}

const gameLoop = () => {
    clearInterval(LoopId)
    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    let loopId = setTimeout(() => {
        gameLoop()
    }, 200)
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }
    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }
    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }
    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
})

buttonPlay.addEventListener('click', () => {
    score.innerText == '00'
    menu.style.display = 'none'
    canvas.style.filter = 'none'

    snake = [initialPosition]
    food.x = randomPositicion(0, 570)
    food.y = randomPositicion(0, 570)
})
