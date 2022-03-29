const { SlashCommandBuilder } = require('@discordjs/builders');
/* const { requestch, modch } = require('../config.json'); */

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
		const edition = interaction.options.getString('edition');
		const mcid = interaction.options.getString('mcid');
		await interaction.reply(`${mcid},準備中だよ`);
	},
}; 