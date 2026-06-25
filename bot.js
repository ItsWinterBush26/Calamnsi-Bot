const mineflayer = require('mineflayer');
const mc = require('minecraft-protocol');

const MC_HOST = process.env.MC_HOST || 'localhost';
const MC_PORT = parseInt(process.env.MC_PORT || '25565');
const MC_USERNAME = process.env.MC_USERNAME || 'GitHubBot';
const MC_VERSION = process.env.MC_VERSION || '1.20.1'; // Match your server version

async function checkAndJoin() {
  console.log(`Pinging ${MC_HOST}:${MC_PORT}...`);
  
  try {
    const options = { host: MC_HOST, port: MC_PORT, version: MC_VERSION };
    const result = await mc.ping(options);
    
    const playersOnline = result.players?.online ?? 0;
    console.log(`Players online: ${playersOnline}`);

    if (playersOnline === 0) {
      console.log('Server is empty. Joining server...');
      
      const bot = mineflayer.createBot({
        host: MC_HOST,
        port: MC_PORT,
        username: MC_USERNAME,
        version: MC_VERSION,
        auth: 'offline' // Change to 'microsoft' if your server requires premium accounts
      });

      bot.once('spawn', () => {
        console.log('Successfully spawned in! Keeping server alive...');
        // Wait 10 seconds before leaving
        setTimeout(() => {
          console.log('Disconnecting.');
          bot.quit();
          process.exit(0);
        }, 10000);
      });

      bot.on('error', (err) => {
        console.error('Bot encountered an error:', err);
        process.exit(1);
      });

      bot.on('kicked', (reason) => {
        console.log('Bot was kicked:', reason);
        process.exit(0);
      });

    } else {
      console.log('Players are already online. No action needed.');
      process.exit(0);
    }
  } catch (error) {
    console.error('Failed to ping or connect to the server:', error);
    process.exit(1);
  }
}

checkAndJoin();
