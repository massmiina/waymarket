import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- DIAGNOSTIC BASE DE DONNÉES ---');
  try {
    console.log('1. Tentative de connexion...');
    const userCount = await prisma.user.count();
    console.log(`✅ Connexion réussie. Nombre d'utilisateurs : ${userCount}`);

    console.log('2. Test de création/mise à jour (Upsert)...');
    const testId = 'test-id-' + Date.now();
    const testUser = await prisma.user.upsert({
      where: { id: testId },
      update: { name: 'Test User' },
      create: { 
        id: testId,
        email: `test-${testId}@example.com`,
        name: 'Test User'
      }
    });
    console.log(`✅ Upsert réussi pour l'utilisateur : ${testUser.id}`);

    console.log('3. Nettoyage...');
    await prisma.user.delete({ where: { id: testId } });
    console.log('✅ Nettoyage terminé.');

    console.log('\n--- RÉSULTAT DU TEST : TOUT EST OK ---');
  } catch (error: any) {
    console.error('\n❌ ERREUR DÉTECTÉE :');
    console.error(error.message);
    if (error.code === 'P2024') {
      console.error('💡 Cause probable : Timeout de connexion (Base de données saturée).');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
