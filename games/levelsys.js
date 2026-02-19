const bdd = require("../bdd.json")
const {levelupChannel, guildId} = require("../config.json")
const fs = require('fs');

function saveBDD() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {});
}

function checkLevel(user, client){
    xp = bdd.users[user.id.toString()].experience;
    level = bdd.users[user.id.toString()].level;
    needxp = 120*level + 0.5*level**2;
    if (xp >= needxp){
        bdd.users[user.id.toString()].experience -= needxp;
        bdd.users[user.id.toString()].level += 1;
        level += 1;
        client.guilds.fetch(guildId)
        .then(guild => {
            guild.channels.fetch(levelupChannel).then(channel => {
                channel.send(`${user} A LEVEL UP !!! **NIVEAU ${level}**`)
            });
        });
        saveBDD();
    }
}

function addExp(user, xp, client){
    bdd.users[user.id.toString()].experience += xp
    bdd.users[user.id.toString()].primogems += xp
    bdd.users[user.id.toString()].totalexp += xp
    saveBDD();
    checkLevel(user, client);
}

function resetLevel(user){
    bdd.users[user.id.toString()].experience = 0
    bdd.users[user.id.toString()].totalexp = 0
    bdd.users[user.id.toString()].level = 1
    saveBDD();
}

module.exports = {
    addExp: function(user, xp, client){
        addExp(user, xp, client)
    }
}