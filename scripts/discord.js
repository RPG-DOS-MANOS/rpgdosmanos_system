// Import the SDK
import { DiscordSDK } from "@discord/embedded-app-sdk";

// Instantiate the SDK
let token = game.settings.get("rpgdosmanos_system", "discord-token");
let discordSdk = new DiscordSDK(token);

setDiscordSdk(discordSdk_new);{
  discordSdk = new DiscordSDK(discordSdk_new);
}

setupDiscordSdk().then(() => {
  console.log("Discord SDK is ready");
});

async function setupDiscordSdk() {
  await discordSdk.ready();
}
