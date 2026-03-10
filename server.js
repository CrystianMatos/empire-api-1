const { getSockets, connectSockets } = require("./utils/ws/sockets");

// Objeto que vai guardar os sockets quando estiverem conectados
let activeSockets = {};

// Função que será chamada pelo login para conectar de verdade
async function initializeGameConnection(username, password) {
  console.log(`🔌 Conectando ao jogo como: ${username}`);

  // Configura as credenciais
  process.env.USERNAME = username;
  process.env.PASSWORD = password;

  try {
    console.log("📡 Buscando servidores...");
    const sockets = await getSockets();
    console.log(`✅ Encontrados ${Object.keys(sockets).length} servidores`);

    console.log("🔗 Conectando sockets...");
    await connectSockets(sockets);

    // FILTRA APENAS OS SOCKETS QUE REALMENTE CONECTARAM
    const connectedSockets = {};
    for (const [key, socket] of Object.entries(sockets)) {
      if (socket && socket.connected && socket.connected.isSet) {
        connectedSockets[key] = socket;
        console.log(`✅ Socket conectado: ${key}`);
      } else {
        console.log(`❌ Socket falhou: ${key}`);
      }
    }

    // Guarda apenas os conectados
    activeSockets = connectedSockets;

    console.log(
      `📊 Sockets ativos: ${Object.keys(activeSockets).length} de ${Object.keys(sockets).length}`,
    );

    // 🔥 IMPORTANTE: Atualiza o app.locals com os novos sockets
    if (global.app && global.app.locals) {
      global.app.locals.sockets = activeSockets;
      console.log("✅ Sockets atualizados no app.locals");
    }

    return { success: true, sockets: activeSockets };
  } catch (error) {
    console.error("❌ Erro ao conectar:", error.message);
    return { success: false, error: error.message };
  }
}

// Função para pegar os sockets ativos
function getActiveSockets() {
  return activeSockets;
}

// Cria o app e guarda a referência global
const app = require("./app")({
  sockets: activeSockets,
  getActiveSockets: getActiveSockets,
  initializeGameConnection: initializeGameConnection,
});

// Guarda referência global para acesso nas funções
global.app = app;

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
  console.log(`📝 Use POST /api/game/login para conectar ao jogo`);
});
// Adicione esta função no server.js
function countConnectedSockets() {
  let count = 0;
  const connected = [];

  // Percorre todos os sockets e verifica quais estão conectados
  for (const [key, socket] of Object.entries(activeSockets)) {
    if (socket && socket.connected && socket.connected.isSet) {
      count++;
      connected.push(key);
    }
  }

  console.log(`📊 Sockets conectados: ${count}`);
  console.log("   Lista:", connected);

  return { count, connected };
}

// Chame esta função depois de conectar
// Exemplo: após connectSockets(sockets)
const result = countConnectedSockets();

// Exporta as funções para uso em outros módulos
module.exports = { app, getActiveSockets, initializeGameConnection };
