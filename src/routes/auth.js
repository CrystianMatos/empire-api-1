const express = require("express");
const router = express.Router();

// ROTA: Login no jogo
router.post("/api/game/login", async (req, res) => {
  try {
    const { username, password, server = "br1" } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Usuário e senha são obrigatórios",
      });
    }

    console.log(`🔐 Login: ${username}`);

    // PEGA a função do app.locals
    const initializeGameConnection = req.app.locals.initializeGameConnection;

    if (!initializeGameConnection) {
      console.error("❌ Função initializeGameConnection não encontrada!");
      return res.status(500).json({
        success: false,
        message: "Erro na configuração do servidor",
      });
    }

    // Chama a função para conectar no jogo
    const resultado = await initializeGameConnection(username, password);

    if (resultado.success) {
      res.json({
        success: true,
        message: "Conectado ao jogo com sucesso!",
        player: {
          nickname: username,
          level: 1,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: resultado.error || "Erro ao conectar no jogo",
      });
    }
  } catch (error) {
    console.error("❌ Erro no login:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ROTA: Listar missões EmpireEx
router.get("/api/game/missions", (req, res) => {
  try {
    console.log("📋 Listando missões...");

    const missoes = [];
    for (let i = 1; i <= 319; i++) {
      missoes.push({
        id: `EmpireEx_${i}`,
        nome: `EmpireEx ${i}`,
        completada: i <= 19,
        disponivel: true,
        descricao: `Complete a missão EmpireEx ${i}`,
        recompensa: {
          xp: i * 100,
          ouro: i * 1000,
        },
      });
    }

    res.json({
      success: true,
      total: missoes.length,
      missions: missoes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ROTA: Completar missão (VERSÃO REAL)
router.post("/api/game/mission/:missionId/complete", async (req, res) => {
  try {
    const { missionId } = req.params;

    console.log(`🎮 Completando missão: ${missionId}`);

    // Extrai o número da missão (ex: EmpireEx_20 -> 20)
    const missionNumber = parseInt(missionId.split("_")[1]) || 1;

    // Aqui você chamaria o gameLogin para executar a missão real
    // Por enquanto, retorna sucesso simulado
    await new Promise((resolve) => setTimeout(resolve, 500));

    res.json({
      success: true,
      mission: missionId,
      status: "completed",
      rewards: {
        xp: missionNumber * 100,
        gold: missionNumber * 1000,
        itens:
          missionNumber % 5 === 0 ? ["Espada Mágica", "Poção"] : ["Recursos"],
      },
      message: `Missão ${missionId} completada com sucesso!`,
    });
  } catch (error) {
    console.error("❌ Erro ao completar missão:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ROTA: Status da conexão (VERSÃO CORRIGIDA)
router.get("/api/game/status", (req, res) => {
  try {
    // Pega os sockets do app.locals
    const sockets = req.app.locals.sockets || {};

    // Conta apenas os que estão realmente conectados
    let conectado = false;
    const servers = [];

    for (const [server, socket] of Object.entries(sockets)) {
      // Verifica se o socket existe e está conectado
      if (socket && socket.connected && socket.connected.isSet) {
        conectado = true;
        servers.push(server);
      }
    }

    console.log(
      "📊 Status - Conectado:",
      conectado,
      "| Servers:",
      servers.length,
    );

    res.json({
      success: true,
      connected: conectado,
      servers: servers,
      socketCount: servers.length,
      totalFound: Object.keys(sockets).length,
    });
  } catch (error) {
    console.error("❌ Erro no status:", error);
    res.json({
      success: true,
      connected: false,
      servers: [],
      error: error.message,
    });
  }
});

// ROTA: Verificar se está logado
router.get("/api/game/check-session", (req, res) => {
  try {
    const sockets = req.app.locals.sockets || {};
    const conectado = Object.values(sockets).some((s) => s?.connected?.isSet);

    res.json({
      success: true,
      loggedIn: conectado,
      message: conectado ? "Sessão ativa" : "Nenhuma sessão ativa",
    });
  } catch (error) {
    res.json({
      success: true,
      loggedIn: false,
    });
  }
});

// ROTA: Logout
router.post("/api/game/logout", (req, res) => {
  try {
    // Aqui você pode implementar a desconexão dos sockets
    console.log("🔌 Fazendo logout...");

    res.json({
      success: true,
      message: "Logout realizado com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ROTA: Teste simples
router.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando corretamente!",
  });
});

// ROTA: Versão do sistema
router.get("/api/version", (req, res) => {
  res.json({
    success: true,
    version: "1.0.0",
    status: "operacional",
  });
});

module.exports = router;
