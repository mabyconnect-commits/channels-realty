// Seed catalog data (estates, drops, ventures) + a demo admin & user.
// Run: npm run db:seed   (idempotent — safe to re-run)
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const N = (naira) => BigInt(naira) * 100n; // naira -> kobo
const days = (n) => new Date(Date.now() + n * 864e5);

async function main() {
  // ---- Estates + drops ----
  const estates = [
    { slug: 'gardens', name: 'Channels Gardens', city: 'Epe', state: 'Lagos', pricePerSqm: N(12000), totalSqm: 6400, availableSqm: 2840, titleType: 'C of O', apprPct: 18, tag: 'Hot', blurb: 'Premier estate minutes from the Lekki–Epe expressway.', amenities: ['Gated & fenced', 'Tarred roads', 'Drainage', 'Security'] },
    { slug: 'haven', name: 'Channels Haven', city: 'Ibeju-Lekki', state: 'Lagos', pricePerSqm: N(18000), totalSqm: 4000, availableSqm: 1120, titleType: 'Gazette', apprPct: 24, tag: 'New', blurb: 'Next to the Dangote Refinery corridor.', amenities: ['Gated & fenced', 'Street lights', 'Security'] },
    { slug: 'meadows', name: 'Channels Meadows', city: 'Mowe', state: 'Ogun', pricePerSqm: N(8000), totalSqm: 5200, availableSqm: 4300, titleType: 'C of O', apprPct: 14, tag: 'Affordable', blurb: 'Budget-friendly entry into ownership.', amenities: ['Fenced', 'Graded roads', 'Security'] },
    { slug: 'heights', name: 'Channels Heights', city: 'Kuje', state: 'Abuja', pricePerSqm: N(15000), totalSqm: 3000, availableSqm: 980, titleType: 'C of O', apprPct: 20, tag: 'Capital', blurb: 'Own a piece of the FCT in a titled estate.', amenities: ['Gated', 'Power', 'Water', 'Security'] },
  ];
  for (const e of estates) {
    const estate = await prisma.estate.upsert({ where: { slug: e.slug }, create: e, update: e });
    await prisma.drop.deleteMany({ where: { estateId: estate.id } });
    // presale = listed price; main/regular step up
    const base = estate.pricePerSqm; // kobo
    await prisma.drop.create({ data: {
      estateId: estate.id, name: `${e.name} — Launch Drop`, phase: 'Presale',
      presalePrice: base, mainPrice: (base * 118n) / 100n, regularPrice: (base * 128n) / 100n,
      minSqm: 1, endsAt: days(15), active: true,
    }});
  }

  // ---- Joint ventures ----
  const ventures = [
    { name: 'Lekki Terrace Duplexes', city: 'Ibeju-Lekki, Lagos', target: N(60000000), minInvest: N(250000), roiPct: 32, months: 18, slots: 14 },
    { name: 'Epe Smart Shortlets', city: 'Epe, Lagos', target: N(80000000), raised: N(57000000), minInvest: N(150000), roiPct: 26, months: 12, slots: 6 },
    { name: 'Abuja Commercial Plaza', city: 'Kuje, Abuja', target: N(100000000), minInvest: N(500000), roiPct: 40, months: 24, slots: 28 },
  ];
  await prisma.jointVenture.deleteMany({});
  for (const v of ventures) await prisma.jointVenture.create({ data: { raised: 0n, ...v } });

  // ---- Demo admin + user (referral chain) ----
  const adminPw = await bcrypt.hash('admin1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@channels.realty' },
    update: { role: 'ADMIN' },
    create: { email: 'admin@channels.realty', passwordHash: adminPw, firstName: 'Channels', lastName: 'Admin', role: 'ADMIN', refCode: 'ADMIN001', wallet: { create: {} }, membership: { create: { tier: 'ELITE' } } },
  });

  const demoPw = await bcrypt.hash('demo1234', 10);
  await prisma.user.upsert({
    where: { email: 'tunde@channels.realty' },
    update: {},
    create: {
      email: 'tunde@channels.realty', passwordHash: demoPw, firstName: 'Tunde', lastName: 'Adeyemi',
      refCode: 'TUNDE2024', referredById: admin.id, kycStatus: 'APPROVED',
      wallet: { create: { balance: N(142500), pending: N(28000), bonusCredit: N(20000), points: 640 } },
      membership: { create: { tier: 'PRO' } },
    },
  });

  console.log('✅ Seed complete. Demo logins:');
  console.log('   admin@channels.realty / admin1234  (ADMIN)');
  console.log('   tunde@channels.realty / demo1234   (USER)');
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
