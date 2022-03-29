// token,guildId,clientId,modch,requestchはconfig.jsonに保存すること
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// ready nouniku!!()
client.once('ready', () => {
	console.log('Ready nouniku!!');
	client.user.setActivity(`DiscordBot-NoNickCraft`);
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// コマンド処理
client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
		}
	}
	if (interaction.isButton()) {
		if (interaction.customId == "button_copy") {
			const embed = interaction.message.embeds?.[0]?.fields;
			if (!embed) return;
			const edition = embed[0].value;
			const mcid = embed[1].value;
			if (edition == "BE版") {
				interaction.reply({ content: `/whitelist add .${mcid}`, ephemeral: true });
			}
			else {
				interaction.reply({ content: `/whitelist add ${mcid}`, ephemeral: true });
			}
		}
	}
});

client.login(token);