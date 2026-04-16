'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useMarket } from '@/contexts/MarketContext';
import { 
  Shield, 
  Image as ImageIcon, 
  Zap, 
  Star, 
  ChevronRight, 
  Check,
  Crown,
  TrendingUp,
  Layout
} from 'lucide-react';
import Link from 'next/link';

export default function ProPage() {
  const { currentUser, isLoading: isProfileLoading } = useMarket();
  const [userCount, setUserCount] = React.useState<number>(0);
  const [isLimitedOffer, setIsLimitedOffer] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/stats/user-count')
      .then(res => res.json())
      .then(data => {
        setUserCount(data.count || 0);
        setIsLimitedOffer(data.count < 1000);
      });
  }, []);

  const handleSubscribe = async () => {
    if (!currentUser) {
      alert("Veuillez vous connecter pour activer le mode Pro.");
      return;
    }

    setIsLoading(true);
    try {
      // Logic toggle based on user count
      if (isLimitedOffer) {
        const res = await fetch('/api/user/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id })
        });
        
        const data = await res.json();
        
        if (res.ok) {
          window.location.href = '/compte?success=pro_activated';
        } else {
          alert(`Erreur: ${data.error || "L'activation a échoué"}`);
        }
      } else {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id })
        });
        
        const data = await res.json();

        if (res.ok) {
          window.location.href = data.url;
        } else {
          alert(`Erreur Stripe: ${data.error || "Impossible d'ouvrir le paiement"}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur de réseau est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-4 relative overflow-hidden bg-slate-900">
          {/* Abstract backgrounds */}
          <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-glacier rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-slate-400 rounded-full blur-[100px]"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-glacier/10 border border-glacier/20 rounded-full text-glacier text-xs font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Crown className="w-3.5 h-3.5" />
              {isLimitedOffer ? "Offre de Lancement" : "L'expérience Ultime"}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
              Propulsez vos ventes avec <span className="text-glacier">Way Market Pro</span>
            </h1>
            
            {isLimitedOffer && (
              <div className="max-w-md mx-auto mb-10 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="px-6 py-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-glacier text-[10px] font-black uppercase tracking-widest text-shadow-sm shadow-glacier/20 leading-none">
                      Gratuit pour les 1000 premiers
                    </span>
                    <span className="text-white text-sm font-bold leading-none">{userCount} / 1000</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-glacier transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(130,200,255,0.5)]"
                      style={{ width: `${Math.min((userCount / 1000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
              Rejoignez l&apos;élite des vendeurs caucasiens et bénéficiez d&apos;outils exclusifs pour transformer vos annonces en succès immédiats.
            </p>
          </div>
        </section>

        {/* Pricing/Value Card */}
        <section className="-mt-20 px-4 mb-32 relative z-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Main Plan Card */}
            <div className="md:col-span-12 bg-white rounded-[3rem] shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
              <div className="p-8 md:p-14 lg:w-3/5">
                <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Pourquoi passer au Pro ?</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-glacier/10 rounded-2xl flex items-center justify-center shrink-0">
                      <ImageIcon className="w-6 h-6 text-glacier" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">10 Photos HD</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Multipliez les détails de vos biens pour rassurer vos acheteurs.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-glacier/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6 text-glacier" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Badge de Confiance</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Le sceau &quot;Pro&quot; sur votre profil augmente vos chances de vente de 40%.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-glacier/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6 text-glacier" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Visibilité Boostée</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Vos annonces apparaissent en priorité dans les résultats de recherche.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-glacier/10 rounded-2xl flex items-center justify-center shrink-0">
                      <TrendingUp className="w-6 h-6 text-glacier" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Stats Avancées</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">Analysez le nombre de vues et de favoris sur vos annonces.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-8 md:p-14 lg:w-2/5 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100">
                <div className="text-center">
                  <span className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2 block">
                    {isLimitedOffer ? "Offre Spéciale" : "Abonnement Unique"}
                  </span>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">
                      {isLimitedOffer ? "0.00" : "9.99"}
                    </span>
                    <span className="text-2xl font-black text-slate-400">€</span>
                    <span className="text-slate-400 font-bold ml-1">/ mois</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-8 px-6 italic">
                    {isLimitedOffer 
                      ? "Gratuit pour les 1000 premiers membres. Profitez-en !" 
                      : "Annulable à tout moment. Sans engagement longue durée."}
                  </p>
                  
                  <button 
                    onClick={handleSubscribe}
                    disabled={isLoading || isProfileLoading}
                    className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 ${
                      (isLoading || isProfileLoading) ? 'bg-slate-400 cursor-not-allowed' : 'bg-glacier text-white shadow-glacier/25 hover:bg-slate-900 hover:shadow-slate-900/20'
                    }`}
                  >
                    {(isLoading || isProfileLoading) ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>{isProfileLoading ? "Chargement du profil..." : "Activation..."}</span>
                      </>
                    ) : (
                      isLimitedOffer ? "Activer mon offre Pro" : "Passer au Pro maintenant"
                    )}
                  </button>
                  
                  <div className="mt-6 flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Check className="w-3 h-3 text-green-500" />
                      Paiement Sécurisé par Stripe
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Check className="w-3 h-3 text-green-500" />
                      Support prioritaire 24/7
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Context */}
        <section className="max-w-3xl mx-auto px-4 pb-32 text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-12 tracking-tight">Questions Fréquentes</h2>
          <div className="space-y-8 text-left">
            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Comment puis-je résilier ?</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Directement depuis vos paramètres de compte en un clic. Votre statut Pro restera actif jusqu&apos;à la fin de la période facturée.</p>
            </div>
            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Mes anciennes annonces deviennent-elles Pro ?</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Oui ! Dès que vous passez Pro, toutes vos annonces actives bénéficient du badge de confiance et du boost de visibilité.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-white border-t border-slate-100 text-center text-slate-400 text-sm font-medium">
        <p>Way Market © 2026 - Le prestige du commerce caucasien</p>
      </footer>
    </div>
  );
}
