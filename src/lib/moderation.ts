/**
 * Système de Modération Intelligente - Way Market
 * Détecte les contenus suspects pour protéger la plateforme.
 */

export interface ModerationResult {
  isSuspicious: boolean;
  reasons: string[];
}

// Mots-clés déclenchant une mise en quarantaine immédiate
const SUSPICIOUS_KEYWORDS = [
  'crypto', 'bitcoin', 'virement', 'western union', 'transcash', 
  'argent facile', 'placement', 'investissement', 'urgent', 
  'cadeau', 'donner', 'gratuitement', 'arnaque', 'remboursement',
  'drogue', 'weed', 'shit', 'pills', 'ordonnance', 'prete', 'credits',
  'mandat cash', 'mandat', 'recharger', 'ticket'
];

export function checkListingModeration(title: string, description: string, price: number): ModerationResult {
  const reasons: string[] = [];
  const fullText = (title + ' ' + description).toLowerCase();

  // 1. Détection de mots-clés suspects
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter(word => fullText.includes(word));
  if (foundKeywords.length > 0) {
    reasons.push(`Contient des termes suspects : ${foundKeywords.join(', ')}`);
  }

  // 2. Anomalies de prix
  if (price <= 0) {
    reasons.push("Prix invalide ou nul (0€)");
  }
  
  // Exemple de détection de prix irréaliste pour des objets chers
  if (title.toLowerCase().includes('iphone') && price < 50) {
    reasons.push("Prix anormalement bas pour un produit high-tech");
  }

  // 3. Détection de spam (répétitions de caractères)
  const spamPattern = /(.)\1{5,}/; // ex: fffffff
  if (spamPattern.test(fullText)) {
    reasons.push("Suspicion de spam (répétitions de caractères)");
  }

  // 4. Description trop courte
  if (description.trim().length < 20) {
    reasons.push("Description trop courte pour être crédible");
  }

  return {
    isSuspicious: reasons.length > 0,
    reasons
  };
}
