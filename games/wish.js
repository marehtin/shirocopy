const {EmbedBuilder, ComponentType} = require("discord.js");

const items = require("../items.json")
const bdd = require("../bdd.json")
const {limitedBannerChannel, guildId} = require("../config.json")
const fs = require('fs');
const { readFile } = require('fs/promises');
const { createCanvas, Image } = require('@napi-rs/canvas');


function saveBDD() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {});
}


async function defineNewBanners(client, five, four){
        bdd.current4banners = four
        bdd.current5banners = five 
        saveBDD();

        const canvas = createCanvas(1920, 1080);
        const context = canvas.getContext('2d');
        const bgloc = './resources/wish/banner.png'
        const background = await readFile(bgloc);
        const backgroundImage = new Image();
        backgroundImage.src = background;
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        card5 = await readFile("./resources/wish/five_star_card.png");
        st5 = new Image()
        st5.src = card5
        x = 136
        y = 157
        p = 162
        w = 133
        h = 826
        for (i=0;i<2;i++){
            context.drawImage(st5, x + i*p, y, w, h);
            ig = await readFile("./resources/wish/characters/" + five[i] + ".png");
            img = new Image()
            img.src = ig
            context.drawImage(img, x + i*p, y, w, h);
            console.log(five[i], "ok")
            el= await readFile('./resources/wish/elements/' + items.characters["5stars"][five[i]][0] + '.png');
            eli  = new Image();
            eli.src = el
            context.drawImage(eli, h/920*36 + x+i*p, h/920*592 + y, h/920*75, h/920*75);
            st = await readFile('./resources/wish/5star.png');
            sti  = new Image();
            sti.src = st;
            context.drawImage(sti, x+i*p + h/920*21, y + h/920*684, h/920*106, h/920*17);
        }

        card4 = await readFile("./resources/wish/four_star_card.png");
        st4= new Image()
        st4.src = card4
        x = 616
        y = 271
        p = 126
        w = 96
        h = 595
        for (i=0;i<3;i++){
            context.drawImage(st4, x + i*p, y, w, h);
            ig = await readFile("./resources/wish/characters/" + four[i] + ".png");
            img = new Image()
            img.src = ig
            context.drawImage(img, x + i*p, y, w, h);
            el= await readFile('./resources/wish/elements/' + items.characters["4stars"][four[i]][0] + '.png');
            eli  = new Image();
            eli.src = el
            context.drawImage(eli, h/920*36 + x+i*p, h/920*592 + y, h/920*75, h/920*75);
            st = await readFile('./resources/wish/4star.png');
            sti  = new Image();
            sti.src = st;
            context.drawImage(sti, x+i*p + h/920*28, y + h/920*684, h/920*91, h/920*19);
        }

        const finalmsg = new EmbedBuilder()
        .setColor('#cf2b2b')
        .setTitle('🦈 𝙍𝙞𝙣 𝙈𝙖𝙩𝙨𝙪𝙤𝙠𝙖 ▸ 𝙑𝙤𝙚𝙪𝙭')
        .setImage('attachment://wish.png')
        .setDescription("Bannières Limitées");
        client.guilds.fetch(guildId)
        .then(guild => {
            guild.channels.fetch(limitedBannerChannel).then(channel => {
                channel.send(
                    {content: "", embeds: [finalmsg], files: [{attachment: canvas.toBuffer('image/png'), name: 'wish.png'}], components: []}
                )
            });
        });
    }

module.exports = {
    selectNew5Stars: function(){
        list5 = [];
        for (ch of Object.keys(items.characters["5stars"])){
            if (items.characters["5stars"][ch][2] == false){
                list5.push(ch)
            }
        }
        ret = []
        for (j =0;j<2;j++){
            i = Math.floor(Math.random() * list5.length)
            ret.push(list5[i])
            list5.splice(i, 1)
        }
        return ret;
    },
    selectNew4Stars: function(){
        list4 = [];
        for (ch of Object.keys(items.characters["4stars"])){
            if (items.characters["4stars"][ch][2] == false){
                list4.push(ch)
            }
        }
        ret = [];
        for (j =0;j<3;j++){
            i = Math.floor(Math.random() * list4.length)
            ret.push(list4[i])
            list4.splice(i, 1)
        }
        return ret;
    },
    resetRandom: async function(client){
        defineNewBanners(client, this.selectNew5Stars(), this.selectNew4Stars())
    },
    changeBanners: async function(client, five0, five1){
        defineNewBanners(client, [five0, five1], this.selectNew4Stars())
    },
    phaseChanging: async function(client){
        four = this.selectNew4Stars()
        if (bdd.phase == 0){
            defineNewBanners(client, ["Neuvilette", "Alhaitam"], four)
        } else if (bdd.phase >= 0){
            timer = 3 * 60 * 1000
            if (bdd.phase == 1){
                timer = 1000 * 7*60*60
                five = ["Matsuoka Rin", "Blanche"]
                five1 = ["Miyano Mamoru", "Itto"]
            } else if (bdd.phase == 2){
                five = ["Martin", "Zhongli"]
                five1 = ["Inès", "Ayato"]
            } else if (bdd.phase == 3){
                five = ["Sukuna", "Kazuha"]
                five1 = ["Klee", "Dainsleif"]
            } else if (bdd.phase == 4){
                five = ["Dazai", "Furina"]
            } else if (bdd.phase == 5){
                five = ["Dottore", "Albedo"]
            } else if (bdd.phase == 6){
                five = ["Muzan", "Nilou"]
            } else if (bdd.phase == 7){
                five = ["Inès", "Ayato"]
            } else if (bdd.phase == 8){
                five = ["Matsuoka Rin", "Miyano Mamoru"]
                bdd.phase = 100
            }

            defineNewBanners(client, five, four)
        }
        bdd.phase++;
    }
}