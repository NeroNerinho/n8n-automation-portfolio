# RAVENA - Assistente de RH Inteligente (RAG)

![Status](https://img.shields.io/badge/Status-Produção-blue?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Gemini_1.5_Pro-orange?style=for-the-badge)
![Vector](https://img.shields.io/badge/Vector_DB-Pinecone-green?style=for-the-badge)

## Visão Geral

A **RAVENA** é um chatbot de Inteligência Artificial que reduz a carga operacional do departamento de RH. Ela utiliza a tecnologia RAG (Retrieval-Augmented Generation) para ler manuais e responder perguntas dos funcionários com base na documentação oficial.

### O Problema

O RH passava 60% do tempo respondendo perguntas recorrentes e simples, como:
- "Como acesso meu holerite?"
- "Qual o valor do vale alimentação?"
- "Como funciona o plano de saúde?"

---

## Como Funciona (Analogia Simples)

### Imagine uma Bibliotecária

Imagine que a empresa tem uma biblioteca com todas as regras e políticas.
- **Sem RAVENA**: O funcionário entra, fica perdido procurando o livro certo, ou pergunta para a bibliotecária (que está ocupada).
- **Com RAVENA**: A bibliotecária leu e decorou todos os livros. Quando você faz uma pergunta, ela busca na memória e te dá a resposta exata, na hora, citando a fonte.

---

## Detalhes Técnicos (RAG)

O sistema não "alucina" respostas, pois ele é obrigado a consultar a base de conhecimento antes de responder.

1.  **Ingestão**: Documentos (PDFs) são transformados em vetores numéricos e salvos no Pinecone.
2.  **Busca**: Quando o usuário pergunta, o sistema busca os parágrafos mais parecidos no banco vetorial.
3.  **Resposta**: O Google Gemini recebe a pergunta + os parágrafos encontrados e formula a resposta.

### Stack Tecnológico

- **Orquestração**: n8n.
- **LLM**: Google Gemini 1.5 Pro.
- **Banco Vetorial**: Pinecone.
- **Frontend**: WhatsApp/Teams.
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2️⃣ AUGMENTED: Gemini recebe contexto                       │
│    "Leia estes trechos e responda a pergunta..."            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3️⃣ GENERATION: Resposta natural                            │
│    "Segundo o manual, você tem direito a 30 dias após       │
│     12 meses de trabalho. A partir do 5º ano..."            │
└─────────────────────────────────────────────────────────────┘
```

### 🏥 Analogia do Hospital

Imagine um hospital com 500 médicos. Cada um recebe as mesmas perguntas básicas todo dia:
- "Posso comer antes do exame?"
- "Preciso de encaminhamento?"
- "Quanto tempo demora o resultado?"

**Sem RAVENA**: Médico para, responde, perde 5 minutos × 500 médicos × 10 perguntas/dia = **desperdício massivo**

**Com RAVENA**: Um assistente virtual responde 90% das perguntas. Médico só atende casos complexos.

### 🔐 Por Que "Pinecone"?

Pinecone é um **banco de dados vetorial**. Diferente de bancos tradicionais:

| Banco Tradicional | Pinecone (Vetorial) |
|-------------------|---------------------|
| Busca por palavras exatas | Busca por **significado** |
| "férias" só acha "férias" | "folga anual" também acha "férias" |
| Como índice de livro | Como bibliotecário humano |



---

##  Arquitetura Técnica

Este projeto demonstra uma stack de automação moderna combinando LLMs de alta performance com busca vetorial precisa.

```mermaid
graph TD
    A[Colaborador / Google Chat] -->|Webhook| B(Orquestrador n8n)
    B --> C{Lógica de Decisão}
    C -->|Caminho RAG| D[Pinecone Vector Store]
    D -->|Contexto| E[Google Gemini 1.5 Flash]
    E -->|Resposta Natural| B
    B -->|Resposta| A
    B -->|Log de Auditoria| F[Google Sheets]
    B -->|Memória| G[Window Buffer Memory]
```

### 🛠️ Tecnologias Utilizadas:
- **Orquestração**: `n8n` (Motor de workflow v1.x).
- **Inteligência**: `Google Gemini 1.5 Flash` (Raciocínio de alta velocidade).
- **Busca Vetorial**: `Pinecone` (Recuperação semântica de conhecimento).
- **Memória**: `Window Buffer Memory` (Mantém o contexto da conversa).
- **Dados**: `Google Drive` (Ingestão automatizada de PDFs).
- **Persistência**: `Google Sheets` (Logs de auditoria e Analytics).

---

## 🧠 Recursos Avançados e Engenharia de Persona

### 🎭 Persona RAVENA: Acolhedora e Profissional
A RAVENA foi configurada com uma persona específica:
- **Consciência Temporal**: Saudações baseadas no horário (Bom dia/Boa tarde) e avisos sobre disponibilidade fora do horário comercial.
- **Personalização**: Uso de variáveis dinâmicas como `firstName` para um atendimento humanizado.
- **Resiliência**: Em caso de falta de informação na base, direciona o colaborador para os contatos humanos responsáveis.

### 🛡️ Segurança e Privacidade
- **Sanitização de Dados**: Todas as perguntas são limpas de caracteres especiais perigosos.
- **Logs de Auditoria**: Cada interação é registrada com timestamp, tópicos detectados e status de sucesso.

---

## 🛠️ Detalhes da Implementação

### Estratégia de Prompt
A inteligência central reside no nó **Montar Prompt**, que constrói mensagens do sistema incorporando instruções de tom de voz, fontes de informação e restrições de formatação.

### Ingestão no Vector Store
O sistema baixa automaticamente o manual de RH do Google Drive, divide o texto em partes (chunks) usando um `Recursive Character Text Splitter` e envia para o Pinecone para permitir buscas rápidas por significado, não apenas palavras-chave.

---

## 📈 Métricas de Performance

| Métrica | Meta | Resultado |
| :--- | :--- | :--- |
| **Tempo de Resposta** | < 2s | ~1.4s (Otimizado com Flash) |
| **Precisão de Conhecimento** | > 95% | Aumentada via RAG |
| **Disponibilidade** | 24/7 | 99.9% de uptime via n8n |

---

## 🔧 Configuração e Reprodução

1. **Importação**: Importe o arquivo `Chat bot - RH.json` no seu n8n.
2. **Credenciais**: Configure as credenciais para `Google Gemini` e `Pinecone`.
3. **Pinecone**: Crie um índice chamado `rh-manual-knowledge`.
4. **Fonte de Dados**: Atualize o ID do arquivo no nó do Google Drive para o seu manual de RH.
5. **Logs**: Conecte sua conta do Google Sheets para registrar as interações.

---

### 👨‍💻 Desenvolvido por Phillipe (Nero)
> *Desenvolvedor orientado a automação de processos e fluxos inteligentes.*
