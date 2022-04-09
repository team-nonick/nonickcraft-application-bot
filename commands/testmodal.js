const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const { serverName, enableRequestModal, requestCh } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("testmodal")
		.setDescription(`[BETA] ${serverName}への参加申請を送信します。(BE版のみ)`),
    async execute(interaction,client) {
        if (enableRequestModal) {
            const modaltest = new Modal()
                .setCustomId('requestmodals')
                .setTitle('申請フォーラム(Beta)')
                .addComponents(
                new TextInputComponent()
                    .setCustomId('textinput-mcid')
                    .setLabel('MCIDを入力してください。[注意]このフォーラムは、BE版のユーザーのみ対応しています。')
                    .setStyle('SHORT')
                    .setMaxLength(12)
                    .setPlaceholder('ここに入力')
                    .setRequired(true)
                );
            showModal(modaltest, {client, interaction});

        } else {
            const embed_error = new MessageEmbed()
				.setColor('#E84136')
				.setDescription(`このコマンドは管理者によって制限されています`);
			interaction.reply({embeds: [embed_error], ephemeral: true});
        }
    },
};