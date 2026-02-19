const {SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType, ButtonStyle, ButtonBuilder} = require("discord.js");
const bdd = require("../../bdd.json");
const items = require("../../items.json");
const {wishChannels, chance4, chance5} = require("../../config.json")
const { readFile } = require('fs/promises');
const { createCanvas, Image } = require('@napi-rs/canvas');
const fs = require("fs");

const star5 = Object.assign({}, items.characters["5stars"], items.weapons["5stars"])
const star4 = Object.assign({}, items.characters["4stars"], items.weapons["4stars"])
const star3 = items.weapons["3stars"]
const characters = Object.assign({}, items.characters["5stars"], items.characters["4stars"])

module.exports = {
    data: new SlashCommandBuilder().setName("wish").setDescription("Faire un voeu sur une bannière"),
    async execute(interaction){
        const select = new StringSelectMenuBuilder()
            .setCustomId("banner")
            .setPlaceholder("Sélectionnez la bannière")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Bannière Limitée - " + bdd["current5banners"][0])
                    .setDescription("Pity: " + bdd.users[interaction.member.id.toString()]["wish"]["limited"]["5"]["pity"] + " | 50/50: " +(bdd.users[interaction.member.id.toString()]["wish"]["limited"]["5"]["50/50"] ? "Oui" : "Non"))
                    .setValue(bdd["current5banners"][0])
                    .setEmoji("📀"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Bannière Limitée - " + bdd["current5banners"][1])
                    .setDescription("Pity: " + bdd.users[interaction.member.id.toString()]["wish"]["limited"]["5"]["pity"] + " | 50/50: " +(bdd.users[interaction.member.id.toString()]["wish"]["limited"]["5"]["50/50"] ? "Oui" : "Non"))
                    .setValue(bdd["current5banners"][1])
                    .setEmoji("📀"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Bannière Permanente")
                    .setDescription("Pity: " + bdd.users[interaction.member.id.toString()]["wish"]["permanent"]["5"]["pity"])
                    .setValue("permanent")
                    .setEmoji("💿")    
            )

        const row = new ActionRowBuilder()
			.addComponents(select);
        
        const response = await interaction.reply({
                content: 'Sélectionner la bannière',
                components: [row],
            });
        
        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000});
        collector.on("collect", async i => {
            const banner = i.values[0];

            const voeux10 = new ButtonBuilder().setCustomId('10').setLabel('10').setStyle(ButtonStyle.Primary);
            const voeux100 = new ButtonBuilder().setCustomId('100').setLabel('100').setStyle(ButtonStyle.Primary);
        
            const row1 = new ActionRowBuilder()
                    .addComponents(voeux10, voeux100);
            
            const response1 = await i.reply({content: `Combien de voeux faire ?`, components: [row1],});
            const collectorFilter = x => x.user.id === i.user.id;
            try {
                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 6000000 });
                interaction.deleteReply()
                await wish(i, banner, confirmation.customId)
            } catch(e){
                await i.editReply({content: "Délai dépassé, annulation", components: []})
            }
                
        });

    },
};

function roll() {
    return Math.random() * 100;
}

async function saveBDD() {
    fs.writeFile("../../bdd.json", JSON.stringify(bdd, null, 4), (err) => {});
}

