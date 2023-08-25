import { Termo } from "./termo.js";

class TelaTermo
{
  pnlTermo : HTMLDivElement;
  pnlTeclado : HTMLDivElement;
  txtNotificacao : HTMLDivElement
  posLinhaAtual : number;
  posColunaAtual : number;
  termo : Termo;
  pontos : number;
  tentativa : string[];
  tentativafoiAvaliada : boolean = false;
  constructor()
  {
    this.posColunaAtual = 0;
    this.posLinhaAtual = 0;
    console.log("teste")

    this.termo = new Termo();
    this.pontos = 0;
    this.registrarElementos();
    this.registrarEventos();
    
  }

  registrarElementos()
  {
    this.pnlTermo = document.getElementById("pnlTermo") as HTMLDivElement;
    this.pnlTeclado = document.getElementById("pnlTeclado") as HTMLDivElement;
    this.txtNotificacao = document.getElementById("txtNotificacao") as HTMLDivElement;
  }

  registrarEventos()
  {
    for (let botao of this.pnlTeclado.children)
    {
      if (botao.textContent != "Enter")
      {
        if (botao.textContent != "Recomeçar")
        {
          botao.addEventListener("click", (sender) => this.darPalpite(sender));  
        }
      }
      if (botao.textContent == "Enter")
      {
        botao.addEventListener("click", (sender) => this.acionarEnter(sender));
      }
      if (botao.textContent == "Recomeçar")
      {
        botao.addEventListener("click", (sender) => this.acionarRecomecar(sender));
      }
      
    }

  }

  darPalpite(sender: Event): void 
  {
    console.log("colunainicio" + this.posColunaAtual);

    let divLinhaAtual : HTMLDivElement;
    let divLetraAtual: HTMLDivElement;
    
    divLinhaAtual = this.pnlTermo.children[this.posLinhaAtual] as HTMLDivElement;

    let botaoClicado = sender.target as HTMLButtonElement;

    let chute : string = botaoClicado.textContent?.[0] || "null"

    if (this.posColunaAtual < 5)
    {
      divLetraAtual = divLinhaAtual.children[this.posColunaAtual] as HTMLDivElement;
      divLetraAtual.textContent = chute;
    }


    console.log(botaoClicado.textContent);

    
    this.txtNotificacao.textContent = "";
    
    this.atualizarVariaveis()

    this.tentativafoiAvaliada = false;
    console.log("colunafinal" + this.posColunaAtual);
  }

  atualizarVariaveis()
  {
    if (this.posColunaAtual == 5 && this.tentativafoiAvaliada)
    {
      this.posColunaAtual++;
    }    
    else if (this.posColunaAtual < 5)
    {
      this.posColunaAtual++;
    }

    if (this.posColunaAtual == 6)
    {
      this.posColunaAtual = 0;
      this.posLinhaAtual++;
      this.pontos = 0;
      console.log("linha" + this.posLinhaAtual);
      if (this.posLinhaAtual == 5)
      {
        this.derrota();
      }
      
    }
  }

  acionarEnter(sender : Event)
  {
    let divLinhaAtual : HTMLDivElement;

    divLinhaAtual = this.pnlTermo.children[this.posLinhaAtual] as HTMLDivElement;

    if (this.posColunaAtual < 5)
      {
        this.txtNotificacao.textContent = "Linha com no mínimo 5 letras"
        return;
      }
      this.txtNotificacao.textContent = "";
      this.avaliarTentativa(this.tentativafoiAvaliada, divLinhaAtual);
      this.tentativafoiAvaliada = true;

      this.atualizarVariaveis()
  }

  acionarRecomecar(sender : Event)
  {
    this.recomecar();
  }


  avaliarTentativa(tentativaAvaliada : boolean, divLinhaAtual : HTMLDivElement)
  {
    for (let i = 0; i < 5; i++)
    {
      let divLetraAtual = divLinhaAtual.children[i] as HTMLDivElement;
      
      if (divLetraAtual.textContent == this.termo.termoMisterioso[i])
      {
        divLetraAtual.style.backgroundColor = "green";
        this.pontos++;
      }
      else if (this.termo.termoMisterioso.includes(divLetraAtual.textContent as string))
      {
        divLetraAtual.style.backgroundColor = "yellow";
      }
      else
      {
        divLetraAtual.style.backgroundColor = "red";

        for (let botao of this.pnlTeclado.children)
        {
          if (botao.textContent == divLetraAtual.textContent)
          {
            (botao as HTMLButtonElement).disabled = true;
          }
        }          
      }
    
      if (this.pontos == 5)
      {
        this.vitoria();
        return;
      }
   }
   this.pontos = 0;
  }

  vitoria() 
  {
    this.txtNotificacao.textContent = "Você Venceu! A palavra era: " + this.termo.termoMisterioso;
    this.txtNotificacao.style.color = "green";

    this.tecladoApenasBotaoRecomecar();
  }

  derrota() 
  {
    this.txtNotificacao.textContent = "Você Perdeu! A palavra era: " + this.termo.termoMisterioso;
    this.txtNotificacao.style.color = "red";
    this.tecladoApenasBotaoRecomecar();
  }

  tecladoApenasBotaoRecomecar()
  {
    for (let botao of this.pnlTeclado.children)
    {
      if (botao.textContent != "Recomeçar")
      {
        (botao as HTMLButtonElement).disabled = true;
      }
    }
  }

  recomecar()
  {
    this.txtNotificacao.style.color = "white";
    this.termo = new Termo();
    this.posColunaAtual = 0;
    this.posLinhaAtual = 0;
    this.pontos = 0;
    this.tentativa = [];
    this.txtNotificacao.textContent = "";

    for (let divLinha of this.pnlTermo.children)
    {
        for (let divLetra of divLinha.children)
      {
        (divLetra as HTMLDivElement).style.backgroundColor = "bebebe";
        (divLetra as HTMLDivElement).textContent = "";
      }
    }

    for (let botao of this.pnlTeclado.children)
    {
      (botao as HTMLButtonElement).disabled = false;
    }
  }
  
}
window.addEventListener("load", () => new TelaTermo());