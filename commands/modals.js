const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { requestCh, serverName } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('modals')
		.setDescription('Modalsのテスト'),
	async execute(interaction) {
        // const botName = client.user.username;
        // const botAvater = ;
        const userId = interaction.user.id; //コマンドを打った人のidを取得
        interaction.reply({content: test,  ephemeral: true});
	},
};