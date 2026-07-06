// Helper central de tracking. Chame trackLead() no momento em que o lead
// é confirmado com sucesso — mantém o disparo de pixel desacoplado do
// resto da lógica de formulário.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

type LeadTrackingData = {
  area?: string;
  unit?: string;
  city?: string;
};

export function trackLead(data: LeadTrackingData = {}) {
  try {
    if (typeof window === "undefined") return;

    // Meta Pixel — evento padrão "Lead", permite otimização de campanha
    // por conversão real no Gerenciador de Anúncios.
    window.fbq?.("track", "Lead", {
      content_name: data.area || "InTech - Formulário",
      content_category: data.unit || undefined,
    });

    // GA4 — evento recomendado "generate_lead"
    window.gtag?.("event", "generate_lead", {
      currency: "BRL",
      area: data.area,
      unit: data.unit,
      city: data.city,
    });
  } catch (error) {
    // Nunca deixar falha de tracking quebrar o fluxo de submit do usuário
    console.warn("[Tracking] Failed to send lead event:", error);
  }
}
