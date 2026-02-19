const {SlashCommandBuilder} = require("discord.js");
const bdd = require("../../bdd.json")
const fs = require("fs")

module.exports = {
    data: new SlashCommandBuilder().setName("countinfo").setDescription("Informations sur l'état actuel du compteur"),
    async execute(interaction){
        if (!bdd["count"]){
            bdd["count"] = 0
            fs.writeFile("../../bdd.json", JSON.stringify(bdd, null, 4), (err) => {});
        }
        await interaction.reply({content: bdd["count"].toString(), ephemeral: true});
    },
};