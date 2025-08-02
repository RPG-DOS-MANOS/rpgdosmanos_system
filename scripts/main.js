/**
 * RPG dos Manos - Discord SDK Integration
 *
 * INSTRUÇÕES:
 * 1. Cole este código no arquivo JavaScript principal do seu módulo/sistema.
 * 2. Certifique-se de que o Discord Embedded App SDK está sendo importado corretamente no seu projeto.
 * Normalmente, você faria isso no topo do seu arquivo:
 * import { DiscordSDK } from "@discord/embedded-app-sdk";
 *
 * O QUE ESTE CÓDIGO FAZ:
 * - Registra uma configuração no menu do Foundry para que você possa inserir seu "Client ID" do Discord.
 * - Cria uma função para inicializar o SDK do Discord.
 * - Tenta inicializar o SDK assim que o Foundry está pronto ("ready" hook).
 * - Re-inicializa o SDK automaticamente se você alterar o Client ID nas configurações.
 * - Fornece logs e notificações para facilitar a depuração.
 */

// Variável global para manter a instância do SDK.
// É importante mantê-la fora dos hooks para que possa ser acessada de qualquer lugar.
let discordSdk = null;

/**
 * Função principal para configurar e inicializar o Discord SDK.
 * Esta função pode ser chamada a qualquer momento para tentar (re)iniciar a conexão.
 */
async function setupDiscordSdk() {
  // 1. Pega o Client ID das configurações do Foundry.
  const clientId = game.settings.get("rpgdosmanos_system", "discord-client-id");

  // 2. Verifica se o Client ID foi preenchido. Se não, avisa o usuário e para a execução.
  if (!clientId) {
    console.log("RPG dos Manos | Discord Client ID não configurado. A inicialização do SDK foi abortada.");
    // Opcional: notificar o GM na interface.
    if (game.user.isGM) {
        ui.notifications.warn("Para integrar com o Discord, por favor, insira o Client ID da sua aplicação nas configurações do sistema.");
    }
    return;
  }

  // 3. Se já existir uma instância antiga do SDK, é uma boa prática tentar "fechá-la" antes de criar uma nova.
  // A SDK atual não tem um método `close()` explícito, então apenas criar uma nova instância sobre a antiga é suficiente.
  // No futuro, se um método de limpeza for adicionado, ele iria aqui.

  try {
    console.log(`RPG dos Manos | Tentando inicializar o Discord SDK com o Client ID: ${clientId}`);

    // 4. **PONTO CRÍTICO DA CORREÇÃO:** Instancia o SDK usando o `clientId`, e não um token.
    discordSdk = new DiscordSDK(clientId);

    // 5. Aguarda o SDK estabelecer a comunicação com o cliente Discord.
    // Isso confirma que seu jogo está rodando dentro de uma Atividade do Discord.
    await discordSdk.ready();

    console.log("RPG dos Manos | Discord SDK está pronto e conectado ao cliente Discord.");
    if (game.user.isGM) {
        ui.notifications.info("SDK do Discord conectado com sucesso!");
    }

    // --- PRÓXIMOS PASSOS (AUTENTICAÇÃO) ---
    // A partir daqui, você precisaria autenticar o usuário para obter informações dele.
    // Isso envolve um fluxo OAuth2 que requer um backend (servidor) para ser feito de forma segura.
    // O código abaixo é um exemplo do que você faria a seguir, mas requer um servidor que você mesmo precisa criar.
    /*
    const { code } = await discordSdk.commands.authorize({
      client_id: clientId,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: ["identify", "guilds"],
    });

    // Você enviaria este 'code' para o seu servidor.
    // Seu servidor então o trocaria por um 'access_token' junto à API do Discord.
    // E então você usaria o token para autenticar.
    const { access_token } = await fetch(`https://meuservidor.com/api/token?code=${code}`).then(res => res.json());

    await discordSdk.commands.authenticate({ access_token });
    */


  } catch (error) {
    console.error("RPG dos Manos | Falha ao configurar o Discord SDK. Verifique os erros abaixo.");
    console.error(error);
    if (game.user.isGM) {
        ui.notifications.error("Falha ao conectar com o SDK do Discord. Verifique o Client ID e o console (F12).");
    }
    // Limpa a instância em caso de falha.
    discordSdk = null;
  }
}

// Hook do Foundry VTT que executa uma única vez quando o jogo está completamente carregado.
// É o local ideal para registrar configurações e fazer a primeira inicialização.
Hooks.once("ready", () => {
  // Registra a configuração no banco de dados do Foundry.
  game.settings.register("rpgdosmanos_system", "discord-client-id", {
    name: "Discord Application Client ID", // Nome mais claro
    hint: "Insira o Client ID da sua aplicação encontrada no Portal de Desenvolvedores do Discord. Não é um token.", // Hint mais claro
    scope: "world",  // 'world' significa que a configuração é a mesma para todos no mesmo mundo.
    config: true,    // 'true' para que apareça no menu de configurações.
    type: String,
    default: "",
    // A função 'onChange' é chamada sempre que o valor desta configuração é alterado.
    onChange: value => {
      console.log(`RPG dos Manos | O Client ID do Discord foi alterado. Reiniciando o SDK...`);
      // Chama a função de setup novamente para usar o novo ID.
      setupDiscordSdk();
    }
  });

  // Tenta fazer a configuração inicial assim que o jogo carrega.
  setupDiscordSdk();
});
