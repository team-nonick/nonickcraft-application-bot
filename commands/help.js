const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { serverName, botName } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('自身が使用可能なコマンドを確認します。'),
	async execute(interaction) {
        const user_id = interaction.user.id; //コマンドを打った人のidを取得
        const embed = new MessageEmbed()
            .setTitle(botName)
            .setColor('#FFFFFF')
            .setDescription(`**Minecraftサーバー運営のお手伝いをするBOT**\n<@${user_id}>さん、こんにちは!\n以下から利用可能なコマンドを確認できます!`)
            .addFields(
                {name: '/help', value: '自身が使用可能なコマンドを確認します。'},
                {name: '/request', value: `${serverName}への参加申請を送ります。`}
            )
            .setFooter({text: `v1.12.2`});
        interaction.reply({embeds: [embed],  ephemeral: true});
	},
};