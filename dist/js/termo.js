export class Termo {
    constructor() {
        this.palavras = ["ABRIR", "AMIGO", "BEBER", "BOLDO", "CAIXA", "CASAL", "CORPO", "DEDOS",
            "DENTE", "DIZER", "ERROS", "FALAR", "FESTA", "FOGAO", "GANHO", "GIRAR",
            "GRITO", "HORAS", "JOGOS", "JULHO", "LIMAO", "LOUCO", "MACAS", "MAIOR", "MELAO", "MOLHO"];
        let numeroAleatorio = Math.floor(Math.random() * 26) + 1;
        this.termoMisterioso = this.palavras[numeroAleatorio];
    }
}
//# sourceMappingURL=termo.js.map