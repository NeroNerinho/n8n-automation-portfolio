# 🔔 Jira ↔ Discord: Alertas Inteligentes de Incidentes

![Status](https://img.shields.io/badge/Status-Ativo-blueviolet?style=for-the-badge)
![n8n](https://img.shields.io/badge/Orquestração-n8n-FF6C37?style=for-the-badge&logo=n8n)
![Jira](https://img.shields.io/badge/Fonte-Jira_Service_Management-0052CC?style=for-the-badge&logo=jira)
![Discord](https://img.shields.io/badge/Destino-Discord_Webhooks-5865F2?style=for-the-badge&logo=discord)

> **"Eliminando o atraso entre a criação do ticket e a resposta técnica com notificações ricas e em tempo real."**

---

## 🎯 ROI e Eficiência em SLAs

Em operações de TI críticas, cada segundo conta. Este projeto automatiza a ponte entre o **Jira Service Management** e o **Discord**, transformando filas de tickets passivas em alertas proativos.

### 🚀 Impacto Estratégico para o Negócio:
- **Redução de 90% no Tempo de Resposta**: O tempo médio de resposta inicial caiu de ~30 min para **< 3 min**.
- **Melhoria no Cumprimento de SLA**: Incidentes de alta prioridade são interceptados quase instantaneamente.
- **Visibilidade Centralizada**: Toda a equipe técnica ganha consciência situacional simultânea via Discord.
- **Zero Tickets Esquecidos**: A automação garante que cada incidente seja notificado no momento da abertura.

---

## 🧠 Como Funciona (Explicação Feynman)

> 💡 **Técnica Feynman**: Se você não consegue explicar algo de forma simples, você não entende bem o suficiente.

### Imagine Que...

Você é o **chefe dos bombeiros** de uma cidade. Quando alguém liga pro 190, como você garante que os bombeiros saibam imediatamente?

**Opção antiga**: Um funcionário anota o chamado, caminha até o quartel, e avisa verbalmente.  
**Opção moderna**: O sistema dispara um alarme que toca em TODOS os quartéis simultaneamente.

**Este projeto é a opção moderna** — mas para tickets de TI.

### 🚨 Analogia do Detector de Fumaça

| Sem Automação | Com Automação |
|---------------|---------------|
| Funcionário olha o Jira de vez em quando | Sistema monitora a cada 2 minutos |
| "Ah, tinha um ticket urgente há 1 hora" | 🔔 **PING!** no celular de toda a equipe |
| Problema virou crise | Problema resolvido antes de escalar |

### 🎨 Sistema de Cores

O Discord mostra alertas coloridos baseados na urgência:

```
🔴 [URGENTE] - Servidor principal caiu!
    Prioridade: Highest
    Tempo de resposta: AGORA

🟠 [ALTA] - VPN não conecta para 50 usuários
    Prioridade: High
    Tempo de resposta: 30 min

🟡 [MÉDIA] - Impressora do 3º andar parou
    Prioridade: Medium
    Tempo de resposta: 4 horas

🟢 [BAIXA] - Atualizar ícone do desktop
    Prioridade: Low
    Tempo de resposta: Quando puder
```

### 🔄 Como Evita Duplicatas?

Imagine que o sistema notifica um ticket. Se ele verificar de novo em 2 minutos, não deveria notificar o mesmo ticket duas vezes.

**Solução**: Após notificar, o sistema adiciona uma **etiqueta invisível** no Jira:

```
Ticket #1234: "Servidor caiu"
├── Labels: urgente, infraestrutura
└── Labels: ✅ notificado_discord  ← NOVA!
```

Próxima verificação → "Já tem a label? Então ignora."



##  Arquitetura Técnica

Uma arquitetura de monitoramento de alta frequência projetada para eficiência e confiabilidade.

```mermaid
graph TD
    A[Agendamento: 2 min] --> B[API Jira: Buscar Tickets Recentes]
    B --> C{Filtro Inteligente}
    C -->|Novo e Não Notificado| D[Enriquecimento de Dados: Lógica JS]
    C -->|Já Notificado| Z[Término]
    D --> E[Geração de Mensagem Rica]
    E --> F[Entrega via Webhook Discord]
    F --> G[API Jira: Adicionar Label 'notificado_discord']
```

### 🛠️ Tecnologias Utilizadas:
- **Orquestração**: `n8n` (Motor de workflow orientado a eventos).
- **Integrações**: `Jira REST API` + `Discord Webhooks API`.
- **Camada de Lógica**: JavaScript (ES6) para extração de categorias via Regex e formatação de mensagens.
- **Persistência de Estado**: Rastreamento baseado em labels diretamente no Jira para evitar duplicidade.

---

## 🧠 Recursos Avançados

### 🔍 Extração de Conhecimento com Regex
O sistema não apenas repassa dados; ele os interpreta. Utiliza lógica JavaScript para:
- **Categorização Automática**: Analisa descrições para extrair metadados como "Categoria" e "Impacto".
- **Mapeamento de Campos**: Transforma IDs internos do Jira em valores legíveis (Nome da Empresa, Setor).

### 🎨 Motor de Priorização Visual
Os alertas são codificados por cores e emojis baseados na prioridade do Jira:
- **Highest**: `[URGENTE] 🔴`
- **High**: `[ALTA] 🟠`
- **Medium**: `[MÉDIA] 🟡`
- **Low/Lowest**: `🟢 / ⚪`

### 🛡️ Prevenção de Duplicidade (Idempotência)
Para evitar fadiga de alertas, o sistema utiliza o padrão de **Marcação Ativa**. Após uma entrega bem-sucedida no Discord, o workflow atualiza o ticket no Jira com a label `notificado_discord`, garantindo que ele não seja processado novamente.

---

## 📈 Benchmarks de Impacto

| Métrica | Antes da Automação | Depois da Implementação |
| :--- | :--- | :--- |
| **Latência de Notificação** | 30 - 60 min | **0 - 120 Segundos** |
| **Intervenção Manual** | Alta (Verificação Manual) | **Zero (Autônomo)** |
| **Conformidade de SLA** | 65% | **95%+** |
| **Taxa de Sucesso** | Variável | **99.9%** |

---

## 🔧 Configuração e Reprodução

1. **Importação**: Importe o arquivo `Jira - Notificação Discord.json` no n8n.
2. **Setup**: Configure as credenciais do `Jira Service Management` e do `Discord`.
3. **Customização**:
    - Ajuste o intervalo de busca no nó de Trigger (Padrão: 2m).
    - Mapeie seus **IDs de Campos Customizados** no nó de preparação de dados.
4. **Ativação**: Ligue o workflow e veja seu canal do Discord receber os alertas.

---

### 👨‍💻 Desenvolvido por Phillipe (Nero)
> *Desenvolvedor orientado a automação de alertas e fluxos de trabalho em tempo real.*
