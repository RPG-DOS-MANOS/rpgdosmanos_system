// Import the SDK
import { DiscordSDK } from "@discord/embedded-app-sdk";

// Instantiate the SDK
const discordSdk = new DiscordSDK();

setupDiscordSdk().then(() => {
  console.log("Discord SDK is ready");
});

async function setupDiscordSdk() {
  await discordSdk.ready();
}
