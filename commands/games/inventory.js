const {SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType, ButtonStyle, ButtonBuilder} = require("discord.js");
const bdd = require("../../bdd.json")
const items = require("../../items.json")
const fs = require("fs")
const { request } = require('undici');

const { createCanvas, Image, GlobalFonts } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');
const { start } = require("node:repl");

module.exports = {
    data: new SlashCommandBuilder().setName("inv").setDescription("Informations l'inventaire d'un utilisateur"),
    async execute(interaction){
        GlobalFonts.registerFromPath('../../zh-cn.ttf', 'HYWenHei')
        inv = bdd.users[interaction.member.user.id.toString()].inventory.characters
        w = 1920*0.5
        h = Math.ceil(242 + 291*Math.ceil(Object.keys(inv).length / 7))*0.5
        h = h >= 1080*0.5 ? h : 1080*0.5
        const canvas = createCanvas(w, h);
        const context = canvas.getContext('2d');
        const background = await readFile('./resources/inv/persos.png');
        const backgroundImage = new Image();
        backgroundImage.src = background;
        context.drawImage(backgroundImage, 0, 0, canvas.width*2, canvas.height*2, 0, 0, canvas.width, canvas.height);

        context.fillStyle = '#1e1e1e';
        context.textAlign = 'center';

        context.font = '30pt HYWenHei';
        context.fillText(`Personnages de ${interaction.member.displayName}`, canvas.width/2, 135*0.5)

        i = 0;
        x = 84*0.5
        y = 243*0.5
        const bg5 = await readFile('./resources/inv/5star-bg.png');
        const bg4 = await readFile('./resources/inv/4star-bg.png');
        const bg3 = await readFile('./resources/inv/3star-bg.png');
        const ov = await readFile('./resources/inv/ov.png');
        star5 = []
        star4 = []
        for (char of Object.keys(inv)){
            if (char in items.characters["5stars"]){
                star5.push(char)
            } else {
                star4.push(char)
            }
        }
        star5.sort((a, b) => b[1] - a[1]);
        star4.sort((a, b) => b[1] - a[1]);

        sorted = star5.concat(star4)

        for (char of sorted){
            i+=1

            const bgimg = new Image();
            if (char in items.characters["5stars"]){
                bgimg.src = bg5;
            } else if (char in items.characters["4stars"]){
                bgimg.src = bg4;
            }
            context.drawImage(bgimg, x, y, 256*0.5, 256*0.5);

            const ch = await readFile('./resources/inv/characters/' + char + '.png')
            const chimg = new Image();  
            chimg.src = ch;
            context.drawImage(chimg, x, y, 256*0.5, 256*0.5);

            const ovimg = new Image();
            ovimg.src = ov;
            context.drawImage(ovimg, x, y, 256*0.5, 256*0.5);
            
            context.fillStyle = '#1e1e1e';
            context.font = '11pt HYWenHei';
            context.textAlign = 'center';
            context.fillText(`${char}`, x + 256/2*0.5, y + 225*0.5 + 42/2*0.5)

            context.textAlign = 'right';
            context.fillStyle = 'white';
            context.strokeStyle = '#1e1e1e';
            context.font = '21pt HYWenHei';
            context.fillText(`C${inv[char]}`, x + 235*0.5, y + 200*0.5 )
            context.strokeText(`C${inv[char]}`, x + 235*0.5, y + 200*0.5 )

            if (i >= 7){
                x = 84*0.5
                y += 291*0.5
                i = 0
            } else {
                x += 256*0.5
            }
        }

        const finalmsg = new EmbedBuilder()
        .setColor('#9153e5')
        .setTitle('🦈 𝙍𝙞𝙣 𝙈𝙖𝙩𝙨𝙪𝙤𝙠𝙖 ▸ 𝙋𝙚𝙧𝙨𝙤𝙣𝙣𝙖𝙜𝙚𝙨')
        .setImage('attachment://profil.png')
        .setDescription(interaction.member.user.displayName);
        await interaction.reply(
            {content: "", embeds: [finalmsg], files: [{attachment: canvas.toBuffer('image/png'), name: 'profil.png'}], components: []}
        );
    },
};