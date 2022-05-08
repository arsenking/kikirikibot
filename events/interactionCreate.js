module.exports = {
    name: "interactionCreate",
    run: async (bot, interaction) => {
        const {client} = bot
        if (!interaction.isCommand()) return 
        if (!interaction.inGuild()) return interaction.reply("This command can only be used in a server")

        const slashcmd = client.slashcommands.get(interaction.commandName)

        if (!slashcmd) return interaction.reply("Invalid slash command")

        if (slashcmd.perm && !interaction.member.permissions.has(slashcmd.perm))
        return interaction.reply("You do not have permission for this command")

        slashcmd.run(client, interaction)
    }
}