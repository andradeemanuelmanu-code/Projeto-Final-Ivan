# Regras para Desenvolvimento com IA

Este documento estabelece as diretrizes e a stack de tecnologia para o desenvolvimento desta aplicação, garantindo consistência e manutenibilidade.

## Stack de Tecnologia do Projeto

A aplicação é construída com as seguintes tecnologias:

-   **Framework/Biblioteca:** React com TypeScript para a construção da interface do usuário.
-   **Ferramenta de Build:** Vite para uma experiência de desenvolvimento rápida e moderna.
-   **Roteamento:** React Router para gerenciar toda a navegação do lado do cliente e as rotas das páginas.
-   **Estilização:** Tailwind CSS para toda a estilização baseada em classes de utilitários.
-   **Biblioteca de Componentes:** shadcn/ui é a fonte principal para componentes de UI como botões, cards, diálogos e inputs.
-   **Ícones:** Lucide React é a biblioteca exclusiva para todos os ícones.
-   **Persistência de Dados:** Todos os dados da aplicação são armazenados no Local Storage do navegador, gerenciados por meio de camadas de abstração encontradas no diretório `src/lib` (ex: `eventosStorage.ts`, `custosStorage.ts`).
-   **Manipulação de Datas:** `date-fns` é usada para todas as manipulações de data e hora, com um utilitário específico `parseLocalDate` em `src/lib/utils.ts` para evitar problemas de fuso horário.
-   **Gráficos:** Recharts é usada para criar gráficos e visualizações de dados, como visto na página Financeiro.

## Regras e Diretrizes de Desenvolvimento

Para manter a consistência do código, siga as seguintes regras:

1.  **Uso de Componentes:**
    -   Sempre priorize o uso de componentes da biblioteca `shadcn/ui`.
    -   Se um componente `shadcn/ui` precisar de modificações significativas, crie um novo componente personalizado no diretório `src/components/` em vez de editar os arquivos base da biblioteca.
    -   Estruture novos componentes de forma lógica em subdiretórios de `src/components/` com base em sua área de funcionalidade (ex: `src/components/eventos/`, `src/components/financeiro/`).

2.  **Estilização:**
    -   Use as classes de utilitários do Tailwind CSS para toda a estilização. Evite escrever arquivos CSS personalizados.
    -   Os estilos globais e as variáveis do sistema de design (cores, fontes, etc.) são definidos em `src/index.css`. Modifique este arquivo apenas para atualizar o sistema de design principal.

3.  **Roteamento e Páginas:**
    -   Todas as rotas da aplicação devem ser definidas em `src/App.tsx`.
    -   Cada rota deve corresponder a um componente de página localizado no diretório `src/pages/`.

4.  **Gerenciamento de Dados:**
    -   A aplicação é totalmente do lado do cliente (client-side). Todos os dados são gerenciados através dos módulos auxiliares no diretório `src/lib/` (ex: `eventosStorage.ts`, `custosStorage.ts`, `equipeStorage.ts`).
    -   Nunca interaja com o `localStorage` diretamente nos componentes. Sempre use os módulos de armazenamento fornecidos para garantir a consistência dos dados.
    -   Não há backend ou banco de dados. Não tente fazer chamadas de API para serviços externos, a menos que uma nova integração (como o Supabase) seja adicionada.

5.  **Ícones:**
    -   Use apenas ícones do pacote `lucide-react`. Isso mantém um estilo visual consistente.

6.  **Tipos:**
    -   Defina todos os tipos personalizados do TypeScript no diretório `src/types/`. Crie um arquivo separado para cada modelo de dados (ex: `evento.ts`, `equipe.ts`).