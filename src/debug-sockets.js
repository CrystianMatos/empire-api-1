// debug-sockets.js
const path = require("path");

console.log("🔍 DEBUGANDO SOCKETS.JS");
console.log("=======================");

try {
  // Vamos ver o conteúdo do arquivo primeiro
  const fs = require("fs");
  const socketsPath = path.join(__dirname, "utils", "ws", "sockets.js");

  console.log(`📁 Arquivo: ${socketsPath}`);

  if (fs.existsSync(socketsPath)) {
    console.log("✅ Arquivo encontrado!");

    // Lê as primeiras 20 linhas do arquivo
    const content = fs.readFileSync(socketsPath, "utf8");
    const lines = content.split("\n");

    console.log("\n📄 Primeiras 20 linhas:");
    console.log("---------------------");
    for (let i = 0; i < Math.min(20, lines.length); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }

    // Tenta executar o arquivo
    console.log("\n🔄 Tentando executar o módulo...");
    const sockets = require("./utils/ws/sockets");
    console.log("✅ Módulo carregado!");
    console.log("📦 Exporta:", Object.keys(sockets));

    // Se tiver a função getGgeSockets, vamos ver o que ela faz
    if (sockets.getGgeSockets) {
      console.log("\n🔧 Função getGgeSockets encontrada!");
      console.log("Código da função:");
      console.log(sockets.getGgeSockets.toString());
    }
  } else {
    console.log("❌ Arquivo NÃO encontrado!");

    // Lista o que tem na pasta utils/ws
    const wsPath = path.join(__dirname, "utils", "ws");
    if (fs.existsSync(wsPath)) {
      console.log("\n📁 Arquivos em utils/ws:");
      fs.readdirSync(wsPath).forEach((file) => {
        console.log(`   - ${file}`);
      });
    }
  }
} catch (error) {
  console.error("❌ Erro:", error);
}
