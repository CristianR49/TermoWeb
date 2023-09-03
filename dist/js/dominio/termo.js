export class Termo {
    get historico() {
        return this._historico;
    }
    constructor(historico) {
        this.palavras = ["ABRIR", "AMIGO", "BEBER", "BOLDO", "CAIXA", "CASAL", "CORPO", "DEDOS",
            "DENTE", "DIZER", "ERROS", "FALAR", "FESTA", "FOGAO", "GANHO", "GIRAR",
            "GRITO", "HORAS", "JOGOS", "JULHO", "LIMAO", "LOUCO", "MACAS", "MAIOR", "MELAO", "MOLHO"];
        this._historico = historico;
        let numeroAleatorio = Math.floor(Math.random() * 25) + 1;
        this.termoMisterioso = this.palavras[numeroAleatorio];
        console.log(this.termoMisterioso);
    }
    registrarTetativas() {
        this.tentativas++;
    }
    registrarVitoria() {
        this.historico.jogos++;
        this.historico.vitorias++;
        this.historico.sequencia++;
        this.historico.tentativas[this.tentativas - 1]++;
    }
    registrarDerrota() {
        this.historico.jogos++;
        this.historico.derrotas++;
        this.historico.sequencia = 0;
        this.historico.tentativas[this.tentativas - 1]++;
    }
}
//# sourceMappingURL=termo.js.map