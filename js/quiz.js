const URL_API = "https://my-json-server.typicode.com/RanierDalton/api-quiz/db";
const URL_API_LOG = "https://my-json-server.typicode.com/RanierDalton/api-quiz/logTentativas";

// Mensagem padrão do Menu inicial
const CONTEUDO_MENU_INICIAL = `
    <!-- titulo -->
    <h1>Quiz de Sistemas Numéricos</h1>
    <br><br>
    <!-- descrição -->
    <h4>Esse Quiz se trata sobre 5 perguntas sobre conversão de diferentes bases e diversos cálculos (adição, subtração, divisão e multiplicação).</h4>
    <br><br>
    <!-- Botão Inicar o Quiz -->
    <button class="btn btn-success btn-lg" onclick="carregarPergunta(0)">Iniciar Quiz</button>
    <br>
`;

const CONTEUDO_BOTAO_ULTIMA_PERGUNTA = `
        <br><br>
        <button class="btn btn-success btn-lg" id="voltarPergunta">Voltar Pergunta</button>
        <br>
        <button class="btn btn-success btn-lg" id="finalizarQuiz">Finalizar Quiz</button>
        <br>
    </center>
`;

const CONTEUDO_BOTAO_PRIMEIRA_PERGUNTA = `
        <br><br>
        <button class="btn btn-success btn-lg" id="proxPergunta">Próxima Pergunta</button>
        <br>
    </center>
`;

const CONTEUDO_BOTAO_DEFAULT_PERGUNTA = `
        <br><br>
        <button class="btn btn-success btn-lg" id="voltarPergunta">Voltar Pergunta</button>
        <br>
        <button class="btn btn-success btn-lg" id="proxPergunta">Próxima Pergunta</button>
        <br>
    </center>
`;

const TIULO_PAGINA_RESULTADO =`
    <h1>Resultado!</h1>
    <br><br>
`;

const MSG_RESULTADO_ZERADO =`
    <h4>Olha, estude mais e volte aqui mais preparado, pois você zerou a prova.</h4>
    <br><br>
`;

const MSG_RESULTADO_GABARITO =`
    <h4>Boa! Acertou TODAS. Você é o orgulho da Marise. <b>IT'S OVER!</b></h4>
    <br><br>
`;

const CONTEUDO_BOTAO_VOLTAR_MENU = `
    <button class="btn btn-success btn-lg" id="resetarQuiz">Voltar ao Menu</button>
    <br>
`;

let dados = [];
let log = [];
let respostas = [];
let indexPerguntasAcertadas = [];

// Reseta as datas de início
let nome = "";
var dtIniciou = 0;
var hrIniciou = 0;
var dtTerminou = 0;
var hrTerminouu = 0;

async function getLogQuiz(){
    let reqGET = new XMLHttpRequest();

    reqGET.onreadystatechange = () => {
        if (reqGET.readyState == XMLHttpRequest.DONE) {
            coletarDadosLogs(JSON.parse(reqGET.responseText).record);
        }
    };

    reqGET.open("GET", "https://api.jsonbin.io/v3/b/66e7555aad19ca34f8a69959", true);
    reqGET.setRequestHeader("X-Master-Key", "$2a$10$BAvkaunKerxsC0ue.QRXBua6Sizg.U.e3oD1z6Ud7ykN4nL9AEMPa");
    reqGET.send();
}

function postLogQuiz(log){
    let reqPOST = new XMLHttpRequest();

    reqPOST.onreadystatechange = () => {};

    reqPOST.open("PUT", "https://api.jsonbin.io/v3/b/66e7555aad19ca34f8a69959", true);
    reqPOST.setRequestHeader("Content-Type", "application/json");
    reqPOST.setRequestHeader("X-Master-Key", "$2a$10$BAvkaunKerxsC0ue.QRXBua6Sizg.U.e3oD1z6Ud7ykN4nL9AEMPa");
    reqPOST.setRequestHeader("X-Bin-Versioningy", "true");
    reqPOST.send(log);
}


