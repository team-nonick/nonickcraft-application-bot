// commandsフォルダに追加したコマンドを登録するために使われる (サーバーのみ)
// コマンド更新の際に一回だけ使用すること(複数回やっても意味がない)

const fs = require('node:fs');
// 簡易的なチェックツール
let checkerror = 0;
if (!fs.existsSync('./config.json')) {
	console.log('[DiscordBot-NoNickCraft]'+'\u001b[31m'+' config.json が見つかりませんでした。ファイルが存在するか、名前を間違えていないか確認してください。'+'\u001b[0m');
	checkerror = checkerror ++;
}
if (!fs.existsSync('./.env')) {
	console.error('[DiscordBot-NoNickCraft]'+'\u001b[31m'+' .env が見つかりませんでした。ファイルが存在するか、名前を間違えていないか確認してください。'+'\u001b[0m');
	checkerror = checkerror ++;
}

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, } = require('./config.json');
require('dotenv').config();

const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('[DiscordBot-NoNickCraft]'+'\u001b[32m'+'アプリケーションコマンドの登録に成功しました。'+'\u001b[0m'))
	.catch(console.error);