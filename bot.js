const mineflayer = require('mineflayer')

const HOST = process.env.SERVER_HOST
const PORT = parseInt(process.env.SERVER_PORT || '25565', 10)
const USERNAME = process.env.BOT_USERNAME || 'AfkBot'
const VERSION = process.env.MC_VERSION || false
const AUTH = process.env.AUTH_TYPE || 'offline'
const RUN_MINUTES = parseInt(process.env.RUN_MINUTES || '5', 10)
const PASSWORD = process.env.BOT_PASSWORD || undefined

if (!HOST) {
  console.error('SERVER_HOST is not set')
  process.exit(1)
}

const bot = mineflayer.createBot({
  host: HOST,
  port: PORT,
  username: USERNAME,
  password: PASSWORD,
  auth: AUTH,
  version: VERSION
})

let moveInterval = null

bot.once('spawn', () => {
  console.log(`Spawned as ${bot.username} on ${HOST}:${PORT}`)

  moveInterval = setInterval(() => {
    if (!bot.entity) return
    bot.setControlState('jump', true)
    setTimeout(() => bot.setControlState('jump', false), 300)

    const yaw = Math.random() * Math.PI * 2
    bot.look(yaw, 0, true)
  }, 20000)

  setTimeout(() => {
    console.log(`Run time of ${RUN_MINUTES} minute(s) reached, disconnecting cleanly`)
    bot.quit()
  }, RUN_MINUTES * 60 * 1000)
})

bot.on('chat', (username, message) => {
  console.log(`<${username}> ${message}`)
})

bot.on('kicked', (reason) => {
  console.log('Kicked:', reason)
})

bot.on('error', (err) => {
  console.log('Error:', err.message)
})

bot.on('end', () => {
  if (moveInterval) clearInterval(moveInterval)
  console.log('Disconnected, exiting process')
  process.exit(0)
})
