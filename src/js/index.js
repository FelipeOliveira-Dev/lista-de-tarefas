/* Captação de elementos */
const formAddTarefa = document.querySelector('#add-tarefa');
const inputAddTarefa = document.querySelector('#input-tarefa');
const inputDescricaoTarefa = document.querySelector('#add-desc-tarefa')
const listaTarefas = document.querySelector('#lista-tarefas');
const formEditTarefa = document.querySelector("#edicao-tarefa");
const inputEditTarefa = document.querySelector("#editar-tarefa");
const inputEditDescTarefa = document.querySelector("#editar-desc-tarefa");
const cancelEditBtn = document.querySelector("#btn-cancelar-edicao");
const inputBusca = document.querySelector("#input-busca");
const btnApagar = document.querySelector("#btn-apagar");
const filtroSelecao = document.querySelector("#selecao-filtro");

let tituloAntigo;
let descricaoAntiga;

function salvartarefa(titulo, descricao, feito=0, salva=1){
    const tarefa = document.createElement('div');
    tarefa.classList.add('tarefa');

    const tituloTarefa = document.createElement("h3");
    tituloTarefa.innerText = titulo;
    tarefa.appendChild(tituloTarefa);

    const desccricaoTarefa = document.createElement("p");
    desccricaoTarefa.innerText = descricao;
    tarefa.appendChild(desccricaoTarefa);

    const btnTerminaTarefa = document.createElement("button");
    btnTerminaTarefa.classList.add("termina-tarefa");
    btnTerminaTarefa.innerHTML = '<i class="fa-solid fa-check"></i>';
    tarefa.appendChild(btnTerminaTarefa);

    const btnEditaTarefa = document.createElement("button");
    btnEditaTarefa.classList.add("edita-tarefa");
    btnEditaTarefa.innerHTML = '<i class="fa-solid fa-pen"></i>';
    tarefa.appendChild(btnEditaTarefa);

    const btnApagaTarefa = document.createElement("button");
    btnApagaTarefa.classList.add("remove-tarefa");
    btnApagaTarefa.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    tarefa.appendChild(btnApagaTarefa);
    
    if (feito) {
        tarefa.classList.add("feito");
    }

    if(salva){
        salvarTarefaLocStorage(titulo, descricao, feito);
    }

    listaTarefas.appendChild(tarefa);
    inputAddTarefa.value = "";
    inputDescricaoTarefa.value = "";
}

function trocarFormularios(){
    formEditTarefa.classList.toggle('esconder');
    formAddTarefa.classList.toggle('esconder');
    listaTarefas.classList.toggle('esconder');
};

function editarTarefa(tituloTarefa, descricaoTarefa){
    const todasTarefas = document.querySelectorAll(".tarefa");

    todasTarefas.forEach((tarefa) => {
        let titulo = tarefa.querySelector("h3");
        let descricao = tarefa.querySelector("p");

        if(titulo.innerText === tituloAntigo && descricao.innerText === descricaoAntiga){
            titulo.innerText = tituloTarefa;
            descricao.innerText = descricaoTarefa;

            atualizaTarefaLocStorage(tituloAntigo, tituloTarefa, descricaoAntiga, descricaoTarefa);
        }
    })
};

function filtroTarefas(filtro){
    const tarefas = document.querySelectorAll(".tarefa");

    switch(filtro){
        case "tudo":
            tarefas.forEach((tarefa) => 
                (tarefa.style.display = "flex")
            );
            break;
        case "feitas":
            tarefas.forEach((tarefa) =>{
                if (tarefa.classList.contains("feito")) {
                    tarefa.style.display = "flex";
                } else {
                    tarefa.style.display = "none";
                }
            });
            break;
        case "fazer":
            tarefas.forEach((tarefa) =>{
                if (!tarefa.classList.contains("feito")) {
                    tarefa.style.display = "flex";
                } else {
                    tarefa.style.display = "none";
                }   
            });
    }
}

function buscar(busca){
    const tarefas = document.querySelectorAll(".tarefa");

    tarefas.forEach((tarefa) => {
        const tarefaTitulo = tarefa.querySelector("h3").innerText.toLowerCase();
        tarefa.style.display = "flex";
        if(!tarefaTitulo.includes(busca)){
            tarefa.style.display = "none";
        }
    });
}

filtroSelecao.addEventListener('change', (e) => {
    const valorFiltrado = e.target.value;
    filtroTarefas(valorFiltrado);
});

inputBusca.addEventListener("keyup", (e) => {
    const busca = e.target.value;
    buscar(busca);
});

btnApagar.addEventListener('click', (e) => {
    e.preventDefault();
    inputBusca.value = "";
    inputBusca.dispatchEvent(new Event("keyup"));
});

formAddTarefa.addEventListener('submit', (e) => {
    e.preventDefault();

    const valorTituloTarefa = inputAddTarefa.value;
    const valorDescricaoTarefa = inputDescricaoTarefa.value;
    if(valorTituloTarefa && valorDescricaoTarefa){
        salvartarefa(valorTituloTarefa, valorDescricaoTarefa);
    }else{
        console.log("Digite a tarefa!");
    }
});

document.addEventListener('click', (e) => {
    const elementoClicado = e.target;
    const elementoPai = elementoClicado.closest("div");
    let tituloTarefa;
    let descricaoTarefa;

    if(elementoPai && elementoPai.querySelector("h3")){
        tituloTarefa = elementoPai.querySelector("h3").innerText;
    }

    if(elementoPai && elementoPai.querySelector("p")){
        descricaoTarefa = elementoPai.querySelector("p").innerText;
    }

    if(elementoClicado.classList.contains("termina-tarefa")){
        elementoPai.classList.toggle("feito");

        atualizaStatusTarefaLocStorage(tituloTarefa, descricaoTarefa);
    }

    if(elementoClicado.classList.contains("remove-tarefa")){
        elementoPai.remove();

        removeTarefaLocStorage(tituloTarefa, descricaoTarefa);
    }

    if(elementoClicado.classList.contains("edita-tarefa")){
        trocarFormularios();
        inputEditTarefa.value = tituloTarefa;
        inputEditDescTarefa.value = descricaoTarefa;
        tituloAntigo = tituloTarefa;
        descricaoAntiga = descricaoTarefa;

    }
});

formEditTarefa.addEventListener("submit", (e) => {
    e.preventDefault();

    const tituloTarefa = inputEditTarefa.value;
    const descricaoTarefa = inputEditDescTarefa.value;

    if(tituloTarefa && descricaoTarefa){
        editarTarefa(tituloTarefa, descricaoTarefa);
    }

    trocarFormularios();
})

cancelEditBtn.addEventListener('click', (e) => {
    e.preventDefault();
    trocarFormularios();
});


/* Manipulação localStorage */
function pegarTarefasLocStorage(){
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    return tarefas;
}

function salvarTarefaLocStorage(titulo, descricao, feito){
    const tarefas = pegarTarefasLocStorage();
    const tarefa = {titulo, descricao, feito};

    tarefas.push(tarefa);

    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function exibirTarefas(){
    const tarefas = pegarTarefasLocStorage();
    
    tarefas.forEach((tarefa) => {
        salvartarefa(tarefa.titulo, tarefa.descricao, tarefa.feito, 0);
    });
}

function removeTarefaLocStorage(titulo, descricao){
    const tarefas = pegarTarefasLocStorage();

    const tarefasFiltradas = tarefas.filter((tarefa) => {
        return tarefa.titulo !== titulo || tarefa.descricao !== descricao;
    });

    localStorage.setItem("tarefas", JSON.stringify(tarefasFiltradas));
};

function atualizaStatusTarefaLocStorage(titulo, descricao){
    const tarefas = pegarTarefasLocStorage();

    tarefas.map((tarefa) => {
        if(tarefa.titulo === titulo && tarefa.descricao === descricao) {
            tarefa.feito = !tarefa.feito; // Inverte o status de conclusão da tarefa
        }
    });

    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function atualizaTarefaLocStorage(tituloAntigo, tituloNovo, descricaoAntiga, descricaoNova){
    const tarefas = pegarTarefasLocStorage();

    tarefas.map((tarefa) => {
        if(tarefa.titulo === tituloAntigo && tarefa.descricao === descricaoAntiga){
            tarefa.titulo = tituloNovo;
            tarefa.descricao = descricaoNova;
        }
    });

    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

exibirTarefas();