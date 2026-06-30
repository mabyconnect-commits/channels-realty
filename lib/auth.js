// Auth helpers — bcrypt password hashing + JWT in an httpOnly cookie.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('./prisma');
const { HttpError } = require('./http');

const COOKIE = 'cr_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';

const hashPassword = (pw) => bcrypt.hash(pw, 10);
const verifyPassword = (pw, hash) => bcrypt.compare(pw, hash);

function signToken(user) {
  return jwt.sign({ uid: user.id, role: user.role }, SECRET, { expiresIn: MAX_AGE });
}

function setSessionCookie(res, token) {
  const parts = [
    `${COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${MAX_AGE}`,
  ];
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function readToken(req) {
  const raw = req.headers.cookie || '';
  const m = raw.split(';').map((s) => s.trim()).find((s) => s.startsWith(COOKIE + '='));
  if (m) return m.slice(COOKIE.length + 1);
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

// Returns the signed-in user (with wallet) or throws 401.
async function requireUser(req) {
  const token = readToken(req);
  if (!token) throw new HttpError(401, 'Not signed in');
  let payload;
  try { payload = jwt.verify(token, SECRET); } catch { throw new HttpError(401, 'Session expired'); }
  const user = await prisma.user.findUnique({ where: { id: payload.uid }, include: { wallet: true, membership: true } });
  if (!user) throw new HttpError(401, 'Account not found');
  return user;
}

async function optionalUser(req) {
  try { return await requireUser(req); } catch { return null; }
}

function requireAdmin(user) {
  if (!user || user.role !== 'ADMIN') throw new HttpError(403, 'Admins only');
  return user;
}

// Generate a readable, unique-ish referral code.
function genRefCode(firstName) {
  const base = (firstName || 'CR').replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 6) || 'CHANNEL';
  return base + Math.floor(1000 + Math.random() * 9000);
}

// Public-safe user shape for API responses.
function publicUser(u) {
  return {
    id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName,
    phone: u.phone, role: u.role, refCode: u.refCode, kycStatus: u.kycStatus,
    membership: u.membership ? u.membership.tier : 'STARTER',
    wallet: u.wallet ? {
      balance: Number(u.wallet.balance), pending: Number(u.wallet.pending),
      bonusCredit: Number(u.wallet.bonusCredit), points: u.wallet.points,
    } : null,
    createdAt: u.createdAt,
  };
}

module.exports = {
  COOKIE, hashPassword, verifyPassword, signToken, setSessionCookie, clearSessionCookie,
  readToken, requireUser, optionalUser, requireAdmin, genRefCode, publicUser,
};
