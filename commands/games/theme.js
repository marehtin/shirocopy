const {SlashCommandBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder, ComponentType} = require("discord.js");
const bdd = require("../../bdd.json")
const {} = require("../../config.json")
const fs = require("fs")

function saveBDD() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {});
}

module.exports = {
    data: new SlashCommandBuilder().setName("theme").setDescription("Changer de thème"),
    async execute(interaction){
        const select = new StringSelectMenuBuilder()
            .setCustomId("theme")
            .setPlaceholder("Sélectionnez le thème")

        list = ["Inazuma", "Mondstadt", "Liyue", "Mamoru", "Klee", "Rin"]
        for (el of list){
            select.addOptions(
                new StringSelectMenuOptionBuilder()
                .setLabel(el)
                .setValue(el)
            )
        }

        const row = new ActionRowBuilder()
			.addComponents(select);
        
        const response = await interaction.reply({
                content: 'Sélectionner votre thème',
                components: [row],
            });
        
        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000});
        collector.on("collect", async i => {
            theme = i.values[0];
            bdd.users[interaction.member.user.id.toString()]["theme"] = theme
            saveBDD();
            interaction.editReply({content: `Votre thème est désormais ${theme}`, components:[]})
        });
    },
};