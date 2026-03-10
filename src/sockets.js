// test-sockets.js
const path = require("path");

try {
  // Tenta importar o arquivo
  const socketsModule = require("./utils/ws/sockets");

  console.log("✅ Arquivo sockets.js encontrado!");
  console.log("📦 O que tem no módulo:", Object.keys(socketsModule));

  // Se for uma função, mostra ela
  if (typeof socketsModule === "function") {
    console.log("📋 É uma função");
    console.log(socketsModule.toString().substring(0, 200));
  }

  // Se for um objeto com métodos
  if (socketsModule.getGgeSockets) {
    console.log("📋 Método getGgeSockets encontrado");
  }
} catch (error) {
  console.error("❌ Erro:", error.message);
}
