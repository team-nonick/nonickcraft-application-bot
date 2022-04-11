// リクエストコマンド
// エディションとMCIDを取得させ、申請を申請側とMODチャンネル側に送信する。

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { requestCh, modCh, serverName, enable_Request } = require('../config.json');

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
		const command_string1 = interaction.options.getString('edition'); //コマンドを打った人のmcid
		const command_string2 = interaction.options.getString('mcid'); //コマンドを打った人のmcid
		const command_channel1 = interaction.channelId //コマンドを発動したチャンネル
		const user_id1 = interaction.user.id; //コマンドを打った人のid
		const user_avater1 = interaction.user.avatarURL(); //コマンドを打った人のアバターURL

		// もし申請チャンネル以外で送っていた場合にエラーを表示
		if (!(command_channel1 === requestCh)) {
			const embed = new MessageEmbed()
			.setColor('#E84136')
			.setDescription(`<#${requestCh}>以外でこのコマンドを使うことはできません!`);
			interaction.reply({embeds: [embed], ephemeral: true});
			return;
		}

		// 申請の受付を停止していたらメッセージを返す
		if (!enable_Request) {
			const embed = new MessageEmbed()
			.setColor('#E84136')
			.setDescription(`只今、申請は受付を停止しています。`);
			interaction.reply({embeds: [embed], ephemeral: true});
			return;
		}

		// 申請側にメッセージを送信
		const embed1 = new MessageEmbed()
			.setColor(`#5662F6`)
			.setTitle('申請完了')
			.setThumbnail(user_avater1)
			.setDescription(`以下の情報で申請を送信しました。\n**Tips:**登録には時間がかかる場合があります。\n__正しく申請を受け取るには、DMを開放しておいてください!__`)
			.addFields(
				{name: 'エディション', value: `${command_string1}版`, inline: true},	
				{name: 'MCID', value: `${command_string2}`, inline: true}
			);
			interaction.reply({ embeds: [embed1] });

		// モデレーター用メッセージ
		const button = new MessageActionRow()
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

		const embed2 = new MessageEmbed()
			.setColor('#56B482')
			.setTitle('申請 - 新しい申請が送信されました!')
			.setDescription(`申請者:<@${user_id1}>`)
			.setThumbnail(user_avater1)
			.addFields(
				{name: 'ユーザーID', value: `${user_id1}` },
				{name: 'エディション', value: `${command_string1}版`, inline: true},	
				{name: 'MCID', value: `${command_string2}`, inline: true}
			);
		await interaction.guild.channels.cache.get(modCh).send({ embeds: [embed2], components: [button] });
	},
}; 