const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent } = require('discord-modals')
const { Formatters } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('modals')
		.setDescription('Modalsのテスト'),
	async execute(interaction) {
        // const botName = client.user.username;
        // const botAvater = ;
        const userId = interaction.user.id; //コマンドを打った人のidを取得
        interaction.reply({content: test,  ephemeral: true});
        const modaltest = new Modal()
        .setCustomId('customid')
        .setTitle('申請フォーラム(テスト)')
        .addComponents()
            new TextInputComponent()
            .setCustomId('textinput-customid1')
            .setLabel('MCIDを入力してください')
            .setStyle('SHORT')
            .setMinLength(4)
            .setMaxLength(10)
            .setPlaceholder('ここに書けぇ')
            .setRequired(true);
        showModal(modaltest, {
            client: client,
            interaction: interaction 
        })
	},
};