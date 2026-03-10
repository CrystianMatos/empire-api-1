import React, { useState, useEffect } from "react";
import MissoesAuto from "./components/MissoesAuto";
import AuthService from "./services/authService";

function App() {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      const session = await AuthService.checkSession();
      if (session.loggedIn) {
        setUser(currentUser);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await AuthService.login(
        credentials.username,
        credentials.password,
      );
      if (result.success) {
        setUser(result.player);
      } else {
        alert("Erro no login: " + result.message);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            width: "300px",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
            🎮 Login Goodgame Empire
          </h2>

          <input
            type="text"
            placeholder="Usuário"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {loading ? "Conectando..." : "Conectar"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          background: "#333",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>🎮 Empire Auto Bot</h2>
        <div>
          <span style={{ marginRight: "20px" }}>
            👤 {user.nickname} (Level {user.level})
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "5px 15px",
              background: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </div>
      </div>

      <MissoesAuto />
    </div>
  );
}

export default App;
