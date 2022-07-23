const discord = require('discord.js');
const client = new discord.Client({
    intents: Object.values(discord.Intents.FLAGS),
    allowedMentions: { parse:[] },
    partials: ['CHANNEL', 'GUILD_MEMBER', 'GUILD_SCHEDULED_EVENT', 'MESSAGE', 'REACTION', 'USER'],
});
const discordModals = require('discord-modals');
discordModals(client);
const { guildId } = require('./config.json');
require('dotenv').config();

const interaction_commands = require('./modules/interaction');
const modal = require('./modules/interaction/modal');
const commands = new interaction_commands('./commands');
commands.debug = false;

client.on('ready', async () => {
    console.log(`[${new Date().toLocaleTimeString('ja-JP')}][INFO]ready!`);
    console.table({
        'Bot User': client.user.tag,
        'Guild(s)': `${client.guilds.cache.size} Servers`,
        'Watching': `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
        'Discord.js': `v${discord.version}`,
        'Node.js': process.version,
        'Plattform': `${process.platform} | ${process.arch}`,
        'Memory': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`,
    });
    commands.register(client, guildId);
});

// Interaction処理
client.on('interactionCreate', interaction => {
  const cmd = commands.getCommand(interaction);
  try {
      cmd.exec(interaction, client);
  }
  catch (err) {
      console.log(err);
  }
});

// discord-modals
client.on('modalSubmit', interaction => {
    try {
        modal.execute(interaction, client);
    } catch (e) {
        console.log(e);
    }
});

client.login(process.env.BOT_TOKEN);