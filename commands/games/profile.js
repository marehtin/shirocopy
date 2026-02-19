const {SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType, ButtonStyle, ButtonBuilder} = require("discord.js");
const bdd = require("../../bdd.json")
const fs = require("fs")
const { request } = require('undici');

const { createCanvas, Image, GlobalFonts } = require('@napi-rs/canvas');
const { readFile } = require('fs/promises');

module.exports = {
    data: new SlashCommandBuilder().setName("profil").setDescription("Informations le profil d'un utilisateur"),
    async execute(interaction){
        
        GlobalFonts.registerFromPath('../../zh-cn.ttf', 'HYWenHei')
        const canvas = createCanvas(1920, 1080);
        const context = canvas.getContext('2d');
        const background = await readFile('./resources/inv/theme/' + bdd.users[interaction.member.user.id.toString()].theme + '.png');
        const backgroundImage = new Image();
        backgroundImage.src = background;
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        const overlay = await readFile('./resources/inv/overlay.png');
        const overlayim = new Image();
        overlayim.src = overlay;
        context.drawImage(overlayim, 0, 0, canvas.width, canvas.height);

        
        context.fillStyle = 'white';
        context.textAlign = 'center';

        context.font = '75pt HYWenHei';
        context.fillText(interaction.member.displayName, 1250, 235, 1400)

        context.font = '45pt HYWenHei';
        context.fillText(bdd.users[interaction.member.user.id.toString()].primogems.toString(), 292, 1027)

        context.textAlign = 'left';
        xp = bdd.users[interaction.member.user.id.toString()].experience;
        level = bdd.users[interaction.member.user.id.toString()].level;
        tot = 120*level + 0.5*level**2
        context.fillText("Niv." + level.toString(), 730, 667)
        

        context.textAlign = 'right';
        context.font = '28pt HYWenHei';
        context.fillText(xp.toString() + "/" + tot.toString(), 1840, 667)

        const bar = await readFile('./resources/inv/bar.png');
        const barim = new Image();
        barim.src = bar;
        context.drawImage(barim, 732, 674, Math.floor(xp/tot * 1110), 18);

        context.textAlign = 'left';
        context.font = '50pt HYWenHei';
        context.fillText(interaction.member.roles.highest.name, 615, 562)
        context.fillText("Thème : " + bdd.users[interaction.member.user.id.toString()].theme, 615, 562 + 127*2)
        context.fillText("Nombre de messages : " + bdd.users[interaction.member.user.id.toString()].msgnb, 615, 562 + 127*3)

        const { body } = await request(interaction.member.displayAvatarURL({ format: 'jpg' }));
        const avatar = new Image();
        avatar.src = Buffer.from(await body.arrayBuffer());        
        ar = 177;
        ax = 141;
        ay = 146;

        context.save();
        context.beginPath();
        context.arc(ax + ar, ay + ar, ar, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.drawImage(avatar, ax, ay, ar * 2, ar * 2);
        context.beginPath();
        context.arc(0, 0, 2, 0, Math.PI * 2, true);
        context.clip();
        context.closePath();
        context.restore();


        const finalmsg = new EmbedBuilder()
        .setColor('#ffffff')
        .setTitle('🦈 𝙍𝙞𝙣 𝙈𝙖𝙩𝙨𝙪𝙤𝙠𝙖 ▸ 𝙋𝙧𝙤𝙛𝙞𝙡')
        .setImage('attachment://profil.png')
        .setDescription(interaction.member.user.displayName);
        await interaction.reply(
            {content: "", embeds: [finalmsg], files: [{attachment: canvas.toBuffer('image/png'), name: 'profil.png'}], components: []}
        );
    },
};