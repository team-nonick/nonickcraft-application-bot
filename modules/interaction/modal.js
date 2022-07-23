const discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const discord_modal = require('discord-modals');
const { modCh, serverName, request_forbid_img } = require('../../config.json');

/**
* @callback InteractionCallback
* @param {discord_modal.ModalSubmitInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/

module.exports = {
    /** @type {InteractionCallback} */
    async execute(interaction) {
        if (interaction.customId == 'request-modal') {
            const mcid = interaction.getTextInputValue('request-mcid');
            const edition = interaction.getSelectMenuValues('request-edition');

            const embed = new discord.MessageEmbed()
                .setTitle('申請完了')
                .setDescription([
                    '以下の情報で申請を送信しました。',
                    '**Tips:**登録には時間がかかる場合があります。',
                    '__正しく申請を受け取るには、DMを開放しておいてください!__',
                ].join('\n'))
                .setColor('GREEN')
                .addFields(
                    { name: 'エディション', value: `${edition}版`, inline: true },
                    { name: 'MCID', value: `${mcid}`, inline: true },
                );
            await interaction.deferReply({ ephemeral: true });
            interaction.followUp({ embeds: [embed], ephemeral: true });

            const button = new discord.MessageActionRow().addComponents(
                new discord.MessageButton()
                    .setCustomId('mcidCopy')
                    .setLabel('コマンドをコピー')
                    .setEmoji('📃')
                    .setStyle('PRIMARY'),
                new discord.MessageButton()
                    .setCustomId('permission')
                    .setLabel('許可')
                    .setStyle('SUCCESS'),
                new discord.MessageButton()
                    .setCustomId('notPermission')
                    .setLabel('拒否')
                    .setStyle('DANGER'),
            );
            const modEmbed = new discord.MessageEmbed()
                .setTitle('新しい申請が送信されました!')
                .setDescription(`申請者:${interaction.user}`)
                .setThumbnail(`${interaction.member.displayAvatarURL()}`)
                .setColor('GREEN')
                .addFields(
                    { name: 'ユーザーID', value: `${interaction.user.id}` },
                    { name: 'エディション', value: `${edition}版`, inline: true },
                    { name: 'MCID', value: `${mcid}`, inline: true },
                );
            const channel = await interaction.guild.channels.fetch(modCh);
            channel.send({ embeds: [modEmbed], components: [button] }).catch((e) => console.log(e));
        }

        if (interaction.customId == 'reason-modal') {
            interaction.channel.messages.fetch(interaction.message.reference.messageId)
            .then((message) => {
                const embed = message.embeds?.[0]?.fields;
                if (!embed) return;
                const reason = interaction.getTextInputValue('reason');

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
        }
    },
};