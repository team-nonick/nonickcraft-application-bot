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
const { beplayerprefix, playerrole, serverName, modCh, request_allow_img, request_forbid_img } = require('./config.json');
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
		if (interaction.customId == "button1_1") {
			// 「コマンドをコピー」ボタン
			const embed = interaction.message.embeds?.[0]?.fields; //interaction元の埋め込みのフィールドを取得
			if (!embed) return;
			const embed_string1 = embed[1].value; //申請者のエディション
			let embed_string2 = embed[2].value; //申請者のmcid
			if (embed_string1 == "BE版") {
				embed_string2 = beplayerprefix + embed_string2.replace(/\s+/g,'_');
			}
			interaction.reply({content: `/whitelist add ${embed_string2}`, ephemeral: true});
		}

		if (interaction.customId == "button1_2") {
			// 「許可」ボタン
			const embed = interaction.message.embeds?.[0]?.fields; //interaction元の埋め込みのフィールドを取得
			if (!embed) return;
			const embed_string1 = embed[0].value; //申請者のid
			const embed_string2 = embed[1].value; //申請者のエディション
			const embed_string3 = embed[2].value; //申請者のmcid
			const user_member = await interaction.guild.members.fetch(embed_string1); //ロール付与用に申請者のidを元にしたguildmemberを取得
			const user_op_id = interaction.user.id; //ボタン操作をした人のidを取得
			const embed0 = interaction.message; //interaction元のメッセージを取得

			const embed1 = new MessageEmbed() //interaction元の編集後の埋め込み
				.setColor('#64B383')
				.setTitle('申請 - 許可済み')
				.addFields(
					{name: '申請者', value: `<@${embed_string1}>`, inline: true},
					{name: 'MCID', value: `${embed_string3} (${embed_string2})`, inline: true},	
					{name: '申請を対応した人', value: `<@${user_op_id}>`}
				);

			const embed2 = new MessageEmbed() //申請者へ送るDM
				 .setColor('#6B86D1')
				 .setTitle(`${serverName}へようこそ!`)
				 .setDescription(`こんにちは! ${serverName}への申請が承認され、サーバーに参加できるようになったことをお知らせします!\n早速サーバーに参加して楽しもう!\n**注意:このメッセージを受け取ってから12時間以内に参加しないと、もう一回申請が必要になります!**`)
				 .addField(`申請が承認されたID`, `${embed_string3} (${embed_string2})`)
				 .addField(`Tips`, `サーバーに関する質問は、このBOTに送っても対応できません! Discordサーバーの質問チャンネルや、のにクラchatなどで皆さんに質問しましょう!`)
				 .setImage(request_allow_img);
			embed0.edit({embeds: [embed1], components: []});
			user_member.roles.add(playerrole);
			user_member.user.send({embeds: [embed2]}).catch(error => {
				interaction.reply(`<@${embed_string1}>の申請を許可しましたが、DMが送信できませんでした。\n別途DM対応をお願いします。`)
			}) 
			interaction.reply({content: `<@${embed_string1}>の申請を許可しました。`, ephemeral: true});
		}

		if (interaction.customId == "button1_3") {
			//「拒否」ボタン
			const embed0 = interaction.message.embeds?.[0]?.fields; //interaction元の埋め込みのフィールドを取得
			if (!embed0) return;
			const select1 = new MessageActionRow() //セレクト作成
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
			const embed1 = new MessageEmbed() //interaction元の編集後の埋め込み
					.setTitle(`元のメッセージ`)
					.addFields(
						{name: 'ユーザーID', value: `${embed0[0].value}`},
						{name: 'エディション', value: `${embed0[1].value}`, inline: true},	
						{name: 'MCID', value: `${embed0[2].value}`, inline: true },
						{name: '元のメッセージのID', value: `${interaction.message.id}`}
					);
			interaction.reply({ content: '申請を拒否する理由に最も当てはまるものを選択してください。', components: [select1], embeds: [embed1] ,ephemeral: true });
		}
	}

	if (interaction.isSelectMenu()) {
		// もしinteractionの中でセレクト操作があったら
		if (interaction.customId === 'reason_select') {
			// 却下理由のセレクト操作があったら
			const embed = interaction.message.embeds?.[0]?.fields; //interaction元の埋め込みのフィールドを取得
			if (!embed) return;
			const embed_string1 = embed[0].value; //申請者のid
			const embed_string2 = embed[1].value; //申請者のエディション
			const embed_string3 = embed[2].value; //申請者のmcid
			const embed_embed1 = await interaction.channel.messages.fetch(embed[3].value); //interaction元のチャンネルの埋め込みを取得
			const user_member = await interaction.guild.members.fetch(embed_string1);
			const user_op_id1 = interaction.user.id; //セレクト操作をした人のid
			const reason1 = interaction.values.map(v => reason[v]); //セレクト操作された「却下理由」の取得

			const embed1 = new MessageEmbed() //interaction元の編集後の埋め込み
				.setColor('#F61E29')
				.setTitle('申請 - 却下済み')
				.addFields(
					{name: '申請者', value: `<@${embed_string1}>`, inline: true},
					{name: 'MCID', value: `${embed_string3} (${embed_string2})`, inline: true},	
					{name: '申請を対応した人', value: `<@${user_op_id1}>`},
					{name: '却下した理由', value: `${reason1.join(',\n')}`}
				);

			const embed2 = new MessageEmbed() //申請者へ送るDM
				.setColor('#F61E29')
				.setTitle(`${serverName}からのお知らせ`)
				.setDescription(`こんにちは! 今回は${serverName}に申請を送っていただき、ありがとうございます!\n残念ですが、あなたは以下の理由により申請が却下されました。`)
				.addField('却下されたID', `${embed_string3} (${embed_string2})`)
				.addField('理由', `${reason1.join(',\n')}`)
				.addField('却下されたらどうすればいいの?',`上記の理由を良く確認していただき、まずは原因の改善を行いましょう。\n再申請は早くても一週間後から可能となります。\nそれ以前の再申請は無条件に全て却下されます。\n何か最申請について質問があれば、気軽にDMをよろしくお願いします。`)
				.setImage(request_forbid_img)
			embed_embed1.edit({embeds: [embed1] , components: []});
			user_member.user.send({embeds: [embed2]}).catch(error => {
				interaction.guild.channels.cache.get(modCh).send(`<@${embed_string1}>の申請を拒否しましたが、DMが送信できませんでした。\n別途DM対応をお願いします。`);
			}) 
			interaction.reply({content: `<@${embed_string1}>の申請を拒否しました。`, ephemeral: true});
		}
	}
});

// BOTにログイン
client.login(process.env.BOT_TOKEN);