async function getPerguntasQuiz() {
        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
                coletarDadosPerguntas(JSON.parse(req.responseText).record);
            }
        }

        req.open("GET", "https://api.jsonbin.io/v3/b/66e7557ce41b4d34e430d9f6", true);
        req.setRequestHeader("X-Master-Key", "$2a$10$BAvkaunKerxsC0ue.QRXBua6Sizg.U.e3oD1z6Ud7ykN4nL9AEMPa");
        req.send();
}

 function carregarPergunta(numPergunta) {
                    if (hrIniciou == 0){ // Caso o horario esteja zerado (ou seja a primeira pergunta do quiz)
        
                        // Settar as datas completas
                        dtIniciou = new Date();
                        hrIniciou = new Date();

                        nome = prompt("Antes de começar o quiz, informe o seu nome:");
            
                        // filtra de acordo com somente as Horas(horas, minutos e segundos) e a data(Ano, mes e dia)
                        dtIniciou = `${dtIniciou.getFullYear()}-${dtIniciou.getMonth()}-${dtIniciou.getDate()}`;
                        hrIniciou = `${hrIniciou.getHours()}:${hrIniciou.getMinutes()}:${hrIniciou.getSeconds()}`;
                    }   
        
                    // o numero da pergunta atual é o que foi atribuido a esta função
                    numeroPerguntaAtual = numPergunta;
                    // Informar ao user qual questão está
                    conteudo.innerHTML = `
                        <h1 id="titulo">${numeroPerguntaAtual + 1}ª Pergunta</h1>
                        <br>
                        <h4 id="enunciado">${dados[0][numeroPerguntaAtual].enunciado}</h4>
                        <br>
                    `;
                    
                    for (let opcao of dados[0][numeroPerguntaAtual].opcoes) {// fazer um loop para listar todas as opções das dados.perguntas
            
                        if (respostas[numeroPerguntaAtual]==undefined){
                            // Só aparece a opção sem estar checkado
                            conteudo.innerHTML += `
                                <input type="radio" id="opt${opcao}" name="resposta" value="${opcao}">
                                <label for="${opcao}">${opcao}</label><br>
                            `;
                        } else if (opcao == respostas[numeroPerguntaAtual].resposta) { // caso a opção seja alguma em que o usuario tenha sleecionado anteriormente
                            // Vai aparecer como checkado
                            conteudo.innerHTML += `
                                <input checked type="radio" id="opt${opcao}" name="resposta" value="${opcao}">
                                <label for="${opcao}">${opcao}</label><br>
                            `;
                        } else {
                            // Só aparece a opção sem estar checkado
                            conteudo.innerHTML += `
                                <input type="radio" id="opt${opcao}" name="resposta" value="${opcao}">
                                <label for="${opcao}">${opcao}</label><br>
                            `;
                        }     
                    }
                    // parte das mudanças de páginas e ações do user
                    if (numeroPerguntaAtual === (Object.keys(dados[0]).length - 1)) { // Caso seja a ultima pergunta da lista de dados.perguntas
                        // vai mostrar o botoes Voltar e Finalizar Quiz, por ele estar na última pergunta, não precisa avançar mais questão
                        conteudo.innerHTML += CONTEUDO_BOTAO_ULTIMA_PERGUNTA;
            
                        // Vai adicionar um evento no botão de finalizar Quiz, onde ao clicar nele
                        document.getElementById("finalizarQuiz").addEventListener("click", function(){coletarResposta()});
                        
                        // Add um outro evento, q qnd o usuário clicar no msm btn que o evento anterior (não precisa ser novamente pq o processamento é rápido para captar os dosi eventos), ele vai finalizar o Quiz
                        document.getElementById("finalizarQuiz").addEventListener("click", function(){finalizarQuiz()});
                        // Add um evento, qnd o usuário clicar nesse btn, ele vai voltar uma pergunta
                        document.getElementById("voltarPergunta").addEventListener("click", function(){voltarPergunta();});
        
                    } else if (numeroPerguntaAtual == 0) { // caso esteja na primeira questão
                        // vai mostrar apenas o botão para a proxima pergunta, pois é a primeira
                        conteudo.innerHTML += CONTEUDO_BOTAO_PRIMEIRA_PERGUNTA;
        
                        // Vai adicionar um evento no botão de finalizar Quiz, onde ao clicar nele
                        document.getElementById("proxPergunta").addEventListener("click", function(){coletarResposta()});
        
                        // Add um evento, onde, qnd o usuário clicar nesse btn, ele vai avança uma pergunta
                        document.getElementById("proxPergunta").addEventListener("click", function(){proxPergunta();});
                    } else { // caso não seja uma questão de extremos
                        // vai mostrar o btn de prox e voltar pergunta
                        conteudo.innerHTML += CONTEUDO_BOTAO_DEFAULT_PERGUNTA;
        
                        const radios = document.querySelectorAll('input[name="resposta"]');  
                        document.getElementById("proxPergunta").addEventListener("click", function(){coletarResposta()});
        
                        // Add um evento, onde, qnd o usuário clicar nesse btn, ele vai avança uma pergunta
                        document.getElementById("proxPergunta").addEventListener("click", function(){proxPergunta();});
                        // Add um evento, qnd o usuário clicar nesse btn, ele vai voltar uma pergunta
                        document.getElementById("voltarPergunta").addEventListener("click", function(){voltarPergunta();});     
                    }
}

function coletarResposta(){
    const radios = document.querySelectorAll('input[name="resposta"]');  

    // criar variavel para guardar a selecao dos radios
    let opcaoSelecionada='';
    for (const radio of radios) { // fzr um loop onde irá acessar kd um dos radios
        if (radio.checked) { // caso esteja checado
            // vai guardar o valor dele 
            opcaoSelecionada = radio.value;
            // vai parar o loop
            break;
        } // se não só passa direto
    }
    // vai salvar a resposta que foi selecionada
    salvarResposta(numeroPerguntaAtual,opcaoSelecionada);
}

function salvarResposta(numPergunta, resposta) {
    // settar as respostas escolhidas pelo user de acordo com base nas escolhas
    if(respostas[numPergunta] == undefined){ // caso não tenha uma resposta com o número da pergunta
        // vai criar o espaço da resposta no Objeto
        var objResposta = {resposta:resposta};
        respostas.push(objResposta);        
    } else { // caso tenha uma resposta armazenada
        // só troca o dado que está lá pela resposta
        respostas[numPergunta].resposta = resposta;
    }
}

function proxPergunta() {
    // add 1 ao valor da pergunta
    numeroPerguntaAtual++;
    // recarregar a página com os dados da nova pergunta
    carregarPergunta(numeroPerguntaAtual);
}

function voltarPergunta() {
    // retira 1 ao valor da pergunta
    numeroPerguntaAtual--;
    // recarregar a página com os dados da nova pergunta
    carregarPergunta(numeroPerguntaAtual);
}

function resetarQuiz() {
    for (let i = 0; i < Object.keys(dados[0]).length; i++) {
        // resetar as respostas
        respostas[i].resposta = '';
        // embaralhar cada lista de opções de cada resposta
        dados[0][i].opcoes = embaralharListas(dados[0][i].opcoes);
    }
    // resetar as variáveis de controlar as questões
    indexPerguntasAcertadas = [];
    numeroPerguntaAtual = 0;
    // resetando o conteúdo para ficar como o Menu Inicial novamente
    conteudo.innerHTML = CONTEUDO_MENU_INICIAL;

    console.log(dados);
    // embaralhar as perguntas
    dados = embaralharListas(dados);
    console.log(dados);
}

function finalizarQuiz() {
    // qnd finalizado 
    // Settar as datas atuais completas
    dtTerminou = new Date(); 
    hrTerminou = new Date();

    // filtra de acordo com somente as Horas(horas, minutos e segundos) e a data(Ano, mes e dia)
    dtTerminou = `${dtTerminou.getFullYear()}-${dtTerminou.getMonth()}-${dtTerminou.getDate()}`;
    hrTerminou = `${hrTerminou.getHours()}:${hrTerminou.getMinutes()}:${hrTerminou.getSeconds()}`;

    // Ao terminar o quiz, irá fechar todas as respostas
    for (let i = 0; i < Object.keys(dados[0]).length; i++) {
        // caso a resposta da pergunta seja igual ao q o usuário informou 
        if (dados[0][i].resposta == respostas[i].resposta) {
            // vai add o número da pergunta que foi feita a lista de questoes q o user acertou
            indexPerguntasAcertadas.push(i + 1);
        }
    }
    // Titulo Padrão da mensagem final
    conteudo.innerHTML = TIULO_PAGINA_RESULTADO;

    if (indexPerguntasAcertadas.length == 0) { // caso o tamanho do array da lista dos acertos do user seja 0 (ou seja, errou tudo)
        // mostrar msg 
        conteudo.innerHTML += MSG_RESULTADO_ZERADO;

    } else if (indexPerguntasAcertadas.length <= 2) { // caso o tamanho do array da lista dos acertos do user seja >0 e <=2 (acertou 1 ou 2 questões)
        // mostrar msg informando quantas acertou e quais acertou
        conteudo.innerHTML += `
            <h4>Você acertou ${indexPerguntasAcertadas.length}, sendo elas as questões ${indexPerguntasAcertadas}. Não foi tão bem, mas dá pra melhorar!</h4>
            <br><br>
        `;
    } else if (indexPerguntasAcertadas.length <= 4) {
        // mostrar msg informando quantas acertou e quais acertou
        conteudo.innerHTML += `
            <h4>Você acertou ${indexPerguntasAcertadas.length}, sendo elas as questões ${indexPerguntasAcertadas}. Já acertou mais da metade. PARABÉNS!</h4>
            <br><br>
        `;
    } else {
        // mostrar msg informando do gabarito
        conteudo.innerHTML += MSG_RESULTADO_GABARITO;
    }
    // Botão para voltar ao menu iniciar
    conteudo.innerHTML += CONTEUDO_BOTAO_VOLTAR_MENU;
    document.getElementById("resetarQuiz").addEventListener("click", () => {
        resetarQuiz();
    });

    // Faz um objeto onde faz um registro (log) da tentativa do quiz
    objLogTentativas = {
        nome:nome,
        nivel:'fácil',
        acertos:indexPerguntasAcertadas.length,
        perguntasAcertou:indexPerguntasAcertadas,
        hrIniciou:hrIniciou,
        hrTerminou:hrTerminou,
        dtIniciou:dtIniciou,
        dtTerminou:dtTerminou
    };

    // Reseta as datas de início
    dtIniciou = 0;
    hrIniciou = 0;

    log.push(objLogTentativas);
    log = JSON.stringify(log);

    postLogQuiz(log);
}

function embaralharListas(lista) {
    // criar uma nova lista
    const novaLista = [];
    // sortear um número aleatório de acordo com o número máximo do original
    console.log(lista);
    if (lista.length == undefined){
        var numero = Math.floor(Math.random() * Object.keys(lista).length);
    } else {
        var numero = Math.floor(Math.random() * lista.length);
    }
    
    // contador para limitar quando o mebaralhamento acabar
    var contador = 1;
    // adcionar o conteúdo de um determinado index no primeiro index do novo array
    novaLista.push(lista[numero]);
    // quando o contador se tornar igual o tamanho do array original, ele irá parar o loop
    while (contador < lista.length) {
        // gerar outro numero aleatorio
        numero = Math.floor(Math.random() * lista.length);
        // caso não exista o valor com o número de index que foi sorteado
        if (!novaLista.includes(lista[numero])) {
            // adicionará 1 ao contador
            contador++;
            // irá adicionar o valor desse determinado index ao novo array
            novaLista.push(lista[numero]);
        }
    }
    // caso já tenha inserido todos os valores na nova array, irá devolver o valor dela
    return novaLista;
} 

function coletarDadosPerguntas(dadosColetados){
    dados.push(dadosColetados.perguntas);
}

function coletarDadosLogs(dadosLog){
    log.push(dadosLog);
}

getPerguntasQuiz();
getLogQuiz();