async function wish(interaction, banner, number, skip){
    got5 = false
    perma5star = []
    for (char of Object.keys(items.characters["5stars"])){
        if (items.characters["5stars"][char][2] == true){
            perma5star.push(char)
        }
    }
    lost504star = [];
    perma4star = [];
    for (char of Object.keys(items.characters["4stars"])){
        perma4star.push(char);
        if (!items.characters["4stars"][char][2] && !(bdd.current4banners.includes(char))){
            lost504star.push(char);
        }
    }
    for (char of Object.keys(items.weapons["4stars"])){
        perma4star.push(char);
        lost504star.push(char);
    }
    wea3star = Object.keys(items.weapons["3stars"]);

    obtentions = [];
    n = number == "100" ? 100 : 10

    if (bdd.users[interaction.member.id.toString()].primogems >= n * 160) {
        bdd.users[interaction.member.id.toString()].primogems -= n * 160
    } else {
        await interaction.reply("Vous n'avez pas assez de primogemmes ! Il vous en manque " + (n * 160 - bdd.users[interaction.member.id.toString()].primogems).toString())
        return
    }

    for (var i = 0; i < n; i++){
        type = banner == "permanent" ? "permanent" : "limited"
        bdd.users[interaction.member.id.toString()]["wish"][type]["5"]["pity"] += 1;
        bdd.users[interaction.member.id.toString()]["wish"][type]["4"]["pity"] += 1;

        add = 0
        if (bdd.users[interaction.member.id.toString()]["wish"][type]["5"]["pity"] >= 74){
            add += (bdd.users[interaction.member.id.toString()]["wish"][type]["5"]["pity"] - 74) * 4.5
        }

        result = roll()
        if (bdd.users[interaction.member.id.toString()]["wish"][type]["5"]["pity"] >= 90) result = 0
        else if (bdd.users[interaction.member.id.toString()]["wish"][type]["4"]["pity"] >= 10 && result > chance5 + add) result = chance5+add+1
        
        if (result <= chance5 + add){
            got5 = true
            if ((type === "limited" && bdd.users[interaction.member.id.toString()]["wish"][type]["5"]["50/50"] == true && roll() > 50) || (type === "limited" && bdd.users[interaction.member.id.toString()]["wish"][type]["5"]["50/50"] == false)){
                obtentions.push([banner,1000-i])
                bdd.users[interaction.member.id.toString()]["wish"][type]["5"]["50/50"] = true
            } else {
                if (type === "limited"){ 
                    bdd.users[interaction.member.id.toString()]["wish"][type]["5"]["50/50"] = false
                }
                c = perma5star[Math.floor(Math.random() * perma5star.length)]
                obtentions.push([c,1000-i])
            }
            bdd.users[interaction.member.id.toString()]["wish"][type]["5"]["pity"] = 0
        } else if (result <= chance4 + chance5){
            if (type === "limited"){
                r = Math.random() * 100 > 50
                if (r && bdd.users[interaction.member.id.toString()]["wish"][type]["4"]["50/50"] == true){
                    obtentions.push([lost504star[Math.floor(Math.random() * lost504star.length)],100-i])
                    bdd.users[interaction.member.id.toString()]["wish"][type]["4"]["50/50"] = false
                } else {
                    obtentions.push([bdd.current4banners[Math.floor(Math.random() * 3)].toString(), 100-i])
                    bdd.users[interaction.member.id.toString()]["wish"][type]["4"]["50/50"] = true
                }
            } else {
                c = perma4star[Math.floor(Math.random() * perma4star.length)]
                obtentions.push([c, 100-i])
            } 
            bdd.users[interaction.member.id.toString()]["wish"][type]["4"]["pity"] = 0
        } else {
            obtentions.push([[wea3star[Math.floor(Math.random() * wea3star.length)]],0])
        }

    }
    obtentions.sort((a, b) => b[1] - a[1]);
    let finalObtentions = [];
    for (e of obtentions){
        finalObtentions.push(e[0])
        if (e[0].toString() in characters){
            if (e[0].toString() in bdd.users[interaction.member.id.toString()].inventory.characters){
                bdd.users[interaction.member.id.toString()].inventory.characters[e[0].toString()] += 1
            }
            else bdd.users[interaction.member.id.toString()].inventory.characters[e[0].toString()] = 0
        } else {
            if (!bdd.users[interaction.member.id.toString()].inventory.weapons[e[0].toString()]){
                bdd.users[interaction.member.id.toString()].inventory.weapons[e[0].toString()] = 1
            }
            else bdd.users[interaction.member.id.toString()].inventory.weapons[e[0].toString()] += 1
        }
    }
    saveBDD();
    sendWishResult(interaction, finalObtentions, n, got5, skip);
}

