# InTech Landing Page - TODO

## Fase 1: Estrutura Base e Design
- [x] Criar projeto com React 19 + Tailwind CSS 4
- [x] Implementar tema neon/black futurista
- [x] Criar header com logo e navegação
- [x] Implementar hero section com CTA
- [x] Adicionar imagens e banners

## Fase 2: Conteúdo e Seções
- [x] Implementar seção "Por que escolher a InTech?"
- [x] Criar seção de cursos (5 áreas)
- [x] Adicionar seção de cursos gratuitos
- [x] Implementar seção Contrata+
- [x] Criar timeline "Como funciona"
- [x] Adicionar seção de depoimentos
- [x] Implementar CTA final

## Fase 3: Teste Vocacional
- [x] Criar componente de teste vocacional interativo
- [x] Implementar 5 perguntas com categorias
- [x] Adicionar lógica de scoring
- [x] Criar tela de resultados com recomendações

## Fase 4: Captura de Leads
- [x] Criar formulário de captura no Hero (7 campos)
- [x] Adicionar formulário de consultor
- [x] Implementar ícones flutuantes do WhatsApp
- [x] Adicionar validação de formulários

## Fase 5: Banco de Dados e Backend
- [x] Adicionar feature web-db-user ao projeto
- [x] Criar schema de banco de dados (tabela leads)
- [x] Gerar e aplicar migrações Drizzle
- [x] Criar helpers de banco de dados (createLead, getAllLeads)
- [x] Implementar procedures tRPC para leads

## Fase 6: Integração Frontend-Backend
- [x] Adicionar imports de tRPC no Home.tsx
- [x] Criar mutation tRPC para submissão de leads
- [x] Atualizar handleFormSubmit para usar tRPC
- [x] Implementar toast notifications para feedback
- [x] Testar fluxo completo de submissão

## Fase 7: Testes
- [x] Criar testes vitest para auth.logout
- [x] Criar testes vitest para leads.submit
- [x] Testar validação de campos
- [x] Testar campos opcionais
- [x] Testar listagem de leads

## Fase 8: Otimizações e Deploy
- [x] Adicionar loading states nos botões
- [x] Implementar retry logic para submissão de leads com estados de erro persistentes
- [x] Aplicar lazy loading e responsive sizing (srcSet) em TODAS as imagens da landing page
- [x] Testar responsividade em 375px, 768px, 1024px e documentar correções
- [x] Criar checkpoint final
- [x] Publicar projeto

## Testes de Responsividade
- Desktop (1280x720): ✓ Layout completo com navegação horizontal
- Tablet (768x1024): ✓ Navegação compactada, formulário em 2 colunas
- Mobile (375x812): ✓ Navegação mobile, formulário em 1 coluna, botões full-width
- Desktop 1024x768: ✓ Layout intermediário com navegação completa

## Notas
- Projeto usa MySQL via Manus WebDev infrastructure
- Todas as imagens estão hospedadas em postimg.cc
- Paleta de cores: Neon (cyan #00D9FF, pink #FF006E, verde #00FF41)
- Fundo: Preto (#000000)
- Cards: #0A0E27 com bordas cyan
- Retry logic: Exponential backoff com máximo de 3 tentativas para erros de rede
- Lazy loading: Implementado em todas as imagens da landing page
- Error handling: Estados distintos para erros de conexão, validação e banco de dados

## Fase 9: Integração com Google Sheets
- [x] Criar planilha Google Sheets para receber leads
- [x] Configurar Google Apps Script com webhook
- [x] Implementar função para enviar dados dos leads para Google Sheets
- [x] Integrar webhook do Google Sheets no backend
- [x] Atualizar procedure tRPC para enviar dados para Sheets
- [x] Testar fluxo completo: formulário → Sheets
- [x] Criar checkpoint com integração ativa

## Fase 10: Confirmacao de Inscricao
- [x] Adicionar mensagem de sucesso "Inscricao confirmada com sucesso! Aguarde o contato"
- [x] Configurar toast com duracao de 5 segundos
- [x] Limpar formulario apos envio
- [x] Testar feedback visual

## Fase 11: Integracao com WhatsApp
- [x] Adicionar botao "Falar com Consultor" no formulario
- [x] Configurar link do WhatsApp com numero +55 98 98439-3905
- [x] Adicionar mensagem pre-preenchida no WhatsApp
- [x] Testar fluxo de clique no botao
