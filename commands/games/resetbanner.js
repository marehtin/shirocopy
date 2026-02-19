const {SlashCommandBuilder} = require("discord.js");
const bdd = require("../../bdd.json")
const {} = require("../../config.json")
const fs = require("fs")
const handler = require("../../games/wish.js")

module.exports = {
    data: new SlashCommandBuilder().setName("resetbanner").setDescription("setup"),
    async execute(interaction, client){
        if (interaction.member.user.id.toString()  == "363567819947900928"){
            handler.resetRandom(interaction.client)
            await interaction.reply({content: "Done !", ephemeral: true});
        } else await interaction.reply({content: "T'as pos l'droit", ephemeral: true});
    },
};