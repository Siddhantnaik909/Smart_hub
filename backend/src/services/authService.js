const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { memoryStore, createId } = require("../store/memoryStore");
const { config } = require("../config/env");

async function findUserByUsername(username, dbReady) {
  if (dbReady) return User.findOne({ username });
  return memoryStore.users.find((u) => u.username === username) || null;
}

async function findUserByEmail(email, dbReady) {
  if (dbReady) return User.findOne({ email });
  return memoryStore.users.find((u) => u.email === email) || null;
}

async function createUser(payload, dbReady) {
  if (dbReady) return User.create(payload);
  const user = { id: createId(), ...payload, createdAt: new Date() };
  memoryStore.users.push(user);
  return user;
}

async function listUsers(dbReady) {
  if (dbReady) return User.find({}, "username name role email createdAt");
  return memoryStore.users.map(({ passwordHash, ...rest }) => rest);
}

function signToken(user) {
  const id = user.id || String(user._id);
  return jwt.sign(
    { sub: id, username: user.username, email: user.email, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: "8h" }
  );
}

async function ensureDefaultAdmin(dbReady) {
  const existing = await findUserByEmail("admin@smarthub.local", dbReady);
  if (existing) return;
  const passwordHash = await bcrypt.hash("admin123", 10);
  await createUser(
    {
      username: "admin",
      name: "Admin User",
      email: "admin@smarthub.local",
      passwordHash,
      role: "admin",
    },
    dbReady
  );
  console.log("Default admin account created: admin@smarthub.local / admin123");
}

module.exports = {
  findUserByUsername,
  findUserByEmail,
  createUser,
  listUsers,
  signToken,
  ensureDefaultAdmin,
};