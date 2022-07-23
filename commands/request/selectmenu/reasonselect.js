const discord_modal = require('discord-modals');
const discord = require('discord.js');
const { serverName, request_forbid_img, modCh } = require('../../../config.json');

/**
* @callback InteractionCallback
* @param {discord.SelectMenuInteraction} interaction
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
    data: { customid: 'reason_select', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client) => {
        if (interaction.values[0] == 'reason_other') {
            const modal = new discord_modal.Modal()
                .setTitle('申請を却下')
                .setCustomId('reason-modal')
                .addComponents(
                    new discord_modal.TextInputComponent()
                        .setLabel('理由')
                        .setCustomId('reason')
                        .setStyle('LONG')
                        .setRequired(true),
                );
            return discord_modal.showModal(modal, { client, interaction });
        }

        interaction.channel.messages.fetch(interaction.message.reference.messageId)
            .then((message) => {
                const embed = message.embeds?.[0]?.fields;
                if (!embed) return;
                 let reason;

                switch (interaction.values[0]) {
                    case 'reason_1':
                        reason = '以前に不正ツールを使用した';
                        break;
                    case 'reason_2':
                        reason = '以前に荒らし行為を行った';
                        break;
                    case 'reason_3':
                        reason = 'Discordサーバーのルールが守れていない';
                        break;
                }

                const editEmbed = new discord.MessageEmbed()
                    .setColor('#F61E29')
                    .setTitle('申請 - 却下済み')
                    .addFields(
                        { name: '申請者', value: `<@${embed[0].value}>`, inline: true },
                        { name: 'MCID', value: `${embed[2].value} (${embed[1].value})`, inline: true },
                        { name: '理由', value: `${reason}` },
                    )
                    .setFooter({ text: `by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` });
                message.edit({ embeds: [editEmbed], components: [] });

                const embed2 = new discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle(`${serverName}からのお知らせ`)
                    .setDescription([
                        `こんにちは! 今回は${serverName}に申請を送っていただき、ありがとうございます!`,
                        '残念ですが、あなたは以下の理由により申請が却下されました。',
                    ].join('\n'))
                    .addFields(
                        { name: '却下されたID', value: `${embed[2].value} (${embed[1].value})` },
                        { name: '理由', value: `${reason}` },
                        { name: '却下されたらどうすればいいの?', value: [
                            '上記の理由を良く確認していただき、まずは原因の改善を行いましょう。',
                            '再申請は早くても一週間後から可能となります。',
                            '何か最申請について質問があれば、気軽にDMをよろしくお願いします。',
                        ].join('\n') },
                    )
                    .setImage(request_forbid_img);

                interaction.guild.members.fetch(embed[0].value)
                    .then((member) => {
                        member.send({ embeds: [embed2] })
                            .then(() => interaction.update({ content: `<@${embed[0].value}>の申請を拒否しました。`, components: [], ephemeral: true }))
                            .catch(() => interaction.guild.channels.cache.get(modCh).send(`<@${embed[0].value}}>の申請を拒否しましたが、DMが送信できませんでした。\n別途DM対応をお願いします。`));
                    })
                    .catch(() => interaction.update('このメンバーはもうサーバーにいません。'));
            })
            .catch((e) => console.log(e));
    },
};