// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const discord_modal = require('discord-modals');
const { enable_Request } = require('../../../config.json');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {discord.Client} client
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'request', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client) => {
        if (!enable_Request) {
            const embed = new discord.MessageEmbed()
                .setDescription('只今、申請は受付を停止しています。')
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const modal = new discord_modal.Modal()
            .setCustomId('request-modal')
            .setTitle('申請')
            .addComponents(
                new discord_modal.SelectMenuComponent()
                    .setCustomId('request-edition')
                    .setPlaceholder('エディションを選択')
                    .addOptions(
                        { label: 'JAVA版', value: 'JAVA', default: true },
                        { label: 'BE版', value: 'BE' },
                    ),
                new discord_modal.TextInputComponent()
                    .setCustomId('request-mcid')
                    .setLabel('MCID (ゲーマータグ)')
                    .setMaxLength(15)
                    .setStyle('SHORT')
                    .setRequired(true),
            );
        discord_modal.showModal(modal, { client, interaction });
    },
};