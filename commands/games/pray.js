const {SlashCommandBuilder} = require("discord.js");
const bdd = require("../../bdd.json")
const {} = require("../../config.json")
const fs = require("fs");
const { randomInt } = require("crypto");

module.exports = {
    data: new SlashCommandBuilder().setName("pray").setDescription("Prier les Husbandos !!")
    .addStringOption(option => option.setName("Husbando").setDescription("1").setRequired(true)),
    async execute(interaction){
            x = randomInt(15, 150)
            puissance = {
                "Rin": 7.5,
                "Rin-Sama": 10.0,
                "Mamoru Miyano": 7.0,
                "Mamoru": 7.0,
                "EMMAXOLOTL": 1.5,
                "Martin": 1.5,
                "Dazai": 6.5,
                "Neuvilette": 6.0,
                "Zhongli": 5.5,
                "Jing Yuan": 5.0,
                "Boothill": 4.5,
                "Mydei": 4.0,
                "Argenti": 3.5,
                "Doma": 3.0,
                "Sylus": 2.5,
                "Sukuna": 2.5,
                "Azeru": 2.0,
                "Azeru-Sama": 2.5,
                "Orochi": 2.5,
                "Viktor": 8.5,
                "Nanook": 2.5,
                "Muzan": 2.5,
                "Shibuya": 2.5,
                "Dottore": 2.5,
                "Itto": 2.5,
                "Uzui": 2.5,
                "Tomoya": 2.5,
                "Dainsleif": 2.5, 
                "Reo": 2.5,
                "Kotaro": 2.5,
                "Sunday": 2.5,
                "Jiyan": 2.5,
                "Kakarot": 2.5
            }    
        ch = interaction.options.getString("Husbando")
        f = x * Math.exp(puissance[ch])
        if (ch in puissance) {
            bdd.users[interaction.member.user.id.toString()]["primogems"] += Math.round(f)
            interaction.channel.send("Le grand husbando de Blanchette a répondu à ta demande ! Il t'a donné " + f.toString() + " primogemmes")
        } else {
            interaction.channel.send("Aucune réponse...")
        }
        
    },
};