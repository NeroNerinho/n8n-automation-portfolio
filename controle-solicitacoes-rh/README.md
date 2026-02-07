# Controle de Solicitações - RH e Facilities

![Status](https://img.shields.io/badge/Status-Produção-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Orquestrador-n8n-orange?style=for-the-badge)

## Visão Geral

Este projeto organiza e automatiza as solicitações internas da empresa, como pedidos de férias, reembolso, compras de equipamentos, entre outros. Substitui o uso caótico de e-mails e planilhas por um fluxo estruturado.

### O Problema

Pedidos feitos por e-mail se perdiam. Ninguém sabia se o pedido tinha sido aprovado ou em que etapa estava. O RH perdia tempo cobrando gestores para aprovar.

---

## Como Funciona (Analogia Simples)

### Imagine uma Cozinha de Restaurante

Para que o prato chegue certo na mesa:
1.  **O Garçom (Formulário)**: Anota o pedido exatamente como o cliente quer. Nada de "esqueci de perguntar o ponto da carne".
2.  **O Sistema (n8n)**: Leva o pedido para a estação certa na cozinha. Se for salada, vai para a saladeira; se for carne, para a grelha.
3.  **O Chef (Aprovador)**: Confere se está tudo certo antes de liberar.
4.  **Entrega**: O prato chega pronto para o cliente (Solicitante), e ele é avisado.

---

## Detalhes Técnicos

- **Entrada**: Formulários web (Typeform/Google Forms).
- **Processamento**: O n8n recebe a resposta, identifica o tipo de pedido e envia para o aprovador correto (Gestor direto ou Diretor, dependendo do valor).
- **Aprovação**: Feita via botões no e-mail ou Slack ("Aprovar" / "Rejeitar").
- **Conclusão**: Atualiza a planilha de controle e avisa o funcionário.
- **Redução de 75% na Carga do RH**: Elimina a necessidade de follow-ups manuais e entrada repetitiva de dados.
- **Experiência do Colaborador**: Notificações em tempo real mantêm os funcionários informados em cada etapa do processo.

---


> 💡 **Técnica Feynman**: Se você não consegue explicar algo de forma simples, você não entende bem o suficiente.

### Imagine Que...

Você está num **restaurante movimentado**. Quando um cliente faz um pedido:

1. 📝 **Garçom anota** o pedido
2. 🍳 **Cozinha prepara** (com tempo de espera)
3. ✅ **Gerente confere** se está correto
4. 🍽️ **Cliente recebe** o prato

**Este sistema faz o mesmo** — mas para pedidos de RH!

### 🍔 Analogia do Restaurante

| Restaurante | Sistema de RH |
|-------------|---------------|
| Cliente faz pedido | Funcionário pede férias |
| Comanda vai pra cozinha | Formulário vai pro gestor |
| Cozinheiro prepara | Gestor analisa |
| Gerente aprova | RH valida |
| Prato entregue | Férias confirmadas |

### 📧 O Problema do "Buraco Negro" de Emails

**Antes do sistema:**
```
Funcionário: "Pedi férias há 2 semanas, cadê?"
Gestor: "Não vi o email..."
RH: "O gestor não me mandou..."
Funcionário: 😤
```

**Com o sistema:**
```
Funcionário: Abre o painel → vê "Aguardando Gestor"
Gestor: Recebe email com botões → clica "Aprovar"
RH: Recebe automaticamente → clica "Confirmar"
Funcionário: Recebe email → "Férias aprovadas! 🎉"
```

### 🔗 O Que é "Callback Assíncrono"?

Imagine pedir um Uber. Você não fica parado esperando — o app te avisa quando o motorista chegar.

```
┌─────────────────────────────────────────────────────────────┐
│ 1️⃣ FUNCIONÁRIO ENVIA PEDIDO                                │
│    → Sistema registra e para de "pensar"                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2️⃣ EMAIL ENVIADO AO GESTOR                                 │
│    📧 "Você tem 1 pedido para aprovar"                      │
│    [✅ APROVAR]  [❌ REJEITAR]  ← Links únicos              │
└─────────────────────────────────────────────────────────────┘
                          │
            (horas ou dias depois...)
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3️⃣ GESTOR CLICA NO LINK                                    │
│    → Link "acorda" o sistema (callback)                     │
│    → Sistema continua de onde parou                         │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4️⃣ FUNCIONÁRIO NOTIFICADO                                  │
│    📧 "Suas férias foram aprovadas!"                        │
└─────────────────────────────────────────────────────────────┘
```

### 🏢 Níveis de Aprovação

Dependendo do tipo de pedido, mais pessoas precisam aprovar:

| Tipo de Pedido | Quem Aprova |
|----------------|-------------|
| **Férias** | Gestor direto (1 nível) |
| **Equipamento** | Gestor → Financeiro (2 níveis) |
| **Promoção** | Gestor → RH → Diretoria (3 níveis) |

---

##  Arquitetura Técnica

Um workflow orientado a eventos que utiliza lógica de "Aguardar Webhook" para lidar com decisões humanas no processo.

```mermaid
graph TD
    A[Envio do Formulário] --> B[Webhook n8n: Entrada]
    B --> C[Google Sheets: Registrar Estado Inicial]
    C --> D[Lógica: Determinar Fluxo de Aprovação]
    D --> E[SMTP: Enviar E-mail de Aprovação]
    E --> F{Aguardar Resposta}
    F -->|Link Clicado no E-mail| G[Webhook n8n: Callback]
    G --> H[Google Sheets: Atualizar Status Final]
    H --> I[SMTP: Notificar Colaborador]
    I --> J[Sucesso do Processo]
```

### 🛠️ Stack Tecnológica:
- **Motor**: `n8n` (Lógica condicional de múltiplas etapas).
- **Comunicação**: `SMTP` (Templates HTML responsivos) + `Webhooks` (Endpoints de retorno).
- **Camada de Auditoria**: `Google Sheets API` para dashboards em tempo real.
- **Lógica de Roteamento**: Mapeamento hierárquico baseado no tipo de solicitação (ex: Promoções exigem múltiplas aprovações).

---

## 🧠 Detalhes de Engenharia

### 📬 Hub de Callback Assíncrono
O sistema não fica consultando por respostas. Ele gera **links de callback únicos e assinados** embutidos no e-mail do gestor. Ao clicar, esses links ativam o ramo específico no workflow n8n, "acordando" o processo para seguir para a próxima etapa.

### 🗺️ Roteamento Hierárquico Dinâmico
O fluxo mapeia o caminho de aprovação de acordo com a categoria:
- **Férias**: Gestor Direto (1 nível).
- **Equipamentos/Treinamento**: Gestor Direto → Financeiro (2 níveis).
- **Promoções**: Gestor → RH → Diretoria (3 níveis).

### 🎨 Templates com Lógica Embutida
Os templates de e-mail são injetados com dados dinâmicos da solicitação, incluindo justificativas e prazos, garantindo que os aprovadores tenham todo o contexto necessário para decidir sem precisar abrir outros sistemas.

---

## 📈 Benchmarks de Impacto

| Métrica | Processo Manual | Com Automação |
| :--- | :--- | :--- |
| **Tempo de Resolução** | 3 - 7 Dias | **1 - 2 Dias** |
| **Pedidos Perdidos/Esquecidos** | ~8% | **0% (Finalização Forçada)** |
| **Entrada Manual de Dados** | 20 min / pedido | **Zero (Automatizado)** |
| **Visibilidade do Status** | Baixa | **Alta (Painel Online)** |

---

## 🔧 Configuração e Integração

1. **Importação**: Importe o arquivo `Controle de Solicitações - RH.json` no n8n.
2. **Banco de Dados**: Vincule a planilha do Google Sheets onde as colunas correspondam ao esquema definido no workflow.
3. **Callbacks**: Atualize os links `href` nos nós de e-mail para apontarem para o seu endereço de webhook de produção.
4. **Gatilhos**: Conecte seus formulários internos (Google Forms, Typeform ou Portais Customizados) ao webhook de entrada.

---

### 👨‍💻 Desenvolvido por Phillipe (Nero)
> *Desenvolvedor focado em otimização de processos de negócio e fluxos inteligentes.*
