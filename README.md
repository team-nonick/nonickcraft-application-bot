
# DiscordBot-NoNickCraft

Minecraftのサーバー運営の支援を行うBOT

Discord.js v13に追加されたスラッシュコマンドやボタン等を積極的に使用しているため、視覚的にわかりやすく、ストレスフリーで使用することができます。

# Features

* `/request` ... ホワイトリストに追加するための申請を送信することができます。指定したチャンネル以外では使用できず、使用すると申請情報がモデレーターチャンネルに転送されます。
![picture 2](https://media.discordapp.net/attachments/958791423161954445/959084240211939388/2869545b09517e0342b0c585727a2321e8ddb112f7cebf17c7e2301076822698.png)  
![picture 1](https://media.discordapp.net/attachments/958791423161954445/959084239977074778/940a03c4e3ff9064c28a5b2529f04a9986ac2c7de0ef29ea4b8de6c36388bdeb.png)

* また、コマンドの使用の許可を切り替えることも可能です。
![picture 4](https://cdn.discordapp.com/attachments/958791423161954445/962296309174390804/unknown.png)

* `/help` ...　DiscordBOTでお馴染みのコマンド。使用できるコマンドの一覧とバージョンを表示できます。v12以前のhelpコマンドに慣れている方のためのコマンドです。
![picture_3](https://media.discordapp.net/attachments/958791423161954445/959084124184903732/unknown.png)

# Requirement
このBOTの動作には以下のライブラリが必要です。

* discord.js@13.6.0
* @discordjs/builders@0.12.0
* @discordjs/rest@0.3.0
* discord-api-types@0.30.0
* dotenv@16.0.0
* discord-modals@1.3.5 (使用はしていません)

# Installation
以下のコマンドをコンソールに入力することでライブラリをインストールできます。
```npm
npm i
```

# Usage
このBOTを起動する前に、新規作成した`config.json` に以下の情報を書き込む必要があります。

```json
{
    "serverName": "Minecraftのサーバー名",
    "botName": "BOTの名前",
    "clientId": "DiscordBOTのクライアントID",
    "guildId": "スラッシュコマンドを登録するサーバーID",

    "enable_Request": true, //falseにすると申請の受付を停止する
    "playerrole": "/request を承認した人に与えるロール",
    "modCh": "モデレーターチャンネル",
    "requestCh": "/request の使用を許可するチャンネル",
    "beplayerprefix": "GeyserMCでBEプレイヤーに設定している接頭辞",
    
    "request_allow_img": "申請承認時にDMに送信する画像のURL",
    "request_forbid_img": "申請拒否時にDMに送信する画像のURL"
}
```
同じく新規作成した`.env` にはDiscordBOTのtokenを入力します。

(注意:tokenは漏洩するとサーバー荒らし等に使用される場合があるため、取り扱いには十分注意してください。)
```
BOT_TOKEN=DiscordBOTのtoken
```

# Note

* このリポジトリのファイルはNoNICK's SERVER用に最適化されています。極力どのサーバーでも使えるようにプログラミングしていますが、自分のサーバー用にカスタマイズするには適時書き換えてください。
* このプログラムは自由に使って構いませんが、商用利用はやめてください。
* カスタマイズしたDiscordBOTの動作不良に関しては問い合わせても対応できかねます。
