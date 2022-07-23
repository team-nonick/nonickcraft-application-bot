const discord = require('discord.js');
const { playerrole, serverName, request_allow_img } = require('../../../config.json');

/**
* @callback InteractionCallback
* @param {discord.CommandInteraction} interaction
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
    data: { customid: 'permission', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
		const interactionEmbed = interaction.message.embeds?.[0]?.fields;
        if (!interactionEmbed) return;

		const edition = interactionEmbed[1].value;
		const mcid = interactionEmbed[2].value;
        const member = await interaction.guild.members.fetch(interactionEmbed[0].value);
        if (!member) {
            return interaction.update('このメンバーはサーバーにもういません。');
        }

        const embed = new discord.MessageEmbed()
            .setTitle('申請 - 許可済み')
            .setColor('GREEN')
            .addFields(
                { name: '申請者', value: `<@${member.id}>`, inline: true },
                { name: 'MCID', value: `${mcid} (${edition})`, inline: true },
            )
            .setFooter({ text: `by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` });
        interaction.message.edit({ embeds: [embed], components: [] });

        const embed2 = new discord.MessageEmbed()
            .setTitle(`${serverName}へようこそ!`)
            .setDescription([
                'こんにちは! ${serverName}への申請が承認され、サーバーに参加できるようになったことをお知らせします!',
                '早速サーバーに参加して楽しもう!',
                '**注意:このメッセージを受け取ってから12時間以内に参加しないと、もう一回申請が必要になります!**',
            ].join('\n'))
            .setColor('GREEN')
            .addFields(
                { name: '申請が承認されたID', value: `${mcid} (${edition})` },
                { name: 'Tips', value: 'サーバーに関する質問は、このBOTに送っても対応できません! Discordサーバーの質問チャンネルや、皆さんに質問しましょう!' },
            )
            .setImage(request_allow_img);
        member.roles.add(playerrole);
        member.user.send({ embeds: [embed2] })
            .then(() => {
                interaction.reply({ content: `${member}の申請を許可しました。`, ephemeral: true });
            })
            .catch(() => {
                interaction.reply(`${member}の申請を許可しましたが、DMが送信できませんでした。\n別途DM対応をお願いします。`);
            });
    },
};