async function sendWishResult(interaction, obtentions, n, got5, skip){   
    link = got5 ? 'https://cdn.discordapp.com/attachments/462196439033053205/1188273554005954660/5star.gif?ex=6599ecfc&is=658777fc&hm=1ee131372ba45e7928829f754410bda19b191792db26642638bfd98cda3acef0&' : 'https://cdn.discordapp.com/attachments/462196439033053205/1188272108501991424/4_star_10_pull.gif?ex=6599eba3&is=658776a3&hm=9c11519b69edff2171f7774421f36c48a540be13a0e8703595b0bb163deb0a27&'
    const tempmsg = new EmbedBuilder()
    .setColor('#cf2b2b')
    .setTitle('🦈 𝙍𝙞𝙣 𝙈𝙖𝙩𝙨𝙪𝙤𝙠𝙖 ▸ 𝙑𝙤𝙚𝙪𝙭')
    .setImage(link)
    .setDescription(interaction.member.user.displayName);
    await interaction.editReply(
        {content: "", embeds: [tempmsg], components: []}
    );
    const nb = n/10 
    const w = nb == 10 ? 1920*2 -404 : 1920;
    const h = nb == 10 ? 1080*nb/2 : 1080;
    const canvas = createCanvas(w, h);
    const context = canvas.getContext('2d');
    const bgloc = nb == 10 ? './resources/wish/bigbg.png' : './resources/wish/bg.png'
    const background = await readFile(bgloc);
    const backgroundImage = new Image();
    backgroundImage.src = background;
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    x = 202
    y = 80
    im = []
    imIMG = []
    cd = []
    cdIMG = []
    el = []
    elIMG = []
    st = []
    stIMG = []
    j = 0;
    for (let i = 0; i < obtentions.length; i++){
        j++;
        
        card = "./resources/wish/three_star_card.png"
        if (obtentions[i] in star5){
            card = "./resources/wish/five_star_card.png"
        } else if (obtentions[i] in star4){
            card = "./resources/wish/four_star_card.png"
        }
        cd[i] = await readFile(card);
        cdIMG[i]  = new Image();
        cdIMG[i].src = cd[i];
        context.drawImage(cdIMG[i], x, y, 148, 920);

        
        if (obtentions[i] in characters){
            im[i] = await readFile('./resources/wish/characters/' + obtentions[i] + '.png');
            imIMG[i]  = new Image();
            imIMG[i].src = im[i];
            context.drawImage(imIMG[i], x, y, 148, 920);

            el[i] = await readFile('./resources/wish/elements/' + characters[obtentions[i]][0] + '.png');
            elIMG[i]  = new Image();
            elIMG[i].src = el[i];
            context.drawImage(elIMG[i], 36 + x, 592 + y, 75, 75);
        } else {
            im[i] = await readFile('./resources/wish/weapons/' + obtentions[i] + '.png');
            imIMG[i]  = new Image();
            imIMG[i].src = im[i];
            context.drawImage(imIMG[i], x, y, 148, 920);
        }
        
        if (obtentions[i] in star5){
            st[i] = await readFile('./resources/wish/5star.png');
            stIMG[i]  = new Image();
            stIMG[i].src = st[i];
            context.drawImage(stIMG[i], x + 21, y + 684, 106, 17);
        } else if (obtentions[i] in star4){
            st[i] = await readFile('./resources/wish/4star.png');
            stIMG[i]  = new Image();
            stIMG[i].src = st[i];
            context.drawImage(stIMG[i], x + 28, y + 684, 91, 19);
        } else{
            st[i] = await readFile('./resources/wish/3star.png');
            stIMG[i]  = new Image();
            stIMG[i].src = st[i];
            context.drawImage(stIMG[i], x + 37, y + 690, 75, 19);
        }           
        x += 152
        if (j>= 20){
            j = 0;
            y += 1080
            x = 202
        }
    }


    const finalmsg = new EmbedBuilder()
    .setColor('#cf2b2b')
    .setTitle('🦈 𝙍𝙞𝙣 𝙈𝙖𝙩𝙨𝙪𝙤𝙠𝙖 ▸ 𝙑𝙤𝙚𝙪𝙭')
    .setImage('attachment://wish.png')
    .setDescription(interaction.member.user.displayName);
    setTimeout(async function(){
        await interaction.editReply(
            {content: "", embeds: [finalmsg], files: [{attachment: canvas.toBuffer('image/png'), name: 'wish.png'}], components: []}
        );
    }, 3500);
}