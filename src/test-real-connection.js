// test-real-connection.js
const { getSockets, connectSockets } = require("./utils/ws/sockets");

async function conectarNoJogo() {
  console.log("🎮 TENTANDO CONECTAR NO GOODGAME EMPIRE");
  console.log("=======================================");

  try {
    // Passo 1: Pegar os sockets disponíveis
    console.log("1️⃣ Buscando sockets...");
    const sockets = await getSockets();
    console.log("✅ Sockets encontrados:", sockets);

    // Passo 2: Conectar nos sockets
    console.log("\n2️⃣ Conectando nos sockets...");
    const conexoes = await connectSockets(sockets);
    console.log("✅ Conectado!", conexoes);

    return { success: true, conexoes };
  } catch (error) {
    console.error("❌ Erro na conexão:", error.message);
    return { success: false, error: error.message };
  }
}

conectarNoJogo();
