// src/gameLogin.js - VERSÃO DE TESTE
class GameLoginService {
  async login(username, password, server = "br1") {
    console.log(`🔐 Login simulado: ${username}`);

    return {
      success: true,
      session: {
        id: "sess-" + Date.now(),
        token: "token-" + Math.random().toString(36),
      },
      player: {
        nickname: username,
        level: 42,
      },
    };
  }

  async executeMission(session, missionId) {
    console.log(`🎮 Missão simulada: ${missionId}`);
    return {
      success: true,
      missionId,
      rewards: { xp: 1000, gold: 5000 },
    };
  }
}

module.exports = GameLoginService;
