# Modelo de Prompt para Fluxo de Autenticação com Token e Zona

## Prompt Template para IA

```
Preciso implementar um sistema completo de autenticação para uma aplicação React com as seguintes funcionalidades:

### 1. Gerenciamento de Token e Zona
- Criar serviço para gerenciar token JWT e zona (zn)
- Capturar token e zona dos parâmetros da URL (?token=...&zn=...)
- Armazenar token no localStorage e zona no sessionStorage
- Implementar funções para get/set/clear do token
- Interface para dados do cliente (ID, timezone, usuário, empresas, acessos)

### 2. Configuração de APIs por Zona
- Sistema dinâmico de URLs baseado na zona (zn4, zn5, zn6, etc.)
- Detectar zona da URL do parent/iframe quando possível
- Configurar diferentes endpoints:
  - SERVICE_API: `https://{zona}.m2mcontrol.com.br/service-api`
  - VIAGEM_PLANEJAMENTO_API: ambiente baseado na zona (hmg vs prod)
- Fallback para zona padrão se não detectada

### 3. Interceptador HTTP
- Axios com interceptadores para:
  - Adicionar automaticamente token Bearer no Authorization header
  - Adicionar zona no header Zone
  - Tratar erro 401 (redirect para login e limpeza de dados)
  - Capturar zona do sessionStorage ou localStorage

### 4. Inicialização da Aplicação
- Função assíncrona para inicializar dados do usuário
- Chamada para API `/user/data` após obter token
- Processar resposta para extrair:
  - Dados do cliente (ID, timezone)
  - Dados do usuário (nome, empresas, acessos)
  - Configurações (idioma, chaves como INICIO_DIA_OPERACIONAL)
- Loading state durante inicialização
- Error handling com possibilidade de continuar com dados mock

### 5. Estrutura de Arquivos
```
src/
├── services/
│   ├── localStorage.ts    # Gerenciamento de token/zona/dados
│   └── api.ts            # Configuração axios com interceptadores  
├── constants/
│   └── m2mconfig.ts      # URLs dinâmicas por zona
└── App.tsx               # Inicialização da aplicação
```

### 6. Interfaces TypeScript
- ICliente: dados completos do cliente
- IUserDataResponse: formato da resposta da API /user/data
- Tipagem forte para todas as funções

### 7. Funcionalidades Específicas
- Suporte a parâmetros na URL e no hash (#)
- Compatibilidade com iframe (ancestorOrigins)
- Sistema de fallback para dados offline/mock
- Inicialização condicional (só autentica se token disponível)

Implemente este sistema completo seguindo as melhores práticas de React, TypeScript e arquitetura limpa.
```

## Exemplo de Uso do Prompt

Ao usar este prompt com uma IA, você receberá:

1. **localStorage.ts** - Serviço completo de autenticação
2. **api.ts** - Configuração do Axios com interceptadores
3. **m2mconfig.ts** - Sistema de URLs dinâmicas
4. **App.tsx** - Inicialização com loading e error states
5. **Interfaces TypeScript** - Tipagem completa do sistema

## Customizações Possíveis

### Para diferentes domínios:
```javascript
// Ajustar matcher no m2mconfig.ts
const matcher = origin.match(/sua-zona1|sua-zona2|sua-zona3/) || null;
```

### Para diferentes endpoints:
```javascript 
// Ajustar URLs no ApiPrefix
export const ApiPrefix = {
  YOUR_API: `${HOST}/your-api`,
  ANOTHER_API: `${ANOTHER_HOST}/another-api`
};
```

### Para diferentes dados de usuário:
```typescript
// Ajustar interface no localStorage.ts
interface ICustomUser {
  customField: string;
  anotherField: number[];
}
```

## Fluxo Completo de Execução

1. **URL com parâmetros**: `app.com/?token=abc123&zn=zn4`
2. **Detecção**: App captura token e zona
3. **Configuração**: URLs são configuradas para zn4
4. **Autenticação**: Token é validado via API
5. **Dados**: Informações do usuário são carregadas
6. **Aplicação**: App inicializa com dados completos

Este modelo garante um sistema robusto e reutilizável para qualquer aplicação que precise do mesmo fluxo de autenticação.