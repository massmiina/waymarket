import { db } from '@/lib/db';

/**
 * Enregistre une action d'administration dans la base de données.
 * @param adminId - L'ID de l'administrateur effectuant l'action.
 * @param action - Le type d'action (ex: BAN_USER, PROMOTE_ADMIN, etc.).
 * @param details - Un objet détaillé sur l'action effectuée.
 */
export async function logAdminAction(adminId: string, action: string, details: any) {
  try {
    await db.adminLog.create({
      data: {
        adminId,
        action,
        details: JSON.stringify(details)
      }
    });
    console.log(`[ADMIN LOG] ${action} recorded for admin ${adminId}`);
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}
