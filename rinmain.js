const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const {token, countChannel,generalChannel, limitedBannerChannel, msgExp, clientId, guildId, blancheWelcomeChannel, blancheId} = require("./config.json");

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});



client.commands = new Collection();

const cmdfoldersPaths = path.join(__dirname, 'commands');
const cmdFolders = fs.readdirSync(cmdfoldersPaths);

for (const folder of cmdFolders){
    const cmdPath = path.join(cmdfoldersPaths, folder);
    const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));
    for (const file of cmdFiles){
        const filePath = path.join(cmdPath,file);
        const command = require(filePath);
        if ('data' in  command && 'execute' in command){
            client.commands.set(command.data.name, command);
            console.log(`Commande ${filePath} enregistrée`)
        }
    }
}



// registering commands
const { spawn } = require('child_process');
const secondScript = spawn('node', ['deploycmd.js']);

secondScript.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

secondScript.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

secondScript.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
// END REGISTERING

// BDD HANDLING

const bdd = require("./bdd.json");

function saveBDD() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {});
}

function checkBDD(member, name){
    if (!bdd["users"]){
        bdd["users"] = {}
    }
    if (!bdd["blancheChatState"]){
        bdd["blancheChatState"] = 0
    }
    if (!bdd["count"]){
        bdd["count"] = 0
    }
    if (!bdd["phase"]){
        bdd["phase"] = 1
    }
    if (!bdd["current5banners"]){
        bdd["current5banners"] = ["Klee", "Kazuha"]
    }
    if (!bdd["current4banners"]){
        bdd["current4banners"] = ["Sucrose", "Bennett", "Barbara"]
    }
    if(!bdd["users"][member]){
        bdd["users"][member] = 
        {
            "name" : name,
            "level" : 1,
            "experience": 0,
            "totalexp": 0,
            "primogems": 16000,
            "theme": "Mondstadt",
            "msgnb": 0,
            "wish": {
                "total" : 0,
                "able" : true,
                "limited": {
                    "5": {
                        "pity" : 0,
                        "50/50" : true
                    },
                    "4": {
                        "pity" : 0,
                        "50/50" : true
                    }
                },
                "permanent": {
                    "5": {
                        "pity" : 0
                    },
                    "4": {
                        "pity" : 0
                    }
                }
            },
            "inventory":{
                "characters": {
                    
                },
                "weapons": {

                }
            }
        };
    }
}

//

// EVENT HANDLING

const Arrivals = require("./games/arrivals.js")
const LevelSystem = require("./games/levelsys.js")
const WishBanners = require("./games/wish.js")

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    else {
        checkBDD(message.member.id, message.member.displayName)
        bdd.users[message.member.id.toString()].msgnb += 1
        saveBDD();
        //Arrivals.test(message.member)
        if (message.channelId == blancheWelcomeChannel && bdd["blancheChatState"] == 0 && message.member.id == blancheId){
            bdd["blancheChatState"] = 1;
            Arrivals.poursuivreBienvenueBlanche(message);
        }
        LevelSystem.addExp(message.member.user, Math.ceil(Math.random() * msgExp), client)
        if (message.channelId == countChannel){
            if (message.content === (bdd.count + 1).toString()){
                message.react("✅")
                bdd.count  += 1
                LevelSystem.addExp(message.member.user, 15, client)
                if (bdd.count % 100 == 0){
                    bdd.users[message.member.user.id.toString()].primogems += 8000
                    message.reply(`**PALIER ATTEINT !!! +8000 primos pour ${message.member.user} !**`)
                }
            } else {
                message.delete()
            }
        }
    }
});

client.on(Events.InteractionCreate, async interaction =>{
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    checkBDD(interaction.member.id, interaction.member.displayName);
    saveBDD();

    if (!command){
        console.log("[ERREUR] pas de commande trouvée");
        return;
    } else if (command != "countinfo" && interaction.channelId == countChannel){
        return;
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred){
            await interaction.followUp({content : 'Erreur lors de l\'éxecution de cette commande.', ephemeral:true})
        } else {
            await interaction.reply({content : 'Erreur lors de l\'éxecution de cette commande.', ephemeral:true})
        }
    }
});

client.once(Events.ClientReady, readyClient => {
    client.user.setActivity("Let's swim together !");
    console.log(`Logged as ${readyClient.user.tag}`);
    Arrivals.setup(client);
});

client.on(Events.GuildMemberAdd, async member => {
    Arrivals.welcome(member);
});

client.on(Events.GuildMemberRemove, async member => {
    Arrivals.goodbye(member, client);
});

//

// BOUCLES

rinmamolinks = require("./rinmamolinks.json")

var delay = 1000 * 60 * 60 * 24; // 24h
var now = new Date()
var future = new Date()
future.setDate(future.getDate())
future.setHours(9);
future.setMinutes(0);
future.setMilliseconds(0);
var start = future.getTime() - now.getTime()
if (start < 0){
    future.setDate(future.getDate()+1)
    start = future.getTime() - now
}
console.log(`Changement de bannière dans ${start /1000/60/60}h`)
setTimeout(function changeBanner() {
    console.log("Changement de bannière")
    bool = bdd.phase <= 100
    if (bool){
        WishBanners.phaseChanging(client);
    } else {
        WishBanners.resetRandom(client);
    }
    client.guilds.fetch(guildId)
    .then(guild => {
        guild.channels.fetch(generalChannel).then(channel => {
            channel.send("BONJOUR !!! J'AI BIEN DORMI AVEC SHIRO CETTE NUIT !!")
            channel.send("https://media.discordapp.net/attachments/827248224799948860/1183863524825514045/Video_sans_titre.gif?ex=659c56d3&is=6589e1d3&hm=fe830ae22244ecabacdd2bf559e132e4975c4df756259c0eb9602e8d6fcf3211&=")
            const today = new Date()
            day = today.getDay();
            month = today.getMonth() + 1;
            if (day == 14 && month == 2){
                channel.send("Je vais passer un super 14 février aujourd'hui !!!!! AVEC SHIRO!!!")
                channel.send("https://tenor.com/view/anime-gif-9993965");
            }
        });
    });
    setTimeout(changeBanner, delay);
}, start);

//



client.login(token);