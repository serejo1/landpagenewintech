import { Button } from "@/components/ui/button";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { trackLead } from "@/lib/tracking";

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    creative: 0,
    growth: 0,
    business: 0,
    languages: 0,
    enem: 0,
  });
  const [quizState, setQuizState] = useState<"intro" | "content" | "result">(
    "intro"
  );
  const [resultCategory, setResultCategory] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    unit: "",
    area: "Programação & TI",
    course: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const questions = [
    {
      q: "O que mais te atrai em um projeto?",
      options: [
        { text: "Criar algo visualmente incrível e impactante", cat: "creative" },
        {
          text: "Planejar como vender e fazer o negócio crescer",
          cat: "growth",
        },
        {
          text: "Organizar pessoas, processos e gerir recursos",
          cat: "business",
        },
        {
          text: "Aprender uma nova forma de me comunicar globalmente",
          cat: "languages",
        },
        {
          text: "Estudar conteúdos acadêmicos para vencer grandes desafios",
          cat: "enem",
        },
      ],
    },
    {
      q: "Qual dessas ferramentas você tem mais curiosidade de dominar?",
      options: [
        { text: "Photoshop, Figma e ferramentas de Design com IA", cat: "creative" },
        {
          text: "Dashboards de dados, tráfego pago e métricas",
          cat: "growth",
        },
        {
          text: "Sistemas de gestão, liderança e finanças",
          cat: "business",
        },
        {
          text: "Aplicativos de conversação e gramática avançada",
          cat: "languages",
        },
        {
          text: "Técnicas de redação nota 1000 e interpretação",
          cat: "enem",
        },
      ],
    },
    {
      q: "Como você prefere passar seu tempo produtivo?",
      options: [
        {
          text: "Desenhando layouts, marcas e artes digitais",
          cat: "creative",
        },
        {
          text: "Analisando tendências de mercado e comportamento",
          cat: "growth",
        },
        {
          text: "Liderando times e resolvendo problemas operacionais",
          cat: "business",
        },
        {
          text: "Conversando com pessoas de diferentes culturas",
          cat: "languages",
        },
        {
          text: "Revisando matérias e praticando exercícios complexos",
          cat: "enem",
        },
      ],
    },
    {
      q: "Qual desses resultados te daria mais satisfação?",
      options: [
        {
          text: "Ver uma arte minha sendo elogiada e reconhecida",
          cat: "creative",
        },
        {
          text: "Ver os números de vendas de um cliente subirem",
          cat: "growth",
        },
        {
          text: "Ver uma empresa funcionando de forma organizada",
          cat: "business",
        },
        {
          text: "Conseguir manter uma conversa fluida em outro idioma",
          cat: "languages",
        },
        {
          text: "Ver meu nome na lista de aprovados de uma faculdade",
          cat: "enem",
        },
      ],
    },
    {
      q: "Qual ambiente de trabalho mais combina com você?",
      options: [
        {
          text: "Estúdio criativo ou agência de publicidade",
          cat: "creative",
        },
        {
          text: "Escritório de marketing ou consultoria de dados",
          cat: "growth",
        },
        {
          text: "Setor administrativo ou gerência de grandes empresas",
          cat: "business",
        },
        {
          text: "Ambiente internacional ou trabalho remoto global",
          cat: "languages",
        },
        {
          text: "Ambiente acadêmico focado em alto desempenho",
          cat: "enem",
        },
      ],
    },
  ];

  const results = {
    creative: {
      title: "InTech Creative",
      desc: "Você nasceu para criar! Seu perfil é voltado para o visual, a estética e a inovação. Na jornada Creative, você dominará ferramentas de IA para potencializar seu talento artístico.",
      icon: "🎨",
    },
    growth: {
      title: "InTech Growth",
      desc: "Estratégia e resultados correm nas suas veias. Você gosta de entender o 'porquê' das coisas e como otimizar processos para crescer. Marketing e dados são sua praia.",
      icon: "📈",
    },
    business: {
      title: "InTech Business",
      desc: "Liderança e organização são seus pontos fortes. Você tem perfil para gerir negócios, organizar fluxos e liderar pessoas rumo a um objetivo comum.",
      icon: "💼",
    },
    languages: {
      title: "InTech Languages",
      desc: "O mundo é pequeno para você! Seu interesse em comunicação e conexões globais indica que dominar novos idiomas abrirá as portas que você procura.",
      icon: "🌍",
    },
    enem: {
      title: "InTech ENEM",
      desc: "Foco e disciplina definem você. Seu objetivo está claro: vencer os desafios acadêmicos e garantir sua vaga na faculdade com excelência em redação e lógica.",
      icon: "🎓",
    },
  };

  const startQuiz = () => {
    setQuizState("content");
    setCurrentQuestion(0);
    setScores({ creative: 0, growth: 0, business: 0, languages: 0, enem: 0 });
  };

  const selectOption = (cat: string) => {
    const newScores = { ...scores };
    newScores[cat as keyof typeof scores]++;
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      showResult(newScores);
    }
  };

  const showResult = (finalScores: typeof scores) => {
    let winner = Object.keys(finalScores).reduce((a, b) =>
      finalScores[a as keyof typeof finalScores] >
      finalScores[b as keyof typeof finalScores]
        ? a
        : b
    );
    setResultCategory(winner);
    setQuizState("result");
  };

  const resetQuiz = () => {
    setQuizState("intro");
    setCurrentQuestion(0);
    setScores({ creative: 0, growth: 0, business: 0, languages: 0, enem: 0 });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitLeadMutation = trpc.leads.submit.useMutation();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    const attemptSubmit = async (attempt: number = 0): Promise<void> => {
      try {
        const result = await submitLeadMutation.mutateAsync(formData);
        if (result.success) {
          trackLead({
            area: formData.area,
            unit: formData.unit,
            city: formData.city,
          });
          toast.success("Inscrição confirmada com sucesso! Aguarde o contato", {
            duration: 5000,
            position: "top-center",
          });
          setFormData({
            name: "",
            phone: "",
            email: "",
            city: "",
            unit: "",
            area: "Programação & TI",
            course: "",
          });
          setFormSubmitted(true);
          setRetryCount(0);
          setTimeout(() => setFormSubmitted(false), 5000);
        } else {
          setFormError(result.message);
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error submitting form (attempt " + (attempt + 1) + "):", error);
        
        // Retry logic for network errors
        if (attempt < MAX_RETRIES && (error instanceof Error && (error.message.includes("network") || error.message.includes("fetch")))) {
          const nextAttempt = attempt + 1;
          setRetryCount(nextAttempt);
          const delay = Math.pow(2, nextAttempt) * 1000; // Exponential backoff
          toast.loading(`Tentando novamente em ${delay / 1000}s... (Tentativa ${nextAttempt}/${MAX_RETRIES})`);
          setTimeout(() => attemptSubmit(nextAttempt), delay);
          return;
        }
        
        // Distinguish between different types of errors
        let errorMessage = "Erro ao enviar formulário. Tente novamente.";
        if (error instanceof Error) {
          if (error.message.includes("network") || error.message.includes("fetch")) {
            errorMessage = `Erro de conexão após ${attempt + 1} tentativas. Verifique sua internet.`;
          } else if (error.message.includes("validation")) {
            errorMessage = "Dados inválidos. Verifique os campos e tente novamente.";
          } else if (error.message.includes("database")) {
            errorMessage = "Erro ao salvar dados. Tente novamente em alguns momentos.";
          }
        } else {
          errorMessage = "Erro desconhecido. Tente novamente.";
        }
        
        setFormError(errorMessage);
        toast.error(errorMessage);
        setRetryCount(0);
      }
    };
    
    await attemptSubmit();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-cyan-400">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Oficial */}
            <img 
              src="https://i.postimg.cc/s2X30nq2/logo-3d-png-oficial.png" 
              alt="InTech Logo" 
              className="w-12 h-12 object-contain drop-shadow-lg" 
              style={{filter: 'drop-shadow(0 0 10px rgba(0, 217, 255, 0.5))'}}
              loading="lazy"
            />
            <div>
              <span className="font-bold text-lg text-white">InTech</span>
              <span className="text-xs font-light text-gray-400 ml-2">
                CONSTRUA SEU FUTURO.
              </span>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-300">
            <a href="#cursos" className="hover:text-white">
              Cursos
            </a>
            <a href="#teste" className="hover:text-white">
              Teste Vocacional
            </a>
            <a href="#gratuitos" className="hover:text-white">
              Grátis
            </a>
            <a href="#contrata" className="hover:text-white">
              Contrata+
            </a>
            <a href="#bolsas" className="hover:text-white">
              Bolsas
            </a>
            <a href="#depoimentos" className="hover:text-white">
              Depoimentos
            </a>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Quero minha bolsa
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-cyan-400 mb-4">
              ● Formação técnica com propósito
            </p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
              <span>Construímos</span>
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent inline-block">
                Futuros.
              </span>
            </h1>
            {/* Animated Logo Icon */}
            <div className="flex justify-end -mt-32 mb-8">
              <img 
                src="https://i.postimg.cc/s2X30nq2/logo-3d-png-oficial.png" 
                alt="InTech Logo" 
                className="w-56 h-56 object-contain" 
                style={{
                  animation: 'bounce 2s infinite'
                }}
                loading="lazy"
              />
            </div>
            <style>{`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
              }
            `}</style>
            <p className="text-lg text-gray-300 mb-8 max-w-md">
              O futuro não acontece por acaso. Ele é construído através do
              conhecimento, da prática e da coragem de evoluir.
            </p>
            <div className="flex gap-4 mb-8">
              <Button className="bg-gradient-to-r from-cyan-400 to-pink-500 text-black px-8 py-6 text-base font-bold hover:shadow-lg hover:shadow-cyan-400/50">
                Quero minha bolsa
              </Button>
              <Button
                variant="outline"
                className="px-8 py-6 text-base border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
              >
                Conhecer os cursos
              </Button>
            </div>
            
            {/* Full Signup Form in Hero */}
            <div className="relative bg-slate-950 rounded-2xl p-8 shadow-lg border-2 border-cyan-400 max-w-2xl" style={{boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)'}}>
              {/* WhatsApp Floating Icon */}
              <a
                href="https://wa.me/5598999999999?text=Ol%C3%A1%20InTech%2C%20gostaria%20de%20saber%20mais%20sobre%20as%20bolsas%20de%20estudo"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute -right-20 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hidden lg:flex items-center justify-center"
                title="Fale conosco no WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.75 5.404 2.177 7.707l-2.313 8.4a.75.75 0 00.935.935l8.4-2.313a9.87 9.87 0 007.707 2.177c5.45 0 9.797-4.347 9.797-9.797 0-2.615-.997-5.071-2.813-6.931-1.815-1.859-4.287-2.864-6.984-2.864z"/>
                </svg>
              </a>
              <p className="text-lg font-bold text-white mb-6">Comece agora! Preencha seus dados</p>
              {formError && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
                  {formError}
                  {retryCount > 0 && <span> (Tentativa {retryCount})</span>}
                </div>
              )}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nome completo</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Seu nome"
                      required
                      className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Telefone / WhatsApp</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="(00) 00000-0000"
                      required
                      className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">E-mail</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="voce@email.com"
                      required
                      className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Cidade</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      placeholder="Sua cidade"
                      required
                      className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Unidade</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Selecione sua unidade</option>
                      <option value="Castanheira">Castanheira</option>
                      <option value="Belém">Belém</option>
                      <option value="São Luís">São Luís</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Área de interesse</label>
                    <select
                      name="area"
                      value={formData.area}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Programação & TI">Programação & TI</option>
                      <option value="Design Gráfico">Design Gráfico</option>
                      <option value="Marketing Digital">Marketing Digital</option>
                      <option value="Administração">Administração</option>
                      <option value="Inglês">Inglês</option>
                      <option value="ENEM">ENEM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Curso desejado</label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleFormChange}
                    placeholder="Ex: Desenvolvimento Web"
                    className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={submitLeadMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLeadMutation.isPending ? "Enviando..." : "Quero minha bolsa"}
                  </Button>
                  <a
                    href="https://wa.me/5598984393905?text=Ol%C3%A1%20InTech%2C%20gostaria%20de%20falar%20com%20um%20consultor%20sobre%20as%20bolsas%20de%20estudo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.37 1.236-3.356 2.241C3.060 10.378 2.5 11.978 2.5 13.651c0 1.577.411 3.086 1.191 4.407l.963 1.529-1.023 3.736 3.832-1.003c1.259.712 2.747 1.162 4.337 1.162 5.355 0 9.7-4.344 9.7-9.7 0-2.593-.994-5.031-2.803-6.86-1.809-1.829-4.247-2.831-6.84-2.831"/>
                    </svg>
                    Falar com Consultor
                  </a>
                </div>
              </form>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs">
                  ✓
                </div>
                <span className="text-sm font-semibold">
                  Mais de 10 anos formando profissionais
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs">
                  ✓
                </div>
                <span className="text-sm font-semibold">
                  Mais de 1.000 alunos empregados
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs">
                  ✓
                </div>
                <span className="text-sm font-semibold">
                  Programa Contrata+
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs">
                  ✓
                </div>
                <span className="text-sm font-semibold">
                  Parcerias com empresas e Governo do Estado
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-video">
              <img
                src="/hero.jpg"
                alt="Alunos estudando tecnologia"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -top-6 -left-6 bg-black rounded-2xl shadow-lg p-4 max-w-xs">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                80–100%
              </div>
              <div className="text-xs text-gray-300 font-semibold">
                de bolsa disponível
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner 1 */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <img
            src="/banner1.webp"
            alt="Bolsas de Estudo"
            className="w-full rounded-3xl shadow-lg"
            loading="lazy"
          />
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-semibold text-blue-600 mb-4">
              ● Diferenciais
            </p>
            <h2 className="text-4xl font-bold mb-4">Por que escolher a InTech?</h2>
            <p className="text-gray-300">
              Uma formação pensada do primeiro dia ao primeiro emprego.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "◆",
                title: "Ensino baseado em projetos (PBL)",
                desc: "Aprenda fazendo. Projetos reais desde o primeiro módulo.",
              },
              {
                icon: "◇",
                title: "Professores atuantes no mercado",
                desc: "Aprenda com profissionais experientes, que vivem o dia a dia da área.",
              },
              {
                icon: "→",
                title: "Programa Contrata+",
                desc: "Conectamos nossos alunos às oportunidades de emprego e estágio.",
              },
              {
                icon: "✦",
                title: "Parcerias estratégicas",
                desc: "Parcerias com empresas e iniciativas do Governo do Estado.",
              },
              {
                icon: "◐",
                title: "Tecnologia",
                desc: "Laboratórios modernos, ferramentas atuais e Inteligência Artificial.",
              },
              {
                icon: "%",
                title: "Bolsas de estudo",
                desc: "80% – 100% conforme critérios do programa vigente.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-black rounded-2xl p-8 border border-cyan-400 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner 2 */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <img
            src="/banner2.webp"
            alt="InTech & Quero Bolsa"
            className="w-full rounded-3xl shadow-lg"
            loading="lazy"
          />
        </div>
      </section>

      {/* Vocational Test */}
      <section id="teste" className="py-20 px-6 bg-blue-950 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold text-green-400 mb-4">
              ● Descoberta de Carreira
            </p>
            <h2 className="text-4xl font-bold mb-4">Teste Vocacional Gratuito</h2>
            <p className="text-gray-300">
              Não sabe qual curso escolher? Responda 5 perguntas e descubra sua
              trilha ideal na InTech.
            </p>
          </div>

          <div className="bg-black/5 backdrop-blur rounded-3xl border border-white/10 p-12">
            {quizState === "intro" && (
              <div className="text-center">
                <div className="text-6xl mb-6">🚀</div>
                <h3 className="text-3xl font-bold mb-4">Descubra seu Futuro</h3>
                <p className="text-gray-300 mb-8 max-w-md mx-auto">
                  Nosso teste utiliza diretrizes de perfil profissional para
                  conectar você à jornada que mais combina com suas habilidades.
                </p>
                <Button
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-6 text-lg"
                >
                  Começar Teste Agora
                </Button>
              </div>
            )}

            {quizState === "content" && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <span className="font-semibold text-green-400">
                    Pergunta {currentQuestion + 1} de {questions.length}
                  </span>
                  <div className="w-40 h-2 bg-black/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-400 transition-all"
                      style={{
                        width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-8">
                  {questions[currentQuestion].q}
                </h3>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectOption(opt.cat)}
                      className="w-full text-left p-4 rounded-xl bg-black/5 border border-white/10 hover:bg-black/10 hover:border-green-400 transition text-white font-medium"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizState === "result" && (
              <div className="text-center">
                <div className="text-6xl mb-6">
                  {results[resultCategory as keyof typeof results].icon}
                </div>
                <p className="text-sm font-semibold text-green-400 mb-2">
                  Seu perfil ideal é:
                </p>
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {results[resultCategory as keyof typeof results].title}
                </h3>
                <p className="text-gray-300 mb-8 max-w-md mx-auto">
                  {results[resultCategory as keyof typeof results].desc}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-black/10"
                  >
                    Refazer Teste
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    Garantir minha Bolsa
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="cursos" className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-blue-600 mb-4">
              ● Áreas de formação
            </p>
            <h2 className="text-4xl font-bold mb-4">Escolha sua área</h2>
            <p className="text-gray-300">
              Cinco caminhos, um mesmo destino: o mercado de trabalho.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "InTech Languages",
                tags: ["Inglês", "Conversação", "Business", "Certificação"],
                img: "/hero.jpg",
              },
              {
                title: "InTech Creative",
                tags: ["Social Design", "Branding", "IA Criativa", "Figma"],
                img: "/ia.jpg",
              },
              {
                title: "InTech Growth",
                tags: ["Marketing Digital", "Tráfego Pago", "Estratégia", "Dados"],
                img: "/contrata.jpg",
              },
              {
                title: "InTech Business",
                tags: ["Administração", "Gestão com IA", "Finanças", "Liderança"],
                img: "/hero.jpg",
              },
              {
                title: "InTech ENEM",
                tags: ["Redação", "Matemática", "Preparação", "Resultados"],
                img: "/ia.jpg",
              },
            ].map((course, idx) => (
              <div
                key={idx}
                className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={course.img}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {course.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full bg-black/20 border border-white/30 text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Courses */}
      <section id="gratuitos" className="py-20 px-6 bg-blue-950 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-blue-300 mb-4">
              ● Comece sem pagar nada
            </p>
            <h2 className="text-4xl font-bold mb-4">Cursos gratuitos InTech</h2>
            <p className="text-gray-300">
              A porta de entrada. Experimente a metodologia, veja resultado rápido
              e decida sua trilha completa com bolsa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Lógica de Programação",
                desc: "Primeiros passos para pensar como programador.",
                img: "/logica.jpg",
              },
              {
                title: "Canva na Prática",
                desc: "Crie artes profissionais para redes sociais em 1 semana.",
                img: "/canva.jpg",
              },
              {
                title: "ChatGPT no Dia a Dia",
                desc: "Use IA para produzir mais em qualquer área profissional.",
                img: "/ia.jpg",
              },
              {
                title: "Excel Essencial",
                desc: "Planilhas, fórmulas e organização para o mercado de trabalho.",
                img: "/excel.jpg",
              },
            ].map((course, idx) => (
              <div
                key={idx}
                className="bg-black/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={course.img}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Grátis
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2">{course.title}</h3>
                  <p className="text-xs text-gray-300 mb-4">{course.desc}</p>
                  <button className="w-full text-xs font-semibold py-2 rounded-lg bg-black/10 border border-white/20 hover:bg-black/20 transition">
                    Começar grátis
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
            <p className="text-gray-300 max-w-md">
              Cada curso gratuito é uma amostra da trilha completa — ao concluir,
              você recebe uma condição especial de bolsa para continuar na formação
              técnica.
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-6">
              Ver todos os cursos grátis
            </Button>
          </div>
        </div>
      </section>

      {/* Contrata+ Section */}
      <section id="contrata" className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-blue-950 text-white rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-12 items-center">
            <div>
              <p className="text-sm font-semibold text-blue-300 mb-4">
                ● Empregabilidade
              </p>
              <h2 className="text-4xl font-bold mb-6">
                O seu futuro profissional começa antes da formatura.
              </h2>
              <p className="text-gray-300 mb-8">
                O Contrata+ conecta alunos da InTech a empresas parceiras,
                oportunidades de estágio e vagas de emprego, aproximando a
                formação acadêmica do mercado de trabalho.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-bold text-green-400">+1000</div>
                  <div className="text-sm text-gray-300">Alunos empregados</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">10+</div>
                  <div className="text-sm text-gray-300">Anos de atuação</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">Diversas</div>
                  <div className="text-sm text-gray-300">Empresas parceiras</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">Próprio</div>
                  <div className="text-sm text-gray-300">
                    Programa de empregabilidade
                  </div>
                </div>
              </div>
            </div>
            <div className="h-96 rounded-2xl overflow-hidden">
              <img
                src="/contrata.jpg"
                alt="Aluno contratado"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 mb-4">● Jornada</p>
          <h2 className="text-4xl font-bold">Como funciona</h2>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-4">
          {[
            "Escolha seu curso",
            "Faça sua inscrição",
            "Estude com metodologia PBL",
            "Desenvolva projetos reais",
            "Participe do Contrata+",
            "Conquiste sua vaga",
          ].map((step, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold mx-auto mb-4">
                {idx + 1}
              </div>
              <p className="text-sm font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-blue-600 mb-4">
              ● Quem já passou por aqui
            </p>
            <h2 className="text-4xl font-bold">Depoimentos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote:
                  "A metodologia PBL me colocou pra praticar desde a primeira semana. Consegui estágio antes mesmo de terminar o curso.",
                name: "Camila Rocha",
                role: "Dev Front-end · Nexo Sistemas",
                img: "/avatar1.jpg",
              },
              {
                quote:
                  "O Contrata+ foi decisivo. Fiz entrevistas com empresas parceiras direto pela escola e fui contratado em duas semanas.",
                name: "Lucas Prado",
                role: "Analista de TI · GovMA",
                img: "/avatar2.jpg",
              },
              {
                quote:
                  "Comecei sem saber nada de design. Hoje monto minha própria carteira de clientes usando o que aprendi aqui.",
                name: "Ana Beatriz",
                role: "Designer freelancer",
                img: "/avatar3.jpg",
              },
              {
                quote:
                  "A InTech me deu ferramentas práticas e conexões reais. Meu primeiro cliente veio de uma indicação de um professor.",
                name: "João Silva",
                role: "Desenvolvedor Full-stack · Startup",
                img: "/avatar4.jpg",
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-black rounded-2xl p-8 border border-cyan-400">
                <div className="text-yellow-400 mb-4">★★★★★</div>
                <p className="text-gray-200 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.img}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-bold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-300">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-950 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">
            Seu futuro começa aqui.
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Não espere mais. Escolha sua trilha, garanta sua bolsa e comece a
            construir o futuro que você merece.
          </p>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-12 py-8 text-lg">
            Quero minha bolsa agora
          </Button>
        </div>
      </section>

      {/* Quick Signup Section - Bottom */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
        <div className="max-w-2xl mx-auto text-center">
          {/* WhatsApp Floating Icon */}
          <a
            href="https://wa.me/5598999999999?text=Ol%C3%A1%20InTech%2C%20gostaria%20de%20saber%20mais%20sobre%20as%20bolsas%20de%20estudo"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute -right-20 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hidden lg:flex items-center justify-center"
            title="Fale conosco no WhatsApp"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.75 5.404 2.177 7.707l-2.313 8.4a.75.75 0 00.935.935l8.4-2.313a9.87 9.87 0 007.707 2.177c5.45 0 9.797-4.347 9.797-9.797 0-2.615-.997-5.071-2.813-6.931-1.815-1.859-4.287-2.864-6.984-2.864z"/>
            </svg>
          </a>

        </div>
      </section>

      {/* Consultant Form Section */}
      <section id="form" className="py-20 px-6 bg-black">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Fale com um consultor</h2>
            <p className="text-gray-300 mb-2">Vamos encontrar sua bolsa ideal</p>
            <p className="text-sm text-gray-500">
              Preencha os dados abaixo e um consultor da InTech entra em contato para te ajudar a escolher o curso certo.
            </p>
          </div>

          <div className="bg-black rounded-2xl p-8 mb-8">
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                <span className="text-sm font-semibold">Resposta em até 24h</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                <span className="text-sm font-semibold">Sem compromisso</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                <span className="text-sm font-semibold">Simulação de bolsa gratuita</span>
              </div>
            </div>

            {formSubmitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 text-sm font-semibold">
                ✓ Obrigado! Entraremos em contato em breve.
              </div>
            )}

            {formError && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
                {formError}
                {retryCount > 0 && <span> (Tentativa {retryCount})</span>}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nome completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Seu nome"
                  required
                  className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Telefone / WhatsApp</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="(00) 00000-0000"
                  required
                  className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="voce@email.com"
                  required
                  className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Cidade</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleFormChange}
                  placeholder="Sua cidade"
                  required
                  className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Unidade</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Selecione sua unidade</option>
                  <option value="Castanheira">Castanheira</option>
                  <option value="Belém">Belém</option>
                  <option value="São Luís">São Luís</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Área de interesse</label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Programação & TI">Programação & TI</option>
                  <option value="Design Gráfico">Design Gráfico</option>
                  <option value="Marketing Digital">Marketing Digital</option>
                  <option value="Administração">Administração</option>
                  <option value="Inglês">Inglês</option>
                  <option value="ENEM">ENEM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Curso desejado</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleFormChange}
                  placeholder="Ex: Desenvolvimento Web"
                  className="w-full px-4 py-3 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <Button
                type="submit"
                disabled={submitLeadMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLeadMutation.isPending ? "Enviando..." : "Quero falar com um consultor"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-400" />
                <span className="font-bold">InTech</span>
              </div>
              <p className="text-sm text-gray-400">Construa seu futuro.</p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Cursos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Languages
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Creative
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Growth
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Termos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 InTech. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
