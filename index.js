const { chromium } = require('playwright');
const axios = require('axios');
const _4devs = require('@killovsky/4devs');

// Função para gerar e-mail temporário usando 1secmail
async function getTempEmail() {
  const domain = '1secmail.com';
  const username = Math.random().toString(36).substring(2, 10); // Gerar um nome de usuário aleatório
  return `${username}@${domain}`;
}

// Função para verificar e-mails na caixa de entrada
async function checkInbox(email) {
  const [username, domain] = email.split('@');
  const url = `https://www.1secmail.com/api/v1/?action=getMessages&login=${username}&domain=${domain}`;
  const response = await axios.get(url);
  return response.data;
}

// Função para obter o corpo do e-mail com base no ID
async function getEmailBody(email, messageId) {
  const [username, domain] = email.split('@');
  const url = `https://www.1secmail.com/api/v1/?action=readMessage&login=${username}&domain=${domain}&id=${messageId}`;
  const response = await axios.get(url);
  return response.data;
}

// Função para extrair links do corpo do e-mail
function extractLinks(body) {
  const linkRegex = /https?:\/\/[^\s'"]+/g; // Regex para capturar URLs
  return body.match(linkRegex) || []; // Retornar links ou array vazio se não houver
}

// Função principal
(async () => {
  const totalIngressos = 1; // Substitua este valor pela entrada do usuário (número de ingressos)
  const usuariosCadastrados = totalIngressos * 10; // Cada ingresso corresponde a 10 usuários cadastrados
  
  // Iniciar o navegador
  const browser = await chromium.launch({ headless: false }); // Coloque "true" para rodar sem interface gráfica
  const page = await browser.newPage();

  console.log('🔄 Iniciando o processo de cadastro...');

  for (let i = 0; i < usuariosCadastrados; i++) {
    console.log(`🚀 Cadastrando usuário ${i + 1} de ${usuariosCadastrados}...`);

    try {
      // Gerar e-mail temporário
      const tempEmail = await getTempEmail();
      console.log('📧 E-mail temporário gerado:', tempEmail);

      // Navegar até o site
      await page.goto('https://www.veloxtickets.com/Parceiro/P-CAMARA/Cadastre-se', {
        waitUntil: 'networkidle',
      });

      const data = await _4devs.gerar('1', false, 'pessoa');  

      // Preencher lacunas de texto
      await page.fill('input[name="FullName"]', data.dados[0].nome);
      await page.fill('input[name="Email"]', tempEmail);
      await page.fill('input[name="ConfirmEmail"]', tempEmail);
      await page.fill('input[name="BirthDate"]', data.dados[0].data_nasc);
      await page.fill('input[name="CPF"]', data.dados[0].cpf);
      await page.fill('input[name="Password"]', data.dados[0].senha);
      await page.fill('input[name="ConfirmPassword"]', data.dados[0].senha);
      await page.fill('input[name="AMIGOINDICA_EMAIL_CAMARA"]', 'RLNCI4');
      await page.check('input[name="Term"]');
      await page.waitForTimeout(2000);

      // Clicar no botão de registro
      await page.click('button[id="btnRegister"]');
      console.log('✅ Formulário enviado, aguardando e-mail...');

      // Verificar a caixa de entrada e aguardar o e-mail
      let emails = [];
      for (let j = 0; j < 20; j++) { // Tentar por 2 minutos (20 tentativas de 6 segundos)
        emails = await checkInbox(tempEmail);
        if (emails.length > 0) break;
        await new Promise(resolve => setTimeout(resolve, 6000)); // Espera 6 segundos
      }

      if (emails.length === 0) {
        console.log('❌ Nenhum e-mail recebido.'); // Nenhum e-mail encontrado
        continue; // Pula para a próxima iteração
      }

      const emailId = emails[0].id; // Pegando o primeiro e-mail recebido
      const emailBody = await getEmailBody(tempEmail, emailId);
      console.log('📥 E-mail recebido com sucesso.');

      // Extrair todos os links do corpo do e-mail
      const links = extractLinks(emailBody.body);

      if (links.length > 0) {
        const linkIndex = 1; // Altere este índice para escolher qual link seguir
        const selectedLink = links[linkIndex];

        if (selectedLink) {
          await page.goto(selectedLink);
          await page.waitForLoadState('networkidle'); // Aguarda o carregamento da página
          console.log('🌐 Página carregada com sucesso.');

          // Você pode adicionar mais ações aqui, se necessário
        } else {
          console.log('⚠️ Nenhum link selecionado.');
        }
      } else {
        console.log('⚠️ Nenhum link encontrado no e-mail.');
      }

    } catch (error) {
      console.error('⚠️ Ocorreu um erro:', error);
    }

    console.log('✅ Usuário cadastrado com sucesso.');
  }

  console.log(`🎉 Todos os usuários foram cadastrados. Você conquistou ${totalIngressos} ingresso(s) grátis para o cinema!`);

  // Fechar o navegador
  await browser.close();
  console.log('🚪 Navegador fechado.');
})();
