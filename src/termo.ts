export class Termo
{
  termoMisterioso : string;
  palavras = ["ABRIR", "AMIGO", "BEBER", "BOLDO", "CAIXA", "CASAL", "CORPO", "DEDOS", 
  "DENTE", "DIZER", "ERROS", "FALAR", "FESTA", "FOGAO", "GANHO", "GIRAR", 
  "GRITO", "HORAS", "JOGOS", "JULHO", "LIMAO", "LOUCO", "MACAS", "MAIOR", "MELAO", "MOLHO"];
  constructor()
  {
    let numeroAleatorio = Math.floor(Math.random() * 26) + 1;

    this.termoMisterioso = this.palavras[numeroAleatorio];
  }

}