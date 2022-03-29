// リクエストコマンド
// エディションとMCIDを取得させ、申請を申請側とMODチャンネル側に送信する。
const { SlashCommandBuilder, channelMention } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { requestch, modch } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('request')
		.setDescription(`NoNICK's SERVERへの参加申請を送信します。`)
		.addStringOption(option =>
			option.setName('edition')
				.setDescription('Minecraftのエディションを指定してください。')
				.addChoice('JAVA版', 'JAVA')
				.addChoice('BE版(統合版)', 'BE')
				.setRequired(true))
		.addStringOption(option2 =>
			option2.setName('mcid')
				.setDescription('MinecraftのIDを入力してください。(大文字小文字の違いも認識されます)')
				.setRequired(true)),

	async execute(interaction) {
		//コマンドの値色々
		const edition = interaction.options.getString('edition');
		const mcid = interaction.options.getString('mcid');
		//コマンドを打った人の情報を取得
		const userid = interaction.user.id;
		const useravater = interaction.user.displayAvatarURL();
		//ここからコマンド処理
		const embed = new MessageEmbed()
			.setColor(`#5662F6`)
			.setTitle('申請完了')
			.setThumbnail(useravater)
			.setDescription('以下の情報で申請を送信しました。\n__Tips:登録には時間がかかる場合があります。__')
			.addFields(
				{ name: 'エディション', value: `${edition}版`, inline: true },	
				{ name: 'MCID', value: `${mcid}`, inline: true }
			);
		await interaction.reply({ embeds: [embed] });
		const embed_mod = new MessageEmbed()
			.setColor(`#56B482`)
			.setTitle('新しい申請が送信されました!')
			.setDescription(`申請者:<@${userid}>`)
			.setThumbnail(useravater)
			.addFields(
				{ name: 'エディション', value: `${edition}版`, inline: true },	
				{ name: 'MCID', value: `${mcid}`, inline: true }
			);
		await interaction.guild.channels.cache.get(modch).send({ embeds: [embed_mod] });
	},
}; 