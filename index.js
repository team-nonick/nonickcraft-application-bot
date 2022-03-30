// token,guildId,clientId,modch,requestchはconfig.jsonに保存すること
const fs = require('node:fs');
const { Client, Collection, Intents, MessageEmbed, GuildMember, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { token, beplayerprefix, playerrole } = require('./config.json');

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
			// 埋め込みから申請者の情報を取得
			const embed = interaction.message.embeds?.[0]?.fields;
			if (!embed) return;
			const edition = embed[1].value;
			const mcid = embed[2].value;
			if (edition == "BE版") {
				// もし統合版なら、IDの前にbeplayerprefix変数を追加する(config.json)
				interaction.reply({ content: `/whitelist add ${beplayerprefix}${mcid}`, ephemeral: true });
			}
			else {
				interaction.reply({ content: `/whitelist add ${mcid}`, ephemeral: true });
			}
		}

		if (interaction.customId == "button_ok") {
			// 申請を許可する
			// 埋め込みから申請者の情報を取得
			const embed = interaction.message.embeds?.[0]?.fields;
			if (!embed) return;
			const requestId = embed[0].value;
			const edition = embed[1].value;
			const mcid = embed[2].value;
			// const user = await client.users.fetch(`${requestId}`);
			const member = await interaction.guild.members.fetch(requestId);
			// 埋め込み自体の情報を取得
			const beforeembed = interaction.message;
			// ボタンを押した人の情報を取得
			const clickuserId = interaction.user.id;

			// 編集後の埋め込み・ボタン
			// ボタンの押し間違えた際のUndo処理を追加するには書き方を変える必要がある
			const after_button =  new MessageActionRow()
				.addComponents(
					new MessageButton()
					.setCustomId('ok')
					.setLabel('許可済み')
					.setStyle('SUCCESS')
					.setDisabled(true),
				)
			
			const afterembed = new MessageEmbed()
				.setColor('#64B383')
				.setTitle('申請 - 対応済み')
				.addFields(
					{ name: '申請者', value: `<@${requestId}>`, inline: true },
					{ name: 'MCID', value: `${mcid} (${edition})`, inline: true },	
					{ name: '申請を対応した人', value: `<@${clickuserId}>` }
				);

			//	世界一無駄な二度手間 (修正予定)
			await interaction.reply({ content: `<@${requestId}>の申請を許可しました`, ephemeral: true });
			member.roles.add(playerrole);

			const dm = new MessageEmbed()
				 .setColor('#6B86D1')
				 .setTitle("NoNICK's SERVERへようこそ!")
				 .setDescription(`こんにちは! NoNICKNoNICK's SERVERへの申請が承認され、サーバーに参加できるようになったことをお知らせします！
				 早速サーバーに参加して楽しもう!
				 **注意:このメッセージを受け取ってから12時間以内に参加しないと、もう一回申請が必要になります!**`)
				 .addField(`申請が承認されたID`, `${mcid} (${edition})`)
				 .addField(`Tips`, `サーバーに関する質問は、このBOTに送っても対応できません! Discordサーバーの質問チャンネルや、のにクラchatなどで皆さんに質問しましょう!`)
				 .setImage('https://cdn.discordapp.com/attachments/908993379566747659/958745736852435014/info.png');
				 member.user.send({embeds: [dm]});
			await beforeembed.edit({ embeds: [afterembed], components: [after_button] });
		}

		if (interaction.customId == "button_copy-copy") {
			const embed = interaction.message.embeds?.[0]?.fields;
			if (!embed) return;
			const mcid = embed[1].value;
			interaction.reply({ content: `${mcid}`, ephemeral: true });
		}

		if (interaction.customId == "button_ng") {
			const select = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
						.setCustomId('select')
						.setPlaceholder('ここから選択')
						.addOptions([
							{
								label: '直近半年間に不正が発覚している',
								description: 'Minecraftのみならず、ゲーム全般にてハック等の不正全般を指します。',
								value: 'reason_one',
							},
							{
								label: '他Minecraftサーバーで荒らしの経験がある',
								description: '荒らしはやめなさい',
								value: 'reason_two',
							},
							{
								label: 'レベルの上げ方が適切ではない',
								description: '半ばスパムや関係ないメッセージを送信してレベルを上げている。',
								value: 'reason_three',
							},

						]),
				);
			await interaction.reply({ content: '申請を拒否する理由に最も当てはまるものを選択してください。', components: [select], ephemeral: true });
		}
	}
});

client.login(token);