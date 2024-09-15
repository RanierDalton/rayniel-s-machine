import * as constantes from './constantes';

async function getQuiz() {
    // Add evento ao btn da página do HTML para que ao interagir nele, ele comece o Quiz
    document.getElementById("carregarPergunta").addEventListener("click", function(){carregarPergunta(0);});
    
    try { // tentar realizar o bloco designado
        // Pega a resposta a um fetch (GET) do link da API cm os dados JSON
        const respostaAPI = await fetch(constantes.URL_API);
        
        if (!respostaAPI.ok) {
            throw new Error(`Status Resposta : ${respostaAPI.status}`);
        }
    
        // Pega a tradução dos dados JSON
        const dados = await respostaAPI.json();
        console.log(dados);

        // variveis para controlarmos as questoes
        var indexPerguntasAcertadas = [];
        var numeroPerguntaAtual = 0;
    
        // variavel global do nome do participante
        var nome = '';
    
        // variaveis que vão coletar dt e hr de termino e inicio
        var hrIniciou = 0;
        var hrTerminou = 0;
        var dtIniciou = 0;
        var dtTerminou = 0;
    
        function salvarResposta(numPergunta, resposta) {
            // settar as dados.respostas escolhidas pelo user de acordo com base nas escolhas
            if(dados.respostas[numPergunta] == undefined){ // caso não tenha uma resposta com o número da pergunta
                // vai criar o espaço da resposta no Objeto
                var objResposta = {resposta:resposta};
                dados.respostas.push(objResposta);        
            } else { // caso tenha uma resposta armazenada
                // só troca o dado que está lá pela resposta
                dados.respostas[numPergunta].resposta = resposta;
            }
            console.log(dados.respostas);
            console.log(dados.respostas[numPergunta]);
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
    
        function carregarPergunta(numPergunta) {
            if (hrIniciou == 0){ // Caso o horario esteja zerado (ou seja a primeira pergunta do quiz)
                // coletar o nome do participante
                nome = prompt("Antes de começar, qual o seu nome?");

                // Settar as datas completas
                dtIniciou = new Date();
                hrIniciou = new Date();
    
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
                <h4 id="enunciado">${dados.perguntas[numeroPerguntaAtual].enunciado}</h4>
                <br>
            `;
            
            for (let opcao of dados.perguntas[numeroPerguntaAtual].opcoes) {// fazer um loop para listar todas as opções das dados.perguntas
    
                if (dados.respostas[numeroPerguntaAtual]==undefined){
                    // Só aparece a opção sem estar checkado
                    conteudo.innerHTML += `
                        <input type="radio" id="opt${opcao}" name="resposta" value="${opcao}">
                        <label for="${opcao}">${opcao}</label><br>
                    `;
                } else if (opcao == dados.respostas[numeroPerguntaAtual].resposta) { // caso a opção seja alguma em que o usuario tenha sleecionado anteriormente
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
            if (numeroPerguntaAtual == (dados.perguntas.length - 1)) { // Caso seja a ultima pergunta da lista de dados.perguntas
                // vai mostrar o botoes Voltar e Finalizar Quiz, por ele estar na última pergunta, não precisa avançar mais questão
                conteudo.innerHTML += constantes.CONTEUDO_BOTAO_ULTIMA_PERGUNTA;
    
                // cria uma lista de radios que tenham o nome resposta
                const radios = document.querySelectorAll('input[name="resposta"]');  
                // Vai adicionar um evento no botão de finalizar Quiz, onde ao clicar nele
                document.getElementById("finalizarQuiz").addEventListener("click", () => {
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
                });
                
                // Add um outro evento, q qnd o usuário clicar no msm btn que o evento anterior (não precisa ser novamente pq o processamento é rápido para captar os dosi eventos), ele vai finalizar o Quiz
                document.getElementById("finalizarQuiz").addEventListener("click", function(){finalizarQuiz()});
                // Add um evento, qnd o usuário clicar nesse btn, ele vai voltar uma pergunta
                document.getElementById("voltarPergunta").addEventListener("click", function(){voltarPergunta();});

            } else if (numeroPerguntaAtual == 0) { // caso esteja na primeira questão
                // vai mostrar apenas o botão para a proxima pergunta, pois é a primeira
                conteudo.innerHTML += constantes.CONTEUDO_BOTAO_PRIMEIRA_PERGUNTA;

                // cria uma lista de radios que tenham o nome resposta
                const radios = document.querySelectorAll('input[name="resposta"]');  
                // Vai adicionar um evento no botão de finalizar Quiz, onde ao clicar nele
                document.getElementById("finalizarQuiz").addEventListener("click", () => {
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
                });

                // Add um evento, onde, qnd o usuário clicar nesse btn, ele vai avança uma pergunta
                document.getElementById("proxPergunta").addEventListener("click", function(){proxPergunta();});
            } else { // caso não seja uma questão de extremos
                // vai mostrar o btn de prox e voltar pergunta
                conteudo.innerHTML += constantes.CONTEUDO_BOTAO_DEFAULT_PERGUNTA;

                const radios = document.querySelectorAll('input[name="resposta"]');  
                document.getElementById("proxPergunta").addEventListener("click", () => {
                    let opcaoSelecionada;
                    for (const radio of radios) {
                        if (radio.checked) {
                            opcaoSelecionada = radio.value;
                            break;
                        }
                    }
                    salvarResposta(numeroPerguntaAtual,opcaoSelecionada);
                });

                // Add um evento, onde, qnd o usuário clicar nesse btn, ele vai avança uma pergunta
                document.getElementById("proxPergunta").addEventListener("click", function(){proxPergunta();});
                // Add um evento, qnd o usuário clicar nesse btn, ele vai voltar uma pergunta
                document.getElementById("voltarPergunta").addEventListener("click", function(){voltarPergunta();});     
            }
        }
    
        function resetarQuiz() {
            for (let i = 0; i < dados.perguntas.length; i++) {
                // resetar as respostas
                dados.respostas[i].resposta = '';
                // embaralhar cada lista de opções de cada resposta
                dados.perguntas[i].opcoes = embaralharListas(dados.perguntas[i].opcoes);
            }
            // resetar as variáveis de controlar as questões
            var indexPerguntasAcertadas = [];
            var numeroPerguntaAtual = 0;
            // resetando o conteúdo para ficar como o Menu Inicial novamente
            conteudo.innerHTML = CONTEUDO_MENU_INICIAL;
    
            // embaralhar as perguntas
            dados.perguntas = embaralharListas(dados.perguntas);
        }
    
        function finalizarQuiz() {
            // qnd finalizado 
            // Settar as datas atuais completas
            dtTerminou = new Date(); 
            hrTerminou = new Date();

            // filtra de acordo com somente as Horas(horas, minutos e segundos) e a data(Ano, mes e dia)
            dtTerminou = `${dtTerminou.getFullYear()}-${dtTerminou.getMonth()}-${dtTerminou.getDate()}`;
            hrTerminou = `${hrTerminou.getHours()}:${hrTerminou.getMinutes()}:${hrTerminou.getSeconds()}`;
    
            // Ao terminar o quiz, irá fechar todas as dados.respostas
            for (let i = 0; i < dados.perguntas.length; i++) {
                // caso a resposta da pergunta seja igual ao q o usuário informou 
                if (dados.perguntas[i].resposta == dados.respostas[i].resposta) {
                    // vai add o número da pergunta que foi feita a lista de questoes q o user acertou
                    indexPerguntasAcertadas.push(i + 1);
                }
            }
            // Titulo Padrão da mensagem final
            conteudo.innerHTML = constantes.TIULO_PAGINA_RESULTADO;

            if (indexPerguntasAcertadas.length == 0) { // caso o tamanho do array da lista dos acertos do user seja 0 (ou seja, errou tudo)
                // mostrar msg 
                conteudo.innerHTML += constantes.MSG_RESULTADO_ZERADO;

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
                conteudo.innerHTML += constantes.MSG_RESULTADO_GABARITO;
            }
            // Botão para voltar ao menu iniciar
            conteudo.innerHTML += constantes.CONTEUDO_BOTAO_VOLTAR_MENU;
    
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
            
            console.log(objLogTentativas);
            // https://stackoverflow.com/questions/24468459/sending-a-json-to-server-and-retrieving-a-json-in-return-without-jquery
            dados.logTentativas.push(jsonLogTentativas);
            
            // Esta seção seria uma parte adicional para enviar os dados locais para a API hospedada (POST), porém o GitHub Pages não aceita outras requisições Http fora o GET
            // var dadosEnviar = dados.JSON.parse(dados);

            // fetch("", {
            //     credentials: "same-origin",
            //     mode: "same-origin",
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: dadosEnviar
            // })
            // .then(resposta => {
            //     if (resposta.status === 200) {
            //         return resposta.json()
            //     } else {
            //         console.log("Status: " + resposta.status)
            //         return Promise.reject("server")
            //     }
            // })
            // .then(dataJson => {
            //     dataReceived = JSON.parse(dataJson)
            // })
            // .catch(erro => {
            //     if (erro === "server") return
            //     console.log(erro)
            // });
            
            // Add um evento ao btn (da linha 240) para que ao clicar nele, ele resete todo o quiz
            document.getElementById("resetarQuiz").addEventListener("click", function(){resetarQuiz();});
        }
    
    
        function embaralharListas(perguntas) {
            // criar uma nova lista
            const novaListaPerguntas = [];
            // sortear um número aleatório de acordo com o número máximo do original
            var numero = Math.floor(Math.random() * perguntas.length);
            // contador para limitar quando o mebaralhamento acabar
            var contador = 1;
            // adcionar o conteúdo de um determinado index no primeiro index do novo array
            novaListaPerguntas.push(perguntas[numero]);
            // quando o contador se tornar igual o tamanho do array original, ele irá parar o loop
            while (contador < perguntas.length) {
                // gerar outro numero aleatorio
                numero = Math.floor(Math.random() * perguntas.length);
                // caso não exista o valor com o número de index que foi sorteado
                if (!novaListaPerguntas.includes(perguntas[numero])) {
                    // adicionará 1 ao contador
                    contador++;
                    // irá adicionar o valor desse determinado index ao novo array
                    novaListaPerguntas.push(perguntas[numero]);
                }
            }
            // caso já tenha inserido todos os valores na nova array, irá devolver o valor dela
            return novaListaPerguntas;
        } 
    } catch (error) { // caso de erro ao longo do processo do try
        // Mostra qual o erro no console
        console.error(error.message);
    }
}

// ao recarregar ou abrir a página, já começa configurando tudo (dados e o evento do btn) para o quiz funcionar
getQuiz();

