const fs = require("fs");
const { readFile } = require('fs/promises');
const { request } = require('undici');
const { createCanvas, Image } = require('@napi-rs/canvas');
const { generalChannel, arrivalsChannel, blancheWelcomeChannel, blancheId } = require("../config.json")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');


function welcomeBlanche(member){
    const channel = member.guild.channels.cache.get(blancheWelcomeChannel);
    channel.send(`**BONJOUUUUUR ${member.user}**`);
    channel.send("https://tenor.com/view/rin-matsuoka-ringaru-gif-18279671");
    channel.send("JOYEUUX NOEEEL");
    channel.send("https://media.tenor.com/AEiNMg9O6v4AAAAM/sukuna-christmas.gif");
    channel.send("https://youtu.be/sjaLD4yfqDw?si=B59xdnFvxW25Jy3N");
}

async function welcomeBlanche2(message, member){
    const channel = member.guild.channels.cache.get(blancheWelcomeChannel);
    channel.send(`**EHEHEHEHEH ${member.user}**`);
    
    const poursuivre = new ButtonBuilder().setCustomId('oui').setLabel('OUIIIIIIIII RIN-SAMA').setStyle(ButtonStyle.Success);
    const non = new ButtonBuilder().setCustomId('non').setLabel('Bah non en fait 😒').setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
			.addComponents(poursuivre, non);
    
    const response = await message.reply({content: `${member.user}, veux-tu découvrir SHIRO ??`, components: [row],});

    const collectorFilter = i => i.user.id === member.user.id;
    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 600000 });
        if (confirmation.customId === 'oui'){
            await member.roles.add('1186935572607017000');
            await channel.send("BIENNVENUUUUE");
            await channel.send("https://youtu.be/EiXuLMFfMso?si=tMF_OvSob0F7_FU7");
            await confirmation.update({content: `${member.user}, veux-tu découvrir SHIRO ??`, components: [],})
        } else {
            await channel.send("Hmm... MAIS QUI T'A DIT QUE TU AVAIS LE CHOIX ?!")
            await member.roles.add('1186935572607017000');
            await channel.send("https://youtu.be/EiXuLMFfMso?si=tMF_OvSob0F7_FU7");
            await confirmation.update({content: `${member.user}, veux-tu découvrir SHIRO ??`, components: [],})
        }
    } catch (e) {
    }


}

module.exports = { 

    setup: function(client){
        //client.channels.cache.get(generalChannel).send("COUCOU !!! JE VIENS TOUT JUSTE DE ME RÉVEILLER !!!");
    },

    test: function(member){
        welcomeBlanche(member)
    },

    poursuivreBienvenueBlanche : async function(message){
        welcomeBlanche2(message, message.member);
    }, 

    welcome: async function(member){

        member.roles.add('1186935504948711435');

        const canvas = createCanvas(1920, 1080);
        const context = canvas.getContext('2d');
        const bg = await readFile('./resources/join-bg.png');
        const overlay = await readFile('./resources/join-overlay.png');
        const backgroundImage = new Image();
        backgroundImage.src = bg;

        const overlayImage = new Image();
        overlayImage.src = overlay;

        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        context.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);

        context.font = '95px TT_Skip-E';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.shadowColor = 'black';
        context.shadowBlur = 30;
        let t = member.displayName;
        context.fillText(t, canvas.width / 2, canvas.height / 4.15);

        const { body } = await request(member.displayAvatarURL({ format: 'jpg' }));
        const avatar = new Image();
        avatar.src = Buffer.from(await body.arrayBuffer());        
        ar = 235;
        ax = canvas.width / 2 - ar;
        ay = canvas.height / 2 - ar;

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
        
        if (member.id == blancheId){
            
            member.roles.add('1187044607087878195');
            welcomeBlanche(member);
        }

        member.guild.channels.cache.get(arrivalsChannel).send({ files: [{ attachment: canvas.toBuffer('image/png')}]  });
    },

    goodbye: async function(member, client){
        const canvas = createCanvas(1920, 1080);
        const context = canvas.getContext('2d');
        const bg = await readFile('./resources/quit-bg.png');
        const overlay = await readFile('./resources/quit-overlay.png');
        const backgroundImage = new Image();
        backgroundImage.src = bg;

        const overlayImage = new Image();
        overlayImage.src = overlay;

        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        context.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);

        context.font = '95px TT_Skip-E';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.shadowColor = 'black';
        context.shadowBlur = 30;
        let t = member.displayName;
        context.fillText(t, canvas.width / 2, canvas.height / 4.15);

        const { body } = await request(member.displayAvatarURL({ format: 'jpg' }));
        const avatar = new Image();
        avatar.src = Buffer.from(await body.arrayBuffer());        
        ar = 235;
        ax = canvas.width / 2 - ar;
        ay = canvas.height / 2 - ar;

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

        client.channels.cache.get(arrivalsChannel).send({ files: [{ attachment: canvas.toBuffer('image/png')}]  });
    }


 }