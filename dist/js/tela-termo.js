import { LocalStorageService } from "./services/local-storage.service.js";
import { Termo } from "./dominio/termo.js";
class TelaTermo {
    constructor() {
        this.tentativafoiAvaliada = false;
        this.localStorageService = new LocalStorageService();
        this.termo = new Termo(this.localStorageService.carregarDados());
        this.termo.tentativas = 0;
        this.posColunaAtual = 0;
        this.posLinhaAtual = 0;
        this.pontos = 0;
        this.registrarElementos();
        this.registrarEventos();
        this.popularEstatisticas();
        this.desenharGridTentativas();
    }
    registrarElementos() {
        this.pnlTermo = document.getElementById("pnlTermo");
        this.pnlTeclado = document.getElementById("pnlTeclado");
        this.txtNotificacao = document.getElementById("txtNotificacao");
        this.btnExibirHistorico = document.getElementById('btnExibirHistorico');
        this.pnlHistorico = document.getElementById('pnlHistorico');
    }
    registrarEventos() {
        for (let botao of this.pnlTeclado.children) {
            if (botao.textContent != "Enter") {
                if (botao.textContent != "Recomeçar") {
                    botao.addEventListener("click", (sender) => this.darPalpite(sender));
                }
            }
            if (botao.textContent == "Enter") {
                botao.addEventListener("click", (sender) => this.Enter(sender));
            }
            if (botao.textContent == "Recomeçar") {
                botao.addEventListener("click", (sender) => this.recomecar(sender));
            }
        }
        this.btnExibirHistorico.addEventListener('click', () => {
            this.pnlHistorico.style.display = 'grid';
        });
        document.addEventListener('click', (event) => {
            const target = event.target;
            if (!this.pnlHistorico.contains(target) && event.target != this.btnExibirHistorico)
                this.pnlHistorico.style.display = 'none';
        });
    }
    darPalpite(sender) {
        var _a;
        let divLinhaAtual;
        let divLetraAtual;
        divLinhaAtual = this.pnlTermo.children[this.posLinhaAtual];
        let botaoClicado = sender.target;
        let chute = ((_a = botaoClicado.textContent) === null || _a === void 0 ? void 0 : _a[0]) || "null";
        if (this.posColunaAtual < 5) {
            divLetraAtual = divLinhaAtual.children[this.posColunaAtual];
            divLetraAtual.textContent = chute;
        }
        this.txtNotificacao.textContent = "";
        this.atualizarVariaveis();
        this.tentativafoiAvaliada = false;
    }
    atualizarVariaveis() {
        if (this.posColunaAtual == 5 && this.tentativafoiAvaliada) {
            this.posColunaAtual++;
        }
        else if (this.posColunaAtual < 5) {
            this.posColunaAtual++;
        }
        if (this.posColunaAtual == 6) {
            this.posColunaAtual = 0;
            this.posLinhaAtual++;
            this.pontos = 0;
        }
    }
    Enter(sender) {
        let divLinhaAtual;
        divLinhaAtual = this.pnlTermo.children[this.posLinhaAtual];
        if (this.posColunaAtual < 5) {
            this.txtNotificacao.textContent = "Linha com no mínimo 5 letras";
            return;
        }
        this.txtNotificacao.textContent = "";
        this.avaliarTentativa(this.tentativafoiAvaliada, divLinhaAtual);
        this.tentativafoiAvaliada = true;
        this.atualizarVariaveis();
    }
    avaliarTentativa(tentativaAvaliada, divLinhaAtual) {
        for (let i = 0; i < 5; i++) {
            let divLetraAtual = divLinhaAtual.children[i];
            if (divLetraAtual.textContent == this.termo.termoMisterioso[i]) {
                divLetraAtual.style.backgroundColor = "green";
                this.pontos++;
            }
            else if (this.termo.termoMisterioso.includes(divLetraAtual.textContent)) {
                divLetraAtual.style.backgroundColor = "yellow";
            }
            else {
                divLetraAtual.style.backgroundColor = "red";
                for (let botao of this.pnlTeclado.children) {
                    if (botao.textContent == divLetraAtual.textContent) {
                        botao.disabled = true;
                    }
                }
            }
        }
        this.termo.registrarTetativas();
        if (this.pontos == 5) {
            this.vitoria();
            return;
        }
        if (this.posLinhaAtual == 4 && this.posColunaAtual == 5) {
            this.derrota();
        }
        this.pontos = 0;
    }
    vitoria() {
        this.termo.registrarVitoria();
        this.localStorageService.salvarDados(this.termo.historico);
        this.termo.tentativas = 0;
        this.txtNotificacao.textContent = "Você Venceu! A palavra era: " + this.termo.termoMisterioso;
        this.txtNotificacao.style.color = "green";
        this.tecladoApenasBotaoRecomecar();
    }
    derrota() {
        this.termo.registrarDerrota();
        this.localStorageService.salvarDados(this.termo.historico);
        this.termo.tentativas = 0;
        this.txtNotificacao.textContent = "Você Perdeu! A palavra era: " + this.termo.termoMisterioso;
        this.txtNotificacao.style.color = "red";
        this.tecladoApenasBotaoRecomecar();
    }
    tecladoApenasBotaoRecomecar() {
        for (let botao of this.pnlTeclado.children) {
            if (botao.textContent != "Recomeçar") {
                botao.disabled = true;
            }
        }
    }
    recomecar(sender) {
        this.termo = new Termo(this.localStorageService.carregarDados());
        this.termo.tentativas = 0;
        this.txtNotificacao.style.color = "white";
        this.posColunaAtual = 0;
        this.posLinhaAtual = 0;
        this.pontos = 0;
        this.tentativa = [];
        this.txtNotificacao.textContent = "";
        for (let divLinha of this.pnlTermo.children) {
            for (let divLetra of divLinha.children) {
                divLetra.style.backgroundColor = "#bebebe";
                divLetra.textContent = "";
            }
        }
        for (let botao of this.pnlTeclado.children) {
            botao.disabled = false;
        }
    }
    popularEstatisticas() {
        const lblJogos = document.getElementById('lblJogos');
        const lblVitorias = document.getElementById('lblVitorias');
        const lblDerrotas = document.getElementById('lblDerrotas');
        const lblSequencia = document.getElementById('lblSequencia');
        lblJogos.textContent = this.termo.historico.jogos.toString();
        lblVitorias.textContent = this.termo.historico.vitorias.toString();
        lblDerrotas.textContent = this.termo.historico.derrotas.toString();
        lblSequencia.textContent = this.termo.historico.sequencia.toString();
    }
    desenharGridTentativas() {
        const elementos = Array.from(document.querySelectorAll('.valor-tentativa'));
        const tentativas = this.termo.historico.tentativas;
        for (let i = 0; i < tentativas.length; i++) {
            const label = elementos[i];
            const qtdTentativas = tentativas[i];
            label.textContent = qtdTentativas.toString();
            let tamanho = 0;
            if (qtdTentativas > 0 && this.termo.historico.vitorias > 0)
                tamanho = qtdTentativas / this.termo.historico.vitorias;
            else
                tamanho = 0.05;
            const novoTamanho = tamanho * 100;
            label.style.width = `${(novoTamanho).toString()}%`;
        }
    }
    resetarHistorico() {
        this.termo.historico.jogos = 0;
        this.termo.historico.vitorias = 0;
        this.termo.historico.derrotas = 0;
        this.termo.historico.sequencia = 0;
        this.termo.historico.tentativas = [0, 0, 0, 0, 0];
    }
}
window.addEventListener("load", () => new TelaTermo());
//# sourceMappingURL=tela-termo.js.map