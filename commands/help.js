const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { requestCh, serverName } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('自身が使用可能なコマンドを確認します。'),
	async execute(interaction) {
        // const botName = client.user.username;
        // const botAvater = ;
        const userId = interaction.user.id; //コマンドを打った人のidを取得
        const embed = new MessageEmbed()
            .setTitle(`NoNICK's SERVER bot`)
            .setColor('#FFFFFF')
            .setDescription(`**Minecraftサーバー運営のお手伝いをするBOT**\n<@${userId}>さん、こんにちは!\n<:slashcommand:959041066810638346>以下から利用可能なコマンドを確認できます!`)
            .addFields(
                {name: '/help', value: '自身が使用可能なコマンドを確認します。'},
                {name: '/request', value: `${serverName}への参加申請を送ります。`}
            )
            .setFooter({text: `v1.0`});
        interaction.reply({embeds: [embed],  ephemeral: true});
	},
};