// Usuários pré-cadastrados
const usuarios = [
    { nome: "visitante", senha: "1234", tipo: "visitante" },
    { nome: "funcionario", senha: "abcd", tipo: "funcionario" },
    { nome: "seguranca", senha: "seg123", tipo: "seguranca" },
    { nome: "wayne", senha: "batman", tipo: "wayne" },
];

// Mapeamento de acessos por tipo de usuário
const acessos = {
    visitante: ["Recepção", "Banheiro"],
    funcionario: ["Recepção", "Banheiro", "Corredor"],
    seguranca: ["Recepção", "Banheiro", "Corredor", "Sala de Monitoramento"],
    wayne: ["Recepção", "Banheiro", "Corredor", "Sala de Monitoramento", "Sala Wayne", "Sala Secreta"],
};

// Função de autenticação
function autenticarUsuario(usuario, senha) {
    return usuarios.find(u => u.nome === usuario && u.senha === senha);
}

// Função para limpar campos
function limparCampos(...campos) {
    campos.forEach(campo => (campo.value = ""));
}

// Evento de login
document.getElementById("btn_acessar").addEventListener("click", function () {
    const campoUsuario = document.getElementById("usuario");
    const campoSenha = document.getElementById("senha");
    const usuario = campoUsuario.value.trim();
    const senha = campoSenha.value.trim();

    if (!usuario || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    const usuarioAutenticado = autenticarUsuario(usuario, senha);
    if (!usuarioAutenticado) {
        alert("Usuário ou senha inválidos!");
        limparCampos(campoUsuario, campoSenha);
        return;
    }

    // Salva o usuário logado no localStorage
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAutenticado));

    // Exibe áreas disponíveis
    const nivelAcesso = acessos[usuarioAutenticado.tipo];
    alert(`Bem-vindo, ${usuario}! Áreas disponíveis: ${nivelAcesso.join(", ")}`);

    // Redireciona para página inicial
    window.location.href = "plant_recep.html";

    limparCampos(campoUsuario, campoSenha);
});

// Função para recuperar o usuário logado do localStorage
function obterUsuarioLogado() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    return usuarioLogado ? JSON.parse(usuarioLogado) : null;
}

// Função de navegação controlada
function irParaPagina(pagina, nomePagina) {
    const usuarioLogado = obterUsuarioLogado();

    if (!usuarioLogado) {
        alert("Você precisa estar logado para acessar esta página!");
        window.location.href = "index.html";
        return;
    }

    const nivelAcesso = acessos[usuarioLogado.tipo];
    if (!nivelAcesso.includes(nomePagina)) {
        alert(`Acesso negado! Você não tem permissão para acessar ${nomePagina}.`);
        return;
    }

    // Navega para a página permitida
    window.location.href = pagina;
}

// Funções para navegação controlada
function irParaBanheiro() {
    irParaPagina("banheiro.html", "Banheiro");
}

function irParaCorredor() {
    irParaPagina("corredor.html", "Corredor");
}

function irParaRecepcao() {
    irParaPagina("plant_recep.html", "Recepção");
}

function irParaSalaWayne() {
    irParaPagina("salaWayne.html", "Sala Wayne");
}

function irParaSalaMonit() {
    irParaPagina("salaMonit.html", "Sala de Monitoramento");
}

function irParaSalaSecreta() {
    irParaPagina("salaSecret.html", "Sala Secreta");
}

// Limpar dados do localStorage ao sair
function sair() {
    localStorage.removeItem("usuarioLogado");
    alert("Você saiu da sua conta!");
    window.location.href = "index.html";
}

// Função de cadastro de novo usuário
function cadastrarUsuario(nome, senha, tipo) {
    if (!acessos[tipo]) {
        alert("Tipo de usuário inválido! Escolha um tipo válido.");
        return false;
    }

    if (usuarios.find(u => u.nome === nome)) {
        alert("Usuário já existe!");
        return false;
    }

    usuarios.push({ nome, senha, tipo });
    alert(`Usuário "${nome}" cadastrado com sucesso!`);
    return true;
}

// Evento de cadastro
document.getElementById("cadastroForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const campoNovoUsuario = document.getElementById("novoUsuario");
    const campoNovaSenha = document.getElementById("novaSenha");
    const campoTipoUsuario = document.getElementById("tipoUsuario");

    const nome = campoNovoUsuario.value.trim();
    const senha = campoNovaSenha.value.trim();
    const tipo = campoTipoUsuario.value;

    if (!nome || !senha || !tipo) {
        alert("Preencha todos os campos!");
        return;
    }

    const sucesso = cadastrarUsuario(nome, senha, tipo);
    if (sucesso) {
        limparCampos(campoNovoUsuario, campoNovaSenha, campoTipoUsuario);
    }
});

// Exibir mensagem inicial na página de login
window.onload = function () {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "index.html") {
        let msg = "Usuários cadastrados para teste:\n\n";
        usuarios.forEach(user => {
            msg += `Usuário: ${user.nome}, Senha: ${user.senha}, Tipo: ${user.tipo}\n`;
        });
        alert(msg);
    }
};
