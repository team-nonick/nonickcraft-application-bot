const discord = require('discord.js');
const { serverName } = require('../config.json');

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
    data: { name: 'request', description: '申請パネルを送信', type: 'CHAT_INPUT' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        const embed = new discord.MessageEmbed()
            .setTitle(`${serverName} 参加申請`)
            .setDescription('下の「申請」ボタンをクリックして参加申請を送信できます。\n注意: MCIDは正しく入力してください。')
            .setColor('BLUE');
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('request')
                .setLabel('申請')
                .setStyle('SUCCESS'),
        );
        interaction.reply({ embeds: [embed], components: [button] });

    },
};