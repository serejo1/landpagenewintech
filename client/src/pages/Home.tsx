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
  const [quizState, setQuizState] = useState<"intro" | "content" | "result">("intro");
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
    creative: { title: "InTech Creative", desc: "Você nasceu para criar! Seu perfil é voltado para o visual, a estética e a inovação.", icon: "🎨" },
    growth: { title: "InTech Growth", desc: "Estratégia e resultados correm nas suas veias. Marketing e dados são sua praia.", icon: "📈" },
    business: { title: "InTech Business", desc: "Liderança e organização são seus pontos fortes. Você tem perfil para gerir negócios.", icon: "💼" },
    languages: { title: "InTech Languages", desc: "O mundo é pequeno para você! Dominar novos idiomas abrirá as portas que você procura.", icon: "🌍" },
    enem: { title: "InTech ENEM", desc: "Foco e disciplina definem você. Seu objetivo está claro: vencer os desafios acadêmicos.", icon: "🎓" },
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
      finalScores[a as keyof typeof finalScores] > finalScores[b as keyof typeof finalScores] ? a : b
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
      trackLead({ area: formData.area, unit: formData.unit, city: formData.city });
      toast.success("Inscrição confirmada com sucesso! Aguarde o contato", { duration: 5000, position: "top-center" });
      setFormData({ name: "", phone: "", email: "", city: "", unit: "", area: "Programação & TI", course: "" });
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
            <img src="https://i.postimg.cc/s2X30nq2/logo-3d-png-oficial.png" alt="InTech Logo" className="w-12 h-12 object-contain" style={{ filter: "drop-shadow(0 0 10px rgba(0, 217, 255, 0.5))" }} loading="lazy" />
            <div>
              <span className="font-bold text-lg text-white">InTech</span>
              <span className="text-xs font-light text-gray-400 ml-2">CONSTRUA SEU FUTURO.</span>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-300">
            <a href="#cursos" className="hover:text-white">Cursos</a>
            <a href="#teste" className="hover:text-white">Teste Vocacional</a>
            <a href="#form" className="hover:text-white">Bolsas</a>
            <a href="#depoimentos" className="hover:text-white">Depoimentos</a>
          </div>
          <a href="#form"><Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Quero minha bolsa</Button></a>
        </nav>
      </header>
          {/* Hero + Formulário Principal */}
      <section className="relative overflow-hidden py-20 px-6 bg-black">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-cyan-400 mb-4">● Formação técnica com propósito</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
            <span>Construímos </span>
            <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Futuros.</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            O futuro não acontece por acaso. Ele é construído através do conhecimento, da prática e da coragem de evoluir.
          </p>
        </div>
      </section>

      {/* Formulário de Inscrição */}
      <section id="form" className="py-20 px-6 bg-black">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Garanta sua bolsa</h2>
            <p className="text-gray-300 mb-2">Preencha seus dados e um consultor entra em contato</p>
          </div>
          <div className="bg-slate-950 rounded-2xl p-8 border-2 border-cyan-400" style={{ boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)" }}>
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
                <Button type="submit" disabled={isSending} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 font-semibold disabled:opacity-50">
                  {isSending ? "Enviando..." : "Quero minha bolsa"}
                </Button>
                <a href="https://wa.me/5598984393905?text=Ol%C3%A1%20InTech%2C%20gostaria%20de%20falar%20com%20um%20consultor" target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 font-semibold rounded-lg flex items-center justify-center">
                  Falar com Consultor
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Teste Vocacional */}
      <section id="teste" className="py-20 px-6 bg-blue-950 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold text-green-400 mb-4">● Descoberta de Carreira</p>
            <h2 className="text-4xl font-bold mb-4">Teste Vocacional Gratuito</h2>
            <p className="text-gray-300">Responda 5 perguntas e descubra sua trilha ideal.</p>
          </div>
          <div className="bg-black/5 backdrop-blur rounded-3xl border border-white/10 p-12">
            {quizState === "intro" && (
              <div className="text-center">
                <div className="text-6xl mb-6">🚀</div>
                <h3 className="text-3xl font-bold mb-4">Descubra seu Futuro</h3>
                <p className="text-gray-300 mb-8">Conecte-se à jornada que mais combina com você.</p>
                <Button onClick={startQuiz} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-6 text-lg">Começar Teste Agora</Button>
              </div>
            )}
            {quizState === "content" && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <span className="font-semibold text-green-400">Pergunta {currentQuestion + 1} de {questions.length}</span>
                  <div className="w-40 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 transition-all" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-8">{questions[currentQuestion].q}</h3>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((opt, idx) => (
                    <button key={idx} onClick={() => selectOption(opt.cat)} className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-400 transition text-white font-medium">
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {quizState === "result" && (
              <div className="text-center">
                <div className="text-6xl mb-6">{results[resultCategory as keyof typeof results].icon}</div>
                <p className="text-sm font-semibold text-green-400 mb-2">Seu perfil ideal é:</p>
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{results[resultCategory as keyof typeof results].title}</h3>
                <p className="text-gray-300 mb-8">{results[resultCategory as keyof typeof results].desc}</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={resetQuiz} variant="outline" className="border-white/20 text-white hover:bg-white/10">Refazer Teste</Button>
                  <a href="#form"><Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">Garantir minha Bolsa</Button></a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cursos */}
      <section id="cursos" className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-blue-600 mb-4">● Áreas de formação</p>
            <h2 className="text-4xl font-bold mb-4 text-white">Escolha sua área</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "InTech Languages", tags: ["Inglês", "Conversação", "Certificação"] },
              { title: "InTech Creative", tags: ["Design", "Branding", "IA Criativa"] },
              { title: "InTech Growth", tags: ["Marketing", "Tráfego Pago", "Dados"] },
              { title: "InTech Business", tags: ["Administração", "Finanças", "Liderança"] },
              { title: "InTech ENEM", tags: ["Redação", "Matemática", "Resultados"] },
            ].map((course, idx) => (
              <div key={idx} className="rounded-2xl p-6 border border-cyan-400 bg-black hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-white mb-3">{course.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full border border-cyan-400 text-cyan-400">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-blue-600 mb-4">● Quem já passou por aqui</p>
            <h2 className="text-4xl font-bold text-white">Depoimentos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { quote: "A metodologia PBL me colocou pra praticar desde a primeira semana.", name: "Camila Rocha", role: "Dev Front-end" },
              { quote: "O Contrata+ foi decisivo. Fui contratado em duas semanas.", name: "Lucas Prado", role: "Analista de TI" },
              { quote: "Comecei sem saber nada de design. Hoje tenho meus próprios clientes.", name: "Ana Beatriz", role: "Designer freelancer" },
              { quote: "A InTech me deu ferramentas práticas e conexões reais.", name: "João Silva", role: "Desenvolvedor Full-stack" },
            ].map((t, idx) => (
              <div key={idx} className="bg-black rounded-2xl p-8 border border-cyan-400">
                <div className="text-yellow-400 mb-4">★★★★★</div>
                <p className="text-gray-200 mb-6">"{t.quote}"</p>
                <div className="font-bold text-sm text-white">{t.name}</div>
                <div className="text-xs text-gray-400">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-blue-950 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">Seu futuro começa aqui.</h2>
          <p className="text-xl text-gray-300 mb-8">Escolha sua trilha, garanta sua bolsa e construa o futuro que você merece.</p>
          <a href="#form"><Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-12 py-8 text-lg">Quero minha bolsa agora</Button></a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-400 border-t border-white/10 pt-8">
          <p>© 2026 InTech. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
