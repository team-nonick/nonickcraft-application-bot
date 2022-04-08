const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('modals')
		.setDescription('Modalsのテスト'),
    async execute(interaction,client) {
        const modaltest = new Modal()
            .setCustomId('customid')
            .setTitle('申請フォーラム(テスト)')
            .addComponents(
            new TextInputComponent()
                .setCustomId('textinput-customid1')
                .setLabel('MCIDを入力してください')
                .setStyle('SHORT')
                .setMinLength(4)
                .setMaxLength(12)
                .setPlaceholder('ここに書けぇ')
                .setRequired(true)
            );
        showModal(modaltest, {client, interaction});
    },
};