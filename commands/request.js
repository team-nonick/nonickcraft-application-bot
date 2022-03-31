// リクエストコマンド
// エディションとMCIDを取得させ、申請を申請側とMODチャンネル側に送信する。

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { requestCh, modCh, serverName } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('request')
		.setDescription(`${serverName}への参加申請を送信します。`)
		.addStringOption(option =>
			option.setName('edition')
				.setDescription('Minecraftのエディションを指定してください。')
				.addChoice('JAVA版', 'JAVA')
				.addChoice('BE版(統合版)', 'BE')
				.setRequired(true)
		)
		.addStringOption(option2 =>
			option2.setName('mcid')
				.setDescription('MinecraftのIDを入力してください。(大文字小文字の違いも認識されます)')
				.setRequired(true)
		),

	async execute(interaction) {
		const edition = interaction.options.getString('edition'); //コマンドを打った人のmcid
		const mcid = interaction.options.getString('mcid'); //コマンドを打った人のmcid
		const userId = interaction.user.id; //コマンドを打った人のid
		const userAvater = interaction.user.avatarURL(); //コマンドを打った人のアバターURL
		const sendCh = interaction.channelId //コマンドを発動したチャンネル

		if (sendCh === requestCh) {
			// 申請側にメッセージを送信
			const embed = new MessageEmbed()
				.setColor(`#5662F6`)
				.setTitle('申請完了')
				.setThumbnail(userAvater)
				.setDescription(`以下の情報で申請を送信しました。\n**Tips:**登録には時間がかかる場合があります。\n__正しく申請を受け取るには、DMを開放しておいてください!__`)
				.addFields(
					{name: 'エディション', value: `${edition}版`, inline: true},	
					{name: 'MCID', value: `${mcid}`, inline: true}
				);
			interaction.reply({ embeds: [embed] });

			// MODチャンネル側に申請対応メッセージを送信
			//↑につけるボタンボタン
			const buttons = new MessageActionRow()
				.addComponents(
					new MessageButton()
					.setCustomId('button_copy')
					.setLabel('コマンドをコピー')
					.setEmoji('📃')
					.setStyle('PRIMARY'),
				)
				.addComponents(
					new MessageButton()
					.setCustomId('button_ok')
					.setLabel('許可')
					.setStyle('SUCCESS'),
				)
				.addComponents(
					new MessageButton()
					.setCustomId('button_ng')
					.setLabel('拒否')
					.setStyle('DANGER'),
				);
			
			//埋め込み
			const embed_mod = new MessageEmbed()
				.setColor('#56B482')
				.setTitle('申請 - 新しい申請が送信されました!')
				.setDescription(`申請者:<@${userId}>`)
				.setThumbnail(userAvater)
				.addFields(
					{name: 'ユーザーID', value: `${userId}` },
					{name: 'エディション', value: `${edition}版`, inline: true},	
					{name: 'MCID', value: `${mcid}`, inline: true}
				);
			await interaction.guild.channels.cache.get(modCh).send({ embeds: [embed_mod], components: [buttons] });
		} else {
			// もし申請チャンネル以外で送っていた場合にエラーを表示
			const embed_error = new MessageEmbed()
				.setColor('#E84136')
				.setDescription(`<#${requestCh}>以外でこのコマンドを使うことはできません!`);
			interaction.reply({embeds: [embed_error], ephemeral: true});
		}
	},
}; 