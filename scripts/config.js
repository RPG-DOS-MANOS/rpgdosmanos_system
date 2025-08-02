import "./discord.js";
game.settings.register("rpgdosmanos_system", "discord-token", {
  name: "Escreva o token do Discord",
  hint: "Insira o token do Discord para autenticação",
  scope: "world",
  config: true,
  type: String,
  default: "",
    onChange: value => {
        console.log(`Discord token changed to: ${value}`);
        // Aqui você pode adicionar lógica para lidar com a mudança do token, se necessário
        setDiscordSdk(value);
    }
});