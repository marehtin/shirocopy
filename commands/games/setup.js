const {SlashCommandBuilder} = require("discord.js");
const bdd = require("../../bdd.json")
const {} = require("../../config.json")
const fs = require("fs")

module.exports = {
    data: new SlashCommandBuilder().setName("setup").setDescription("setup"),
    async execute(interaction){
        if (interaction.member.user.id.toString()  == "363567819947900928"){
            


            await interaction.reply({content: "Done !", ephemeral: true});
        } else await interaction.reply({content: "T'as pos l'droit", ephemeral: true});
    },
};