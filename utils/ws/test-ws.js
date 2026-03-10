// test-ws.js
const fs = require("fs");
const path = require("path");

const wsPath = path.join(__dirname, "utils", "ws");

console.log("📁 Verificando pasta utils/ws:");

if (fs.existsSync(wsPath)) {
  const files = fs.readdirSync(wsPath);
  console.log("Arquivos encontrados:", files);

  // Mostra o conteúdo de cada arquivo .js
  files.forEach((file) => {
    if (file.endsWith(".js")) {
      console.log(`\n📄 Conteúdo de ${file}:`);
      console.log("-------------------");
      const content = fs.readFileSync(path.join(wsPath, file), "utf8");
      console.log(content.substring(0, 200) + "..."); // primeiros 200 caracteres
    }
  });
} else {
  console.log("❌ Pasta utils/ws não existe!");

  // Verifica se pelo menos a pasta utils existe
  const utilsPath = path.join(__dirname, "utils");
  if (fs.existsSync(utilsPath)) {
    console.log("\n📁 Arquivos em utils/:", fs.readdirSync(utilsPath));
  }
}
