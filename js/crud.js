const URL_API_LOG = "https://api.jsonbin.io/v3/b/66e7555aad19ca34f8a69959";
const URL_API_PERGUNTAS = "https://api.jsonbin.io/v3/b/66e7557ce41b4d34e430d9f6";

let conteudo = document.getElementById("conteudo");

let dadosPerguntas = '';
let dadosLogs = '';

getPerguntasQuiz();
getLogQuiz();

function opcaoDadosSelecionado(num){
    var opcaoSelecionada = document.getElementById("slctOpcao").value;
    conteudo.innerHTML ="";
    

    if (num == 1 || opcaoSelecionada == "1"){
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
            <button onclick="mostrarFiltro(1)" class="btn btn-success btn-lg">Filtros</button>
            <br>
            <div id="filtro"></div>

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
    } else if (num == 2 || opcaoSelecionada == "2"){

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
            <button onclick="mostrarFiltro(2)" class="btn btn-success btn-lg">Filtros
            </button>
            <br>
            <div id="filtro"></div>
            

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

function mostrarFiltro(option){
    if(option==1){
        filtro.innerHTML =  `
            <div id="iptNome"></div>

            <h5>Selecionar Dificuldade</h5>
            <select id="slctDificuldade" class="form-select" id="slctOpcao">
                <option value="fácil">Fácil</option>
                <option value="médio">Médio</option>
                <option value="difícil">Difícil</option>
            </select>
            <br>

            <button onclick="aplicarFiltro(1)" class="btn btn-success btn-lg">Salvar</button>
        `;
    } else {
        filtro.innerHTML =  `
            <h5>Escolher Nome</h5>
            <input class="form-control" id="iptNome" type="text" placeholder="Insire o nome que deseja procurar">
            <br>

            <h5>Selecionar Dificuldade</h5>
            <select id="slctDificuldade" class="form-select" id="slctOpcao">
                <option value="fácil">Fácil</option>
                <option value="médio">Médio</option>
                <option value="difícil">Difícil</option>
            </select>
            <br>

            <!--
            <h5>Selecionar Data</h5>
            <div class="ls-box-filter">
                <label>
                  <b class="ls-label-text">Período</b>
                  <input id="dtInicio" type="date">
                </label>
                <label>
                  <b>a</b>
                  <input id="dtFinal" type="date">
                </label>
            </div>
            <br>
            -->
            <button onclick="aplicarFiltro(2)" class="btn btn-success btn-lg">Salvar</button>
        `;
        console.log("funciono");
    }
}

function aplicarFiltro(option){
    var nome = document.getElementById("iptNome").value;
    var dificuldade = document.getElementById("slctDificuldade").value;
    
    // var dtInicio = document.getElementById("dtInicio").value;
    // var dtFinal = document.getElementById("dtFinal").value;

    const customFilter = (arr, predicate) => {
        return arr.reduce((acc, item) => {
            if (predicate(item)) {
                acc.push(item);
            }
            return acc;
        }, []);
    };

    var filtered = '';

    while(filtro.firstChild) { 
        filtro.removeChild(filtro.firstChild); 
    }

    if (option == 1){
        getPerguntasQuiz();

        filtered = customFilter(dadosPerguntas, log => log.nivel == dificuldade);
        dadosPerguntas = filtered;

        opcaoDadosSelecionado(1);

    } else {
        getLogQuiz();
    
        if (nome != ""){
            filtered = customFilter(dadosLogs, log => log.nome == nome);
            dadosLogs = filtered;
        } 

        filtered = customFilter(dadosLogs, log => log.nivel == dificuldade);
        dadosLogs = filtered;

        opcaoDadosSelecionado(2);
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
