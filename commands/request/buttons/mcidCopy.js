const { beplayerprefix } = require('../../../config.json');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'mcidCopy', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        const interactionEmbed = interaction.message.embeds?.[0]?.fields;
        if (!interactionEmbed) return;

        const edition = interactionEmbed[1].value;
        const mcid = (edition == 'BE版') ? `${beplayerprefix}${interactionEmbed[2].value.replace(/\s+/g, '_')}` : interactionEmbed[2].value;
        interaction.reply({ content: `/whitelist add ${mcid}`, ephemeral: true });
    },
};