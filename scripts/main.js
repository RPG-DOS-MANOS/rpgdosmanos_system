/**
 * RPG dos Manos - Discord SDK Integration (Versão Pre-World)
 *
 * ATENÇÃO: Para este código funcionar, você DEVE editar a linha abaixo
 * e inserir o seu Client ID diretamente no arquivo.
 */
const CLIENT_ID = "1401000620814503946"; // <-- COLE SEU CLIENT ID AQUI

/**
 * Verifica se a aplicação está a correr dentro de um iframe, como no cliente Discord.
 * @returns {boolean}
 */
function isInsideDiscord() {
  return window.self !== window.top;
}

/**
 * Função principal para configurar e inicializar o Discord SDK.
 * Agora usa o CLIENT_ID definido no topo do arquivo.
 */
async function setupDiscordSdk() {
  // 1. Verifica se o Client ID foi preenchido no arquivo.
  if (!CLIENT_ID || CLIENT_ID === "1401000620814503946") {
    console.error("RPG dos Manos | O Client ID do Discord não foi definido no arquivo main.js!");
    // Opcional: Adicionar um aviso visual, se possível nesta fase.
    return;
  }

  try {
    console.log(`RPG dos Manos | Tentando inicializar o Discord SDK com o Client ID: ${CLIENT_ID}`);

    // 2. Instancia o SDK.
    const discordSdk = new DiscordSDK(CLIENT_ID);

    // 3. Aguarda o SDK estabelecer a comunicação, com um timeout de 8 segundos.
    await Promise.race([
        discordSdk.ready(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout: A conexão com o SDK do Discord demorou demasiado.")), 8000))
    ]);

    console.log("RPG dos Manos | Discord SDK está pronto e conectado ao cliente Discord.");

    // A partir daqui, você pode usar o 'discordSdk' para outras operações, como autenticação.
    // Exemplo:
    /*
    const { code } = await discordSdk.commands.authorize({
      client_id: CLIENT_ID,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: ["identify", "guilds"],
    });
    // ... etc
    */

  } catch (error) {
    console.error("RPG dos Manos | Falha ao configurar o Discord SDK. Verifique os erros abaixo.");
    console.error(error);
  }
}

/**
 * Hook do Foundry VTT que executa assim que o código base do Foundry é inicializado,
 * antes mesmo da tela de seleção de mundo aparecer.
 * Este é o local correto para código que precisa rodar fora de um mundo.
 */
Hooks.once("init", () => {
  // Verifica se estamos dentro do Discord antes de tentar qualquer coisa.
  if (isInsideDiscord()) {
    console.log("RPG dos Manos | Aplicação a correr dentro do Discord. A iniciar o SDK...");
    setupDiscordSdk();
  } else {
    console.log("RPG dos Manos | Aplicação a correr fora do Discord. O SDK não será iniciado.");
  }
});
