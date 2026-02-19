const {SlashCommandBuilder} = require("discord.js");
const bdd = require("../../bdd.json")
const {} = require("../../config.json")
const fs = require("fs")
const handler = require("../../games/wish.js")
const items = require("../../items.json")

const characters = Object.assign({}, items.characters["5stars"], items.characters["4stars"])

module.exports = {
    data: new SlashCommandBuilder().setName("changebanners").setDescription("Change baners")
    .addStringOption(option => option.setName("five1").setDescription("1").setRequired(true))
    .addStringOption(option => option.setName("five2").setDescription("2").setRequired(true)),
    async execute(interaction, client){
        if (interaction.member.user.id.toString()  == "363567819947900928"){
            five1 = interaction.options.getString("five1")
            five2 = interaction.options.getString("five2")
            if (five1 in characters && five2 in characters){
                handler.changeBanners(interaction.client, five1, five2)
                await interaction.reply({content: "Done !", ephemeral: true});
            }
        } else await interaction.reply({content: "T'as pos l'droit", ephemeral: true});
    },
};