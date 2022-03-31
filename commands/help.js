const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('このBOTの情報を閲覧できます'),
	async execute(interaction) {
	},
};