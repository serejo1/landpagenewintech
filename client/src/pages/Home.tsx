import { Button } from "@/components/ui/button";
import { useState } from "react";
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
  const [isSending, setIsSending] = useState(false);

  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz66u_39hy4JuBJPS72uv0CVdKAigTPIR0a4grXDaSGw0RJ2ULaJ8TcSxyBsza576wC-g/exec";

  const questions = [
    {
      q: "O que mais te atrai em um projeto?",
      options: [
        { text: "Criar algo visualmente incrível e impactante", cat: "creative" },
        { text: "Planejar como vender e fazer o negócio crescer", cat: "growth" },
        { text: "Organizar pessoas, processos e gerir recursos", cat: "business" },
        { text: "Aprender uma nova forma de me comunicar globalmente", cat: "languages" },
        { text: "Estudar conteúdos acadêmicos para vencer grandes desafios", cat: "enem" },
      ],
    },
    {
      q: "Qual dessas ferramentas você tem mais curiosidade de dominar?",
      options: [
        { text: "Photoshop, Figma e ferramentas de Design com IA", cat: "creative" },
        { text: "Dashboards de dados, tráfego pago e métricas", cat: "growth" },
        { text: "Sistemas de gestão, liderança e finanças", cat: "business" },
        { text: "Aplicativos de conversação e gramática avançada", cat: "languages" },
        { text: "Técnicas de redação nota 1000 e interpretação", cat: "enem" },
      ],
    },
    {
      q: "Como você prefere passar seu tempo produtivo?",
      options: [
        { text: "Desenhando layouts, marcas e artes digitais", cat: "creative" },
        { text: "Analisando tendências de mercado e comportamento", cat: "growth" },
        { text: "Liderando times e resolvendo problemas operacionais", cat: "business" },
        { text: "Conversando com pessoas de diferentes culturas", cat: "languages" },
        { text: "Revisando matérias e praticando exercícios complexos", cat: "enem" },
      ],
    },
    {
      q: "Qual desses resultados te daria mais satisfação?",
      options: [
        { text: "Ver uma arte minha sendo elogiada e reconhecida", cat: "creative" },
        { text: "Ver os números de vendas de um cliente subirem", cat: "growth" },
        { text: "Ver uma empresa funcionando de forma organizada", cat: "business" },
        { text: "Conseguir manter uma conversa fluida em outro idioma", cat: "languages" },
        { text: "Ver meu nome na lista de aprovados de uma faculdade", cat: "enem" },
      ],
    },
    {
      q: "Qual ambiente de trabalho mais combina com você?",
      options: [
        { text: "Estúdio criativo ou agência de publicidade", cat: "creative" },
        { text: "Escritório de marketing ou consultoria de dados", cat: "growth" },
        { text: "Setor administrativo ou gerência de grandes empresas", cat: "business" },
        { text: "Ambiente internacional ou trabalho remoto global", cat: "languages" },
        { text: "Ambiente acadêmico focado em alto desempenho", cat: "enem" },
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

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSending(true);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

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
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      console.error("Erro ao enviar:", error);
      setFormError("Erro ao enviar formulário. Tente novamente.");
      toast.error("Erro ao enviar formulário. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-cyan-400">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://i.postimg.cc/s2X30nq2/logo-3d-png-oficial.png"
              alt="InTech Logo"
              className="w-12 h-12 object-contain drop-shadow-lg"
              style={{ filter: "drop-shadow(0 0 10px rgba(0, 217, 255, 0.5))" }}
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
            <a href="#cursos" className="hover:text-white">Cursos</a>
            <a href="#teste" className="hover:text-white">Teste Vocacional</a>
            <a href="#gratuitos" className="hover:text-white">Grátis</a>
            <a href="#contrata" className="hover:text-white">Contrata+</a>
            <a href="#form" className="hover:text-white">Bolsas</a>
            <a href="#depoimentos" className="hover:text-white">Depoimentos</a>
          </div>
          <a href="#form">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Quero minha bolsa
            </Button>
          </a>
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
              <span>Construímos </span>
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent inline-block">
                Futuros.
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-md">
              O futuro não acontece por acaso. Ele é construído através do
              conhecimento, da prática e da coragem de evoluir.
            </p>
            <div className="flex gap-4 mb-8">
              <a href="#form">
                <Button className="bg-gradient-to-r from-cyan-400 to-pink-500 text-black px-8 py-6 text-base font-bold hover:shadow-lg hover:shadow-cyan-400/50">
                  Quero minha bolsa
                </Button>
              </a>
              <a href="#cursos">
                <Button
                  variant="outline"
                  className="px-8 py-6 text-base border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                >
                  Conhecer os cursos
                </Button>
              </a>
            </div>

            {/* Full Signup Form in Hero */}
            <div className="relative bg-slate-950 rounded-2xl p-8 shadow-lg border-2 border-cyan-400 max-w-2xl" style={{ boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)" }}>
              <p className="text-lg font-bold text-white mb-6">Comece agora! Preencha seus dados</p>
              {formError && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
                  {formError}
                </div>
              )}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">Nome completo</label>
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Seu nome" required className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">Telefone / WhatsApp</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="(00) 00000-0000" required className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">E-mail</label>
                    <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="voce@email.com" required className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">Cidade</label>
                    <input type="text" name="city" value={formData.city} onChange={handleFormChange} placeholder="Sua cidade" required className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">Unidade</label>
                    <select name="unit" value={formData.unit} onChange={handleFormChange} required className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600">
                      <option value="">Selecione sua unidade</option>
                      <option value="Castanheira">Castanheira</option>
                      <option value="Belém">Belém</option>
                      <option value="São Luís">São Luís</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">Área de interesse</label>
                    <select name="area" value={formData.area} onChange={handleFormChange} className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600">
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
                  <label className="block text-sm font-semibold mb-2 text-white">Curso desejado</label>
                  <input type="text" name="course" value={formData.course} onChange={handleFormChange} placeholder="Ex: Desenvolvimento Web" className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={isSending} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSending ? "Enviando..." : "Quero minha bolsa"}
                  </Button>
                  <a href="https://wa.me/5598984393905?text=Ol%C3%A1%20InTech%2C%20gostaria%20de%20falar%20com%20um%20consultor" target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                    Falar com Consultor
                  </a>
                </div>
              </form>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-video">
              <img src="/hero.jpg" alt="Alunos estudando tecnologia" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -top-6 -left-6 bg-black rounded-2xl shadow-lg p-4 max-w-xs">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">80–100%</div>
              <div className="text-xs text-gray-300 font-semibold">de bolsa disponível</div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultant Form Section */}
      <section id="form" className="py-20 px-6 bg-black">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Fale com um consultor</h2>
            <p className="text-gray-300 mb-2">Vamos encontrar sua bolsa ideal</p>
          </div>
          <div className="bg-slate-950 rounded-2xl p-8 mb-8 border border-cyan-400">
            {formSubmitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 text-sm font-semibold">
                ✓ Obrigado! Entraremos em contato em breve.
              </div>
            )}
            {formError && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
                {formError}
              </div>
            )}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Nome completo</label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Seu nome" required className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Telefone / WhatsApp</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="(00) 00000-0000" required className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">E-mail</label>
                <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="voce@email.com" required className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Cidade</label>
                <input type="text" name="city" value={formData.city} onChange={handleFormChange} placeholder="Sua cidade" required className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Unidade</label>
                <select name="unit" value={formData.unit} onChange={handleFormChange} required className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option value="">Selecione sua unidade</option>
                  <option value="Castanheira">Castanheira</option>
                  <option value="Belém">Belém</option>
                  <option value="São Luís">São Luís</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Área de interesse</label>
                <select name="area" value={formData.area} onChange={handleFormChange} className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option value="Programação & TI">Programação & TI</option>
                  <option value="Design Gráfico">Design Gráfico</option>
                  <option value="Marketing Digital">Marketing Digital</option>
                  <option value="Administração">Administração</option>
                  <option value="Inglês">Inglês</option>
                  <option value="ENEM">ENEM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Curso desejado</label>
                <input type="text" name="course" value={formData.course} onChange={handleFormChange} placeholder="Ex: Desenvolvimento Web" className="w-full px-4 py-3 border border-cyan-400 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <Button type="submit" disabled={isSending} className="w-full bg
