const request = require("supertest");
const app = require("../app");
const db = require("../config/db");

describe("Rutas de Autenticación", () => {
  it("Debe registrar un nuevo usuario", async () => {
    const randomEmail = `test${Date.now()}@example.com`;
    const res = await request(app)
      .post("/api/register")
      .send({
        nombre: "loki",
        apellido: "mdasd",
        correo: randomEmail,
        password: "123456",
      });

    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Usuario registrado");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("correo", randomEmail);
  });

  it("Debe loguear un usuario existente", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        correo: "diego@gmail.com",
        password: "qweqwe",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("Debe devolver el perfil del usuario con token válido", async () => {
    // Primero logueamos para obtener token
    const loginRes = await request(app)
      .post("/api/login")
      .send({
        correo: "diego@gmail.com",
        password: "qweqwe",
      });

    const token = loginRes.body.token;

    const res = await request(app)
      .get("/api/perfil")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.usuario).toHaveProperty("nombre");
    expect(res.body.usuario).toHaveProperty("correo");
    expect(res.body.usuario).not.toHaveProperty("password");
  });

  it("Debe rechazar registro con correo ya usado", async () => {
    const existingEmail = "diego@gmail.com";

    const res = await request(app)
      .post("/api/register")
      .send({
        nombre: "Juan",
        apellido: "Perez",
        correo: existingEmail,
        password: "123456",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Usuario ya existe");
  });
});

afterAll(async () => {
  await db.end(); // cierra conexión para que Jest termine correctamente
});
