const AuditLog = require("../models/AuditLog");
const { memoryStore, createId } = require("../store/memoryStore");

async function writeAudit(dbReady, payload) {
  if (dbReady) {
    return AuditLog.create(payload);
  }
  const record = { id: createId(), ...payload, createdAt: new Date() };
  memoryStore.auditLogs.unshift(record);
  return record;
}

async function listAudits(dbReady, limit = 100) {
  if (dbReady) return AuditLog.find().sort({ createdAt: -1 }).limit(limit);
  return memoryStore.auditLogs.slice(0, limit);
}

module.exports = { writeAudit, listAudits };
