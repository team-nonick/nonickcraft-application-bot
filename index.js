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
			// ホワリス追加コマンドを自動生成
			const embed = interaction.message.embeds?.[0]?.fields;
			if (!embed) return;
			const edition = embed[1].value;
			const mcid = embed[2].value;
			if (edition == "BE版") {
				interaction.reply({ content: `/whitelist add .${mcid}`, ephemeral: true });
			}
			else {
				interaction.reply({ content: `/whitelist add ${mcid}`, ephemeral: true });
			}
		}

		if (interaction.customId == "button_ok") {
			// 申請を許可
			const embed = interaction.message.embeds?.[0]?.fields;
			if (!embed) return;
			const requestId = embed[0].value;
			const edition = embed[1].value;
			const mcid = embed[2].value;
			//	世界一無駄な二度手間 (修正予定)
			interaction.reply({ content: `<@${requestId}>の申請を承認しました`, ephemeral: true });
			const user = await client.users.fetch(`${requestId}`);
			user.send({ content: `**NoNICK's SERVERへようこそ!**\nこんにちは! NoNICK's SERVERへの申請が受理され、サーバーに参加できるようになったことをお知らせします！\n早速サーバーに参加して楽しもう!\n**注意:このメッセージを受け取ってから12時間以内に参加しないと、もう一回申請が必要になります!**\n\n**申請が受理されたID:** ${mcid} (${edition})\n\n**Tips:**サーバーに関する質問は、このBOTに送っても対応できません! Discordサーバーの質問チャンネルや、のにクラchatなどで皆さんに質問しましょう!`, files: ['./img/info.png'] });
		}
	}
});

client.login(token);