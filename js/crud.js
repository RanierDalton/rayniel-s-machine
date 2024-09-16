const URL_API_LOG = "https://api.jsonbin.io/v3/b/66e7555aad19ca34f8a69959";
const URL_API_PERGUNTAS = "https://api.jsonbin.io/v3/b/66e7557ce41b4d34e430d9f6";

let dadosPerguntas = '';
let dadosLogs = '';

getPerguntasQuiz();
getLogQuiz();

function opcaoDadosSelecionado(){
    var opcaoSelecionada = document.getElementById("slctOpcao").value;
    conteudo.innerHTML ="";
    

    if (opcaoSelecionada == "perguntas"){
        console.log(dadosPerguntas);
        var dadosTabela = '';

        for(let i=0; i < Object.keys(dadosPerguntas).length; i++){ 
            console.log(dadosPerguntas[i]);
            dadosTabela += `
                <tr>
                    <th scope="row">${i}</th>
                    <td>${dadosPerguntas[i].nivel}</td>
                    <td>${dadosPerguntas[i].enunciado}</td>
                    <td>${dadosPerguntas[i].resposta}</td>
                </tr>
            `;
        }

        conteudo.innerHTML += `
            <button onclick="filtar()" id="getQuiz" class="btn btn-success btn-lg">Filtros</button>
            <br>
            <br>

            <table id="tbOutput" class="table">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Dificuldade</th>
                    <th scope="col">Enunciado</th>
                    <th scope="col">Resposta</th>
                  </tr>
                </thead>
                <tbody>
                    ${dadosTabela}
                </tbody>
            </table>
        `;
    } else if (opcaoSelecionada == "logs"){

        var dadosTabela = '';

        for(let i=0; i < Object.keys(dadosLogs).length; i++){ 
            dadosTabela += `
                <tr>
                    <th scope="row">${i}</th>
                    <td>${dadosLogs[i].nome}</td>
                    <td>${dadosLogs[i].acertos}</td>
                    <td>${dadosLogs[i].nivel}</td>
                    <td>${dadosLogs[i].dtIniciou+ " "+ dadosLogs[i].hrIniciou}</td>
                    <td>${dadosLogs[i].dtTerminou+ " "+ dadosLogs[i].hrTerminou}</td>
                </tr>
            `;
        }

        conteudo.innerHTML += `
            <button onclick="filtar()" id="getQuiz" class="btn btn-success btn-lg">Filtros</button>
            <br>

            <table id="tbOutput" class="table">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Acertos</th>
                    <th scope="col">Dificuldade</th>
                    <th scope="col">Data Início</th>
                    <th scope="col">Data Término</th>
                  </tr>
                </thead>
                <tbody>
                    ${dadosTabela}
                </tbody>
            </table>
        `;
    }
}

function opcaoAcao(){

}

function mostrarLogs(){

}

function mostrarPerguntas(){

}

function adicionarPergunta(){

}

function removerPergunta(){

}

function coletarDadosPerguntas(dadosColetados){
    dadosPerguntas = dadosColetados.perguntas;
}

function coletarDadosLogs(dadosLog){
    dadosLogs = dadosLog;
}

async function getLogQuiz(){
    let reqGET = new XMLHttpRequest();

    reqGET.onreadystatechange = () => {
        if (reqGET.readyState == XMLHttpRequest.DONE) {
            coletarDadosLogs(JSON.parse(reqGET.responseText).record);
        }
    };

    reqGET.open("GET", URL_API_LOG, true);
    reqGET.setRequestHeader("X-Master-Key", "$2a$10$BAvkaunKerxsC0ue.QRXBua6Sizg.U.e3oD1z6Ud7ykN4nL9AEMPa");
    reqGET.send();
}

async function getPerguntasQuiz() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            coletarDadosPerguntas(JSON.parse(req.responseText).record);
        }
    }
    req.open("GET", URL_API_PERGUNTAS, true);
    req.setRequestHeader("X-Master-Key", "$2a$10$BAvkaunKerxsC0ue.QRXBua6Sizg.U.e3oD1z6Ud7ykN4nL9AEMPa");
    req.send();
}
