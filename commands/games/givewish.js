const {SlashCommandBuilder} = require("discord.js");
const bdd = require("../../bdd.json")
const {} = require("../../config.json")
const fs = require("fs")

module.exports = {
    data: new SlashCommandBuilder().setName("givewish").setDescription("givewish"),
    async execute(interaction){
        if (interaction.member.user.id.toString()  == "363567819947900928"){
            
            interaction.channel.guild.members.fetch().then(members =>
                {
                    members.forEach(member =>
                    {   
                        if (!member.user.bot){
                            try {
                                bdd.users[member.user.id.toString()]["primogems"] += 16000
                            } catch (error) {
                                
                            }
                        }
                    });
                });
                
            await interaction.reply({content: "Done !", ephemeral: true});
            interaction.channel.send("J'ai envie de vous donner 100 voeux chacuns.. cadeau")
        } else await interaction.reply({content: "T'as pos l'droit", ephemeral: true});
    },
};