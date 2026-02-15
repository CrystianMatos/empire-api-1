const express = require("express");
const commands = require("./data/commands.json");
const { setNestedValue } = require("./utils/nestedHeaders");

module.exports = function (sockets) {
  const app = express();
  const cors = require("cors");
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const { prisma } = require("./src/lib/prisma"); // ajuste se o caminho for diferente
  app.use(cors());
  app.use(express.json());
  app.use(cors({ origin: "http://localhost:5173" }));
  const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
  });

  app.get("/:server/:command/:headers", async (req, res) => {
    if (req.params.server in sockets) {
      if (
        sockets[req.params.server] !== null &&
        sockets[req.params.server].connected.isSet
      ) {
        try {
          const messageHeaders = JSON.parse(`{${req.params.headers}}`);
          sockets[req.params.server].socket.sendJsonCommand(
            req.params.command,
            messageHeaders,
          );

          let responseHeaders = {};
          if (req.params.command in commands) {
            for (const [messageKey, responsePath] of Object.entries(
              commands[req.params.command],
            )) {
              if (messageKey in messageHeaders) {
                setNestedValue(
                  responseHeaders,
                  responsePath,
                  messageHeaders[messageKey],
                );
              }
            }
          } else {
            responseHeaders = messageHeaders;
          }

          const response = await sockets[
            req.params.server
          ].socket.waitForJsonResponse(
            req.params.command,
            responseHeaders,
            (timeout = 1000),
          );
          res.status(200).json({
            server: req.params.server,
            command: req.params.command,
            return_code: response.payload.status,
            content: response.payload.data,
          });
        } catch (error) {
          console.log(error.message);
          res.status(400).json({ error: "Invalid command or headers" });
        }
      } else {
        res.status(500).json({ error: "Server not connected" });
      }
    } else {
      res.status(404).json({ error: "Server not found" });
    }
  });

  app.get("/status", (req, res) => {
    const status = {};
    for (const [server, socket] of Object.entries(sockets)) {
      status[server] = socket.connected.isSet;
    }
    res.status(200).json(status);
  });

  app.get("/", (req, res) => res.status(200).send("API running"));
  app.get("/api/health", (req, res) => res.json({ ok: true }));

  app.get("/api/test-db", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  });
  app.post("/api/register", async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "email/password required" });

    const hash = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: { email, password: hash, credits: 0 },
        select: { id: true, email: true, credits: true },
      });
      res.json(user);
    } catch {
      res.status(400).json({ error: "email already exists" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "email/password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, credits: user.credits },
    });
  });

  function auth(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "missing token" });

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.userId = payload.userId;
      next();
    } catch {
      return res.status(401).json({ error: "invalid token" });
    }
  }

  app.get("/api/me", auth, async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, credits: true, createdAt: true },
    });
    res.json(user);
  });

  app.get("/api/credits", auth, async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { credits: true },
    });
    res.json({ credits: user?.credits ?? 0 });
  });

  app.get("/api/bots", auth, async (req, res) => {
    const bots = await prisma.bot.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(bots);
  });

  app.post("/api/bots", auth, async (req, res) => {
    const { name } = req.body || {};
    const bot = await prisma.bot.create({
      data: { name: name || "New bot", userId: req.userId },
    });
    res.json(bot);
  });

  return app;
};
