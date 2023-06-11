const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const score = document.querySelector('#score')
const mathCircle = Math.PI * 2

canvas.width = innerWidth
canvas.height = innerHeight

class Boundry {
    static width = 40
    static height = 40
    constructor({ position }) {
        this.position = position
        this.width = 40
        this.height = 40
    }

    generate() {
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Pacman {
    constructor({ position, movementSpeed }) {
        this.position = position
        this.movementSpeed = movementSpeed
        this.radius = 15
        this.gap = 0.75
        this.chompRate = 0.12
        this.rotation = 0
    }

    generate() {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, this.gap, mathCircle - this.gap)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.generate()
        this.position.x += this.movementSpeed.x
        this.position.y += this.movementSpeed.y
        if (this.gap < 0 || this.gap > .75) {
            this.chompRate = -this.chompRate
        }
        this.gap += this.chompRate
    }

}

class Ghost {
    static speed = 2
    constructor({ position, movementSpeed, color }) {
        this.position = position
        this.movementSpeed = movementSpeed
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.speed = 2
        this.eatable = false
    }

    generate() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, mathCircle)
        c.fillStyle = this.eatable ? 'blue' : this.color
        c.fill()
        c.closePath()
    }

    update() {
        this.generate()
        this.position.x += this.movementSpeed.x
        this.position.y += this.movementSpeed.y
    }

}

class Pellet {
    constructor({ position }) {
        this.position = position
        this.radius = 3
    }

    generate() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, mathCircle)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }
}

class PowerPellet{
    constructor({ position }) {
        this.position = position
        this.radius = 7
    }

    generate() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, mathCircle)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }
}


const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}
let last = ''
const map = [
['~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
['~', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '.', '~'],
['~', '*', '~', '~', '~', '*', '~', '*', '~', '~', '~', '*', '~', '*', '~', '~', '~', '*', '~'],
['~', '*', '~', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '~', '*', '~'],
['~', '*', '~', '*', '~', '*', '~', '*', '~', '~', '~', '*', '~', '*', '~', '*', '~', '*', '~'],
['~', '*', '*', '*', '~', '*', '~', '*', '*', '~', '*', '*', '~', '*', '~', '*', '*', '*', '~'],
['~', '*', '~', '*', '~', '*', '~', '~', '*', '~', '*', '~', '~', '*', '~', '*', '~', '*', '~'],
['~', '*', '*', '*', '~', '*', '~', '*', '*', '~', '*', '*', '~', '*', '~', '*', '*', '*', '~'],
['~', '*', '~', '*', '~', '*', '~', '*', '~', '~', '~', '*', '~', '*', '~', '*', '~', '*', '~'],
['~', '*', '~', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '~', '*', '~'],
['~', '*', '~', '~', '~', '*', '~', '*', '~', '~', '~', '*', '~', '*', '~', '~', '~', '*', '~'],
['~', '.', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '.', '~'],
['~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~']
]

function fillMap(){
    map = [
        ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~'],
        ['~', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '~'],
        ['~', '*', '~', '*', '~', '*', '~', '*', '~', '~', '~', '*', '~', '*', '~', '*', '~', '*', '~'],
        ['~', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '~'],
        ['~', '*', '~', '*', '~', '~', '~', '*', '~', '~', '~', '*', '~', '*', '~', '*', '~', '*', '~'],
        ['~', '*', '*', '*', '*', '*', '~', '*', '~', '*', '*', '*', '~', '*', '~', '*', '*', '*', '~'],
        ['~', '*', '~', '*', '~', '~', '~', '*', '~', '~', '~', '*', '~', '~', '~', '*', '~', '*', '~'],
        ['~', '*', '*', '*', '~', '*', '*', '*', '~', ' ', '~', '*', '*', '*', '~', '*', '*', '*', '~'],
        ['~', '*', '~', '*', '~', '~', '~', '*', '~', '~', '~', '*', '~', '*', '~', '*', '~', '*', '~'],
        ['~', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '~'],
        ['~', '*', '~', '*', '~', '*', '~', '*', '~', '~', '~', '*', '~', '*', '~', '*', '~', '*', '~'],
        ['~', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '~'],
        ['~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~']
    ]
}

const gameMap = []
const pellets = []
const powerPellets = []
let pelletCounter = 0
let scoreVar = 0
score.innerHTML = scoreVar
const ghosts = [
    new Ghost({
        position: {
            x: Boundry.width * 14 + Boundry.width / 2,
            y: Boundry.height * 3 + Boundry.height / 2
        },
        movementSpeed: {
            x: Ghost.speed,
            y: 0
        },
        color: 'red'
    }),
    new Ghost({
        position: {
            x: Boundry.width * 14 + Boundry.width / 2,
            y: Boundry.height * 9 + Boundry.height / 2
        },
        movementSpeed: {
            x: Ghost.speed,
            y: 0
        },
        color: 'blue'
    }),
    new Ghost({
        position: {
            x: Boundry.width * 3 + Boundry.width / 2,
            y: Boundry.height * 3 + Boundry.height / 2
        },
        movementSpeed: {
            x: Ghost.speed,
            y: 0
        },
        color: 'yellow'
    }),
    new Ghost({
        position: {
            x: Boundry.width * 3 + Boundry.width / 2,
            y: Boundry.height * 9 + Boundry.height / 2
        },
        movementSpeed: {
            x: Ghost.speed,
            y: 0
        },
        color: 'pink'
    })
]

const pacman = new Pacman({
    position: {
        x: Boundry.width + Boundry.width / 2,
        y: Boundry.height + Boundry.height / 2
    },
    movementSpeed: {
        x: 0,
        y: 0
    }
})

function resetGame(){
    window.location.reload();
    cancelAnimationFrame(animationid)
    fillMap()
    scoreVar = 0
    pelletCounter = 0
    score.innerHTML = scoreVar
    map.forEach((row, i) => {
        row.forEach((space, j) => {
            switch (space) {
                case '~':
                    gameMap.push(
                        new Boundry({
                            position: {
                                x: Boundry.width * j,
                                y: Boundry.height * i
                            }
                        })
                    )
                    break
                case '*':
                    pellets.push(
                        new Pellet({
                            position: {
                                x: Boundry.width * j + Boundry.width / 2,
                                y: Boundry.height * i + Boundry.height / 2
                            }
                        })
                    )
                    pelletCounter++
                    break
            }
        })
    })
}
map.forEach((row, i) => {
    row.forEach((space, j) => {
        switch (space) {
            case '~':
                gameMap.push(
                    new Boundry({
                        position: {
                            x: Boundry.width * j,
                            y: Boundry.height * i
                        }
                    })
                )
                break
            case '*':
                pellets.push(
                    new Pellet({
                        position: {
                            x: Boundry.width * j + Boundry.width / 2,
                            y: Boundry.height * i + Boundry.height / 2
                        }
                    })
                )
                pelletCounter++
                break
            case '.':
                powerPellets.push(
                    new PowerPellet({
                        position: {
                            x: Boundry.width * j + Boundry.width / 2,
                            y: Boundry.height * i + Boundry.height / 2
                        }
                    })
                )
                pelletCounter++
                break
        }
    })
})

function collision({
    circle,
    rectangle
}) {
    const padding = Boundry.width / 2 - circle.radius - 1
    return ((circle.position.y - circle.radius + circle.movementSpeed.y) <= (rectangle.position.y + rectangle.height + padding)
        && (circle.position.x + circle.radius + circle.movementSpeed.x) >= (rectangle.position.x - padding)
        && (circle.position.y + circle.radius + circle.movementSpeed.y) >= (rectangle.position.y - padding)
        && (circle.position.x - circle.radius + circle.movementSpeed.x) <= (rectangle.position.x + rectangle.width + padding))
}

//Animation loop
let animationid
function animation() {
    animationid = requestAnimationFrame(animation)
    c.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.pressed && last == 'w') {
        for (let i = 0; i < gameMap.length; i++) {
            const boundary = gameMap[i]

            if (
                collision({
                    circle: {
                        ...pacman, movementSpeed: {
                            x: 0,
                            y: -5
                        }
                    },
                    rectangle: boundary
                })) {
                pacman.movementSpeed.y = 0
                break
            } else {
                pacman.movementSpeed.y = -5
            }
        }
    } else if (keys.a.pressed && last == 'a') {
        for (let i = 0; i < gameMap.length; i++) {
            const boundary = gameMap[i]

            if (
                collision({
                    circle: {
                        ...pacman, movementSpeed: {
                            x: -5,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })) {
                pacman.movementSpeed.x = 0
                break
            } else {
                pacman.movementSpeed.x = -5
            }
        }
    } else if (keys.s.pressed && last == 's') {
        for (let i = 0; i < gameMap.length; i++) {
            const boundary = gameMap[i]

            if (
                collision({
                    circle: {
                        ...pacman, movementSpeed: {
                            x: 0,
                            y: 5
                        }
                    },
                    rectangle: boundary
                })) {
                pacman.movementSpeed.y = 0
                break
            } else {
                pacman.movementSpeed.y = 5
            }
        }
    } else if (keys.d.pressed && last == 'd') {
        for (let i = 0; i < gameMap.length; i++) {
            const boundary = gameMap[i]

            if (
                collision({
                    circle: {
                        ...pacman, movementSpeed: {
                            x: 5,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })) {
                pacman.movementSpeed.x = 0
                break
            } else {
                pacman.movementSpeed.x = 5
            }
        }
    }
    //
    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost = ghosts[i]
        if ((Math.hypot(ghost.position.x - pacman.position.x, ghost.position.y - pacman.position.y)) < (ghost.radius + pacman.radius)) {
            if(ghost.eatable){
                ghosts.splice(i, 1)
            }else{
                cancelAnimationFrame(animationid)
                rightText.innerHTML = "You Lose"
                //You Lose
            }           
        }
    }       

    for (let i = powerPellets.length - 1; 0 <= i; i--) {
        const powerPellet = powerPellets[i]
        powerPellet.generate()
        if ((Math.hypot(powerPellet.position.x - pacman.position.x, powerPellet.position.y - pacman.position.y)) < (powerPellet.radius + pacman.radius)) {
            powerPellets.splice(i, 1)
            pelletCounter--
            scoreVar += 100
            score.innerHTML = scoreVar

            ghosts.forEach((ghost) => {
                ghost.eatable = true
                setTimeout(()=> {
                    ghost.eatable = false
                }, 4000)
            })
        }
        if (scoreVar == 12300) {
            //You Win
            rightText.innerHTML = "You Win!"
            cancelAnimationFrame(animationid)
        }

    }

    for (let i = pellets.length - 1; 0 < i; i--) {
        const pellet = pellets[i]
        pellet.generate()

        if ((Math.hypot(pellet.position.x - pacman.position.x, pellet.position.y - pacman.position.y)) < (pellet.radius + pacman.radius)) {
            pellets.splice(i, 1)
            pelletCounter--
            scoreVar += 100
            score.innerHTML = scoreVar
            if (scoreVar == 12300) {
                //You Win
                rightText.innerHTML = "You Win!"
                cancelAnimationFrame(animationid)
                

            }
        }
    }
    gameMap.forEach((boundary) => {
        boundary.generate()
        if (
            collision({
                circle: pacman,
                rectangle: boundary
            })) {
            pacman.movementSpeed.x = 0
            pacman.movementSpeed.y = 0
        }
    })
    pacman.update()

    ghosts.forEach((ghost) => {
        ghost.update()

        //
        

        // if (pelletCounter == 0 || pellets.length == 0) {
        //     //You Win
        //     cancelAnimationFrame(animationid)
        // }

        const collisions = []
        gameMap.forEach(boundary => {
            /*
            if (
                !collisions.includes('down') && !collisions.includes('up') && !collisions.includes('left') &&
                collision({
                    circle: {
                        ...ghost, movementSpeed: {
                            x: -ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })) {
                collisions.push('right')
            }
            if (
                !collisions.includes('down') && !collisions.includes('up') && !collisions.includes('right') &&
                collision({
                    circle: {
                        ...ghost, movementSpeed: {
                            x: ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })) {
                    collisions.push('left')
            }
            if (
                !collisions.includes('down') && !collisions.includes('right') && !collisions.includes('left') &&
                collision({
                    circle: {
                        ...ghost, movementSpeed: {
                            x: 0,
                            y: ghost.speed
                        }
                    },
                    rectangle: boundary
                })) {
                    collisions.push('up')
            }
            */
            if (
                !collisions.includes('right') &&
                collision({
                    circle: {
                        ...ghost, movementSpeed: {
                            x: ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })) {
                collisions.push('right')
            }

            if (
                !collisions.includes('left') &&
                collision({
                    circle: {
                        ...ghost, movementSpeed: {
                            x: -ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })) {
                collisions.push('left')
            }

            if (
                !collisions.includes('up') &&
                collision({
                    circle: {
                        ...ghost, movementSpeed: {
                            x: 0,
                            y: -ghost.speed
                        }
                    },
                    rectangle: boundary
                })) {
                collisions.push('up')
            }
            if (
                !collisions.includes('down') &&
                collision({
                    circle: {
                        ...ghost, movementSpeed: {
                            x: 0,
                            y: ghost.speed
                        }
                    },
                    rectangle: boundary
                })) {
                collisions.push('down')
            }

        })
        if (collisions.length > ghost.prevCollisions.length) {
            ghost.prevCollisions = collisions
        }
        console.log(collisions)
        if ((JSON.stringify(collisions)) !== (JSON.stringify(ghost.prevCollisions))) {
            if (ghost.movementSpeed.x > 0) {
                ghost.prevCollisions.push('right')
            } else if (ghost.movementSpeed.x < 0) {
                ghost.prevCollisions.push('left')
            } else if (ghost.movementSpeed.y < 0) {
                ghost.prevCollisions.push('up')
            } else if (ghost.movementSpeed.y > 0) {
                ghost.prevCollisions.push('down')
            }
            if(collisions.includes('up') && collisions.includes('down') && collisions.includes('right')){
                const direction = 'left'
            }else if(collisions.includes('up') && collisions.includes('down') && collisions.includes('left')){
                const direction = 'right'
            }else if(collisions.includes('left') && collisions.includes('down') && collisions.includes('right')){
                const direction = 'up'
            }
            const paths = ghost.prevCollisions.filter((collision) => {
                return !collisions.includes(collision)
            })

            const direction = paths[Math.floor(Math.random() * paths.length)]

        

            switch (direction) {
                case 'down':
                    ghost.movementSpeed.y = ghost.speed
                    ghost.movementSpeed.x = 0
                    break
                case 'up':
                    ghost.movementSpeed.y = -ghost.speed
                    ghost.movementSpeed.x = 0
                    break
                case 'right':
                    ghost.movementSpeed.y = 0
                    ghost.movementSpeed.x = ghost.speed
                    break
                case 'left':
                    ghost.movementSpeed.y = 0
                    ghost.movementSpeed.x = -ghost.speed
                    break
            }
            ghost.prevCollisions = []
        }
    })
    if (pacman.movementSpeed.x > 0) {
        pacman.rotation = 0
    } else if (pacman.movementSpeed.x < 0) {
        pacman.rotation = Math.PI
    } else if (pacman.movementSpeed.y > 0) {
        pacman.rotation = Math.PI / 2
    } else if (pacman.movementSpeed.y < 0) {
        pacman.rotation = Math.PI * 1.5
    }
}

animation()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true
            last = 'w'
            break;
        case 'a':
            keys.a.pressed = true
            last = 'a'
            break;
        case 's':
            keys.s.pressed = true
            last = 's'
            break;
        case 'd':
            keys.d.pressed = true
            last = 'd'
            break;
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
        case 's':
            keys.s.pressed = false
            break;
        case 'd':
            keys.d.pressed = false
            break;
    }
})