const discord = require('discord.js');

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
    data: { customid: 'notPermission', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        const interactionEmbed = interaction.message.embeds?.[0]?.fields;
		if (!interactionEmbed) return;
        const select = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageSelectMenu()
                    .setCustomId('reason_select')
                    .setPlaceholder('ここから選択')
                    .addOptions([
                        { label: '以前に不正ツールを使用した', description: 'Hack, AutoClick等', value: 'reason_1' },
                        { label: '以前に荒らし行為を行った', value: 'reason_2' },
                        { label: 'Discordサーバーのルールが守れていない', value: 'reason_3' },
                        { label: 'その他', value: 'reason_other' },
                    ]),
            );
        // const embed1 = new discord.MessageEmbed()
        //     .setTitle('元のメッセージ')
        //     .addFields(
        //         { name: 'ユーザーID', value: `${interactionEmbed[0].value}` },
        //         { name: 'エディション', value: `${interactionEmbed[1].value}`, inline: true },
        //         { name: 'MCID', value: `${interactionEmbed[2].value}`, inline: true },
        //         { name: '元のメッセージのID', value: `${interaction.message.id}` },
        //     );
    interaction.reply({ content: '申請を拒否する理由に最も当てはまるものを選択してください。', components: [select], ephemeral: true });
    },
};