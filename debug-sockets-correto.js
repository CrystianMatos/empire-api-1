// debug-sockets-correto.js
const path = require("path");
const fs = require("fs");

console.log("🔍 DEBUGANDO SOCKETS.JS (CAMINHO CORRETO)");
console.log("=========================================");

// ✅ CAMINHO CORRETO (sem src)
const socketsPath = path.join(__dirname, "utils", "ws", "sockets.js");

console.log(`📁 Arquivo: ${socketsPath}`);

if (fs.existsSync(socketsPath)) {
  console.log("✅ Arquivo encontrado!");

  // Mostra o conteúdo
  const conteudo = fs.readFileSync(socketsPath, "utf8");
  console.log("\n📄 Primeiras 100 linhas:");
  console.log("-".repeat(50));

  const linhas = conteudo.split("\n");
  for (let i = 0; i < Math.min(100, linhas.length); i++) {
    if (
      linhas[i].includes("function") ||
      linhas[i].includes("async") ||
      linhas[i].includes("module.exports") ||
      i < 20
    ) {
      // primeiras 20 linhas sempre
      console.log(`${i + 1}: ${linhas[i].trim()}`);
    }
  }

  // Tenta importar
  try {
    console.log("\n🔄 Importando módulo...");
    const sockets = require("./utils/ws/sockets");
    console.log("✅ Módulo importado!");
    console.log("📦 Exporta:", Object.keys(sockets));
  } catch (e) {
    console.log("❌ Erro ao importar:", e.message);
  }
} else {
  console.log("❌ Arquivo NÃO encontrado!");

  // Lista o que tem na pasta utils
  const utilsPath = path.join(__dirname, "utils");
  if (fs.existsSync(utilsPath)) {
    console.log("\n📁 Conteúdo de utils/:");
    fs.readdirSync(utilsPath).forEach((item) => {
      const itemPath = path.join(utilsPath, item);
      const stats = fs.statSync(itemPath);
      const tipo = stats.isDirectory() ? "📁" : "📄";
      console.log(`   ${tipo} ${item}`);

      // Se for pasta ws, lista o conteúdo
      if (item === "ws" && stats.isDirectory()) {
        const wsPath = path.join(utilsPath, item);
        fs.readdirSync(wsPath).forEach((wsItem) => {
          console.log(`      📄 ${wsItem}`);
        });
      }
    });
  }
}
