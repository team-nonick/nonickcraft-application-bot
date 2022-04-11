//Repl.itでホスティングをする場合は、このコードを有効化する必要がある

/*
"use strict";
const http = require('http');
http.createServer(function(req, res) {
	res.write("ready nouniku!!");
	res.end();
}).listen(8080);
*/

const fs = require('node:fs');
const { Client, Collection, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { beplayerprefix, playerrole, serverName, modCh } = require('./config.json');
const discordModals = require('discord-modals');
const reason = require('./reason.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

discordModals(client);
require('dotenv').config();

// ready nouniku!!()
client.once('ready', () => {
	console.log('[DiscordBot-NoNickCraft]'+'\u001b[32m'+' DiscordBotが起動しました。'+'\u001b[0m');
	client.user.setActivity(`${serverName}`);
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
			await command.execute(interaction,client);
		} catch (error) {
			console.error(error);
			const embed = new MessageEmbed()
				.setColor('#F61E2')
				.setDescription('コマンドの実行中にエラーが発生しました。開発者にご連絡ください。')
			await interaction.reply({embeds: [embed], ephemeral: true});
		}
	}
	if (interaction.isButton()) {
		// もしinteractionの中でボタン操作があったら
		if (interaction.customId == "button_copy") {
			// 「コマンドをコピー」ボタン
			const embed = interaction.message.embeds?.[0]?.fields; //interaction元の埋め込みのフィールドを取得
			if (!embed) return;
			const edition = embed[1].value; //申請者のエディション
			const mcid = embed[2].value; //申請者のmcid
			if (edition == "BE版") {
				interaction.reply({content: `/whitelist add ${beplayerprefix}${mcid}`, ephemeral: true});
			} else {
				interaction.reply({content: `/whitelist add ${mcid}`, ephemeral: true});
			}
		}

		if (interaction.customId == "button_ok") {
			// 「許可」ボタン
			const embed = interaction.message.embeds?.[0]?.fields; //interaction元の埋め込みのフィールドを取得
			if (!embed) return;
			const requestId = embed[0].value; //申請者のid
			const edition = embed[1].value; //申請者のエディション
			const mcid = embed[2].value; //申請者のmcid
			const member = await interaction.guild.members.fetch(requestId); //ロール付与用に申請者のidを元にしたguildmemberを取得
			const beforeembed = interaction.message; //interaction元のメッセージを取得
			const clickuserId = interaction.user.id; //ボタン操作をした人のidを取得
			const afterembed = new MessageEmbed() //interaction元の編集後の埋め込み
				.setColor('#64B383')
				.setTitle('申請 - 許可済み')
				.addFields(
					{name: '申請者', value: `<@${requestId}>`, inline: true},
					{name: 'MCID', value: `${mcid} (${edition})`, inline: true},	
					{name: '申請を対応した人', value: `<@${clickuserId}>`}
				);
			const dm = new MessageEmbed() //申請者へ送るDM
				 .setColor('#6B86D1')
				 .setTitle(`${serverName}へようこそ!`)
				 .setDescription(`こんにちは! ${serverName}への申請が承認され、サーバーに参加できるようになったことをお知らせします!\n早速サーバーに参加して楽しもう!\n**注意:このメッセージを受け取ってから12時間以内に参加しないと、もう一回申請が必要になります!**`)
				 .addField(`申請が承認されたID`, `${mcid} (${edition})`)
				 .addField(`Tips`, `サーバーに関する質問は、このBOTに送っても対応できません! Discordサーバーの質問チャンネルや、のにクラchatなどで皆さんに質問しましょう!`)
				 .setImage('https://cdn.discordapp.com/attachments/958791423161954445/958791575515824178/info.png');
			beforeembed.edit({embeds: [afterembed], components: []});
			member.roles.add(playerrole);
			member.user.send({embeds: [dm]}).catch(error => {
				interaction.reply(`<@${requestId}>の申請を許可しましたが、DMが送信できませんでした。\n別途DM対応をお願いします。`)
			}) 
		}

		if (interaction.customId == "button_ng") {
			//「拒否」ボタン
			// 埋め込みから申請者の情報を取得
			const embed = interaction.message.embeds?.[0]?.fields; //interaction元の埋め込みのフィールドを取得
			if (!embed) return;
			const select = new MessageActionRow() //セレクト作成
				.addComponents(
					new MessageSelectMenu()
						.setCustomId('reason_select')
						.setPlaceholder('ここから選択')
						.addOptions([
							{
								label: '直近半年間の不正ツールの使用',
								description: 'ゲーム全般のハック等の不正全般を指します。',
								value: 'reason_one',
							},
							{
								label: '直近一年間の他サーバーでの荒らし行為',
								value: 'reason_two',
							},
							{
								label: 'レベルの上げ方が不適切である',
								description: 'スパムや関係ないメッセージを送信してレベルを上げている。',
								value: 'reason_three',
							},
							{
								label: 'Discordサーバーのルールが守れていない',
								value: 'reason_four',
							},
							// 機能が実装されたら消す
							{
								label: '既にそのIDが登録されている',
								value: 'reason_five',
							},
							{
								label: 'その他',
								value: 'reason_six',
							}
						]),
				);
			const copy_embed = new MessageEmbed() //interaction元の編集後の埋め込み
					.setTitle(`元のメッセージ`)
					.addFields(
						{name: 'ユーザーID', value: `${embed[0].value}`},
						{name: 'エディション', value: `${embed[1].value}`, inline: true},	
						{name: 'MCID', value: `${embed[2].value}`, inline: true },
						{name: '元のメッセージのID', value: `${interaction.message.id}`}
					);
			interaction.reply({ content: '申請を拒否する理由に最も当てはまるものを選択してください。', components: [select], embeds: [copy_embed] ,ephemeral: true });
		}
	}

	if (interaction.isSelectMenu()) {
		// もしinteractionの中でセレクト操作があったら
		if (interaction.customId === 'reason_select') {
			// 却下理由のセレクト操作があったら
			const embed = interaction.message.embeds?.[0]?.fields; //interaction元の埋め込みのフィールドを取得
			if (!embed) return;
			const requestId = embed[0].value; //申請者のid
			const edition = embed[1].value; //申請者のエディション
			const mcid = embed[2].value; //申請者のmcid
			const message = await interaction.channel.messages.fetch(embed[3].value); //interaction元のチャンネルの埋め込みを取得
			const user = await client.users.fetch(requestId); //申請者のidからclient.userを取得
			const clickuserId = interaction.user.id; //セレクト操作をした人のid
			const reason_send = interaction.values.map(v => reason[v]); //セレクト操作された「却下理由」の取得
			const afterembed = new MessageEmbed() //interaction元の編集後の埋め込み
				.setColor('#F61E29')
				.setTitle('申請 - 却下済み')
				.addFields(
					{name: '申請者', value: `<@${requestId}>`, inline: true},
					{name: 'MCID', value: `${mcid} (${edition})`, inline: true},	
					{name: '申請を対応した人', value: `<@${clickuserId}>`},
					{name: '却下した理由', value: `${reason_send.join(',\n')}`}
				);
			const dm = new MessageEmbed() //申請者へ送るDM
				.setColor('#F61E29')
				.setTitle(`${serverName}からのお知らせ`)
				.setDescription(`こんにちは! 今回は${serverName}に申請を送っていただき、ありがとうございます!\n残念ですが、あなたは以下の理由により申請が却下されました。`)
				.addField('却下されたID', `${mcid} (${edition})`)
				.addField('理由', `${reason_send.join(',\n')}`)
				.addField('却下されたらどうすればいいの?',`上記の理由を良く確認していただき、まずは原因の改善を行いましょう。\n再申請は早くても一週間後から可能となります。\nそれ以前の再申請は無条件に全て却下されます。\n何か最申請について質問があれば、気軽にDMをよろしくお願いします。`)
				.setImage('https://cdn.discordapp.com/attachments/958791423161954445/958791518225854614/2022-01-26_11.png')
			
			message.edit({embeds: [afterembed] , components: []});
			member.user.send({embeds: [dm]}).catch(error => {
				interaction.guild.channels.cache.get(modCh).send(`<@${requestId}>の申請を拒否しましたが、DMが送信できませんでした。\n別途DM対応をお願いします。`);
			}) 
			interaction.reply({content: `<@${requestId}>の申請を拒否しました。`, ephemeral: true});
		}
	}
});

// BOTにログイン
client.login(process.env.BOT_TOKEN);