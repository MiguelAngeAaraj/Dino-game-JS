const ground = document.querySelector('[data-ground]')
const dino = document.querySelector('[data-dino]')
const container = document.querySelector('[data-grounds]')
const startup = document.querySelector('.start')
const sun_moon = document.querySelector('[data-sun-moon]')
const body = document.querySelector('body')
const score = document.querySelector('[data-score]')
const SPEED_INTERVAL = 0.00001
let lastTime = null
let SpeeScale
let ScoreHigh = 200
const timetostart = 1000
window.addEventListener(
  'touchstart',
  () => {
    ChangeOrientation('landscape')
    setTimeout(() => {
      Start()
    }, timetostart)
  },
  { once: true },
)
window.addEventListener('keyup', (e) => Start(), { once: true })
window.addEventListener('click', () => {
  ChangeOrientation('landscape')
})
function update(time) {
  if (lastTime === null) {
    lastTime = time
    requestAnimationFrame(update)
    return
  }
  const delta = time - lastTime
  SpeeScale = delta * SPEED_INTERVAL
  Score(SpeeScale, delta)
  updateGround(delta, ground, '--left', SpeeScale)
  handleDino(dino, delta, SpeeScale)
  CactusFunctionality(container, delta, SpeeScale)
  if (LoseOrNot() == true) {
    HandleLose()
    return
  }
  requestAnimationFrame(update)
}

function LoseOrNot() {
  const rect = cactusesRect(document.querySelectorAll('.cactuses'))
  const dinoRect = getDinorRect(dino)
  if (rect.length == 0) return
  return rect.some((rectangle) => isColision(rectangle, dinoRect))
}
function isColision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  )
}
function Score(SpeedScale, delta) {
  const scores = Math.floor(0.03 * delta * SpeedScale)
  score.textContent = scores
  if (scores >= ScoreHigh) {
    changeTheme()
    ScoreHigh += 200
  }
}
function changeTheme() {
  if (body.classList.contains('day') && sun_moon.classList.contains('sun')) {
    body.classList.remove('day')
    body.classList.add('night')
    sun_moon.classList.remove('sun')
    sun_moon.classList.add('moon')
  } else {
    body.classList.remove('night')
    body.classList.add('day')
    sun_moon.classList.remove('moon')
    sun_moon.classList.add('sun')
  }
}
function HandleLose() {
  lastTime = null
  ScoreHigh = 200
  LoseDino(dino)
  setTimeout(() => {
    RemoveCactuses(document.querySelectorAll('.cactuses'))
    resetGround(ground, '--left')
    ShowRestart()
  }, 200)
}
function ShowRestart() {
  restart()
  window.removeEventListener(
    'touchstart',
    () => {
      ChangeOrientation('landscape')
      setTimeout(() => {
        Start()
      }, timetostart)
    },
    { once: true },
  )
  window.removeEventListener('keyup', (e) => Start(), { once: true })
  window.addEventListener(
    'touchstart',
    () => {
      ChangeOrientation('landscape')
      setTimeout(() => {
        Start()
      }, timetostart)
    },
    { once: true },
  )
  window.addEventListener('keyup', (e) => Start(), { once: true })
}
function Start() {
  startup.classList.add('hide')
  sun_moon.classList.add('sun')
  body.classList.add('day')
  if (dino.src == `imgs/dino-lose.png`) {
    dino.src = `imgs/dino-stationary.png`
  }
  requestAnimationFrame(update)
}
function restart() {
  startup.classList.remove('hide')
  sun_moon.classList.remove('sun')
  body.classList.remove('day')
  score.textContent = 0
}
function ChangeOrientation(orientation) {
  let doc = document.documentElement
  if (doc.requestFullscreen) {
    doc.requestFullscreen()
  } else if (doc.mozRequestFullscreen) {
    doc.mozRequestFullscreen()
  } else if (doc.webkitRequestFullscreen) {
    doc.webkitRequestFullscreen()
  } else if (doc.msRequestFullscreen) {
    doc.msRequestFullscreen()
  }

  screen.orientation.lock(orientation)
}

// compute functions
function getComputedItem(prop, value) {
  return parseFloat(getComputedStyle(prop).getPropertyValue(value))
}
function SetComputedItem(prop, String, value) {
  prop.style.setProperty(String, value)
}
function incrementProperty(prop, String, inc) {
  SetComputedItem(prop, String, getComputedItem(prop, String) + inc)
}
function decrementProperty(prop, String, dec) {
  SetComputedItem(prop, String, getComputedItem(prop, String) - dec)
}

// cactuses codes

const SPEED_Cactus = 0.02
const SPEED_SPAWN = 0.05
let cactuses
let cactusesrect = []
let Spawn = 150
function CactusFunctionality(container, delta, SpeedScale) {
  const currentTime = Math.floor(delta * SPEED_SPAWN)
  if (currentTime >= Spawn) {
    if (currentTime > 400) {
      Spawn += 70
    } else {
      Spawn += 150
    }
    container.appendChild(createCactuses(delta, SpeedScale))
    cactuses = document.querySelectorAll('.cactuses')
  }
  movecactuses(cactuses, delta, SpeedScale)
}
function createCactuses(delta, Speed) {
  const div = document.createElement('div')
  div.className = 'cactuses'
  div.style.setProperty('--leftCactus', 1300)

  const number = Math.floor(Math.random() * 3) + 1
  for (let i = 0; i <= number; i++) {
    const img = document.createElement('img')
    img.src = 'imgs/cactus.png'
    div.appendChild(img)
  }
  return div
}
function movecactuses(AllCactuses, delta, Speed) {
  if (AllCactuses === undefined) return
  cactuses = document.querySelectorAll('.cactuses')
  let SD =
    SPEED_Cactus * delta * Speed >= 40
      ? 37.3046126027776004
      : SPEED_Cactus * delta * Speed
  cactuses.forEach((cactus) => {
    if (getComputedItem(cactus, '--leftCactus') < -100) {
      cactus.remove()
    }
    decrementProperty(cactus, '--leftCactus', SD)
  })
}
function cactusesRect(cactuses) {
  if (cactuses === undefined) return
  cactusesrect.length = 0
  cactuses.forEach((cactus) => {
    cactusesrect.push(cactus.getBoundingClientRect())
  })
  return cactusesrect
}
function RemoveCactuses(cactuses) {
  cactuses.forEach((cactus) => cactus.remove())
  Spawn = 150
}

// ground function
const SPEED_Ground = 0.03

function updateGround(delta, ground, Property, speed) {
  let SD =
    SPEED_Ground * delta * -1 * speed <= -50
      ? -47.3046126027776004
      : SPEED_Ground * delta * -1 * speed
  incrementProperty(ground, Property, SD)
  if (getComputedItem(ground, Property) <= -100) {
    SetComputedItem(ground, Property, 0)
  }
}
function resetGround(ground, property) {
  SetComputedItem(ground, property, 0)
}

// dino functions

let dinoCount = 2
let dino_run = 0
let currentTime
let time = 100
let isJumping = false
function handleDino(dino, delta, Speed) {
  dinoSrc(dino, delta, Speed)
  handleJunping(dino)
}

function dinoSrc(dino, delta, Speed) {
  if (time >= 100 && !isJumping) {
    currentTime = Math.floor(dino_run % dinoCount)
    dino_run++
    dino.src = `imgs/dino-run-${currentTime}.png`
    time -= 100
  }
  time += 20
}
function handleJunping(dino) {
  document.removeEventListener('keydown', (e) => handleJump(e, dino, 0))
  document.addEventListener('keydown', (e) => handleJump(e, dino, 0))
  document.removeEventListener('touchstart', (e) => handleJump(e, dino, 1))
  document.addEventListener('touchstart', (e) => handleJump(e, dino, 1))
}
function handleJump(e, dino, number) {
  if (number == 0) {
    if (e.code == 'Space' && !isJumping) {
      isJumping = true
      incrementProperty(
        dino,
        '--bottom',
        getComputedItem(dino, '--bottom') + 59,
      )
      dino.src = `imgs/dino-stationary.png`
      setTimeout(() => {
        SetComputedItem(dino, '--bottom', 86)
        setTimeout(() => {
          isJumping = false
          time = 100
        }, 230)
      }, 500)
    }
  } else {
    if (!isJumping) {
      isJumping = true
      incrementProperty(
        dino,
        '--bottom',
        getComputedItem(dino, '--bottom') + 59,
      )
      dino.src = `imgs/dino-stationary.png`
      setTimeout(() => {
        SetComputedItem(dino, '--bottom', 86)
        setTimeout(() => {
          isJumping = false
          time = 100
        }, 230)
      }, 500)
    }
  }
}
function getDinorRect(dino) {
  return dino.getBoundingClientRect()
}
function LoseDino(dino) {
  dino.src = `imgs/dino-lose.png`
  time = 100
}
