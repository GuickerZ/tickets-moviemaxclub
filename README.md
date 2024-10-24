# 🎟️ Automação de Cadastro para Ingressos de Cinema Grátis

Este projeto realiza a automação de cadastros de usuários em massa em um site de cinema, permitindo a obtenção de ingressos gratuitos a cada 10 cadastros. Utilizando o Playwright, o script preenche os dados de registro automaticamente e aguarda a confirmação por e-mail para validar o cadastro.

## 🚀 Funcionalidades:
- **Geração automática de e-mails temporários** via 1secmail
- **Preenchimento automatizado de formulários de cadastro** usando dados falsos gerados pela API do 4devs
- **Verificação de e-mails recebidos** e extração automática de links de ativação
- **Navegação e automação de processos** utilizando Playwright

## 📧 Fluxo de Operação:
1. **Geração de e-mail temporário**: Um e-mail temporário é gerado para cada novo cadastro.
2. **Preenchimento de formulário**: O script preenche automaticamente o formulário de cadastro com dados falsos.
3. **Verificação de e-mails**: Após o envio do formulário, o script aguarda a chegada de um e-mail de confirmação.
4. **Ativação da conta**: O link de ativação é extraído do e-mail e acessado automaticamente pelo script.

## 🔧 Como Usar:
1. Clone este repositório:
   ```git clone https://github.com/seu-usuario/seu-repositorio.git```
   ```cd seu-repositorio```
2. Instale as dependências:
  ```npm install```
3. Execute o script:
  ```node index.js```
