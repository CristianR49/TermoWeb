import { LocalStorageService } from "./services/local-storage.service.js";
import { Termo } from "./dominio/termo.js";

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
  localStorageService: LocalStorageService;
  btnExibirHistorico: HTMLButtonElement;
  pnlHistorico: HTMLDivElement;
  

  constructor()
  {
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

  registrarElementos()
  {
    this.pnlTermo = document.getElementById("pnlTermo") as HTMLDivElement;
    this.pnlTeclado = document.getElementById("pnlTeclado") as HTMLDivElement;
    this.txtNotificacao = document.getElementById("txtNotificacao") as HTMLDivElement;
    this.btnExibirHistorico = document.getElementById('btnExibirHistorico') as HTMLButtonElement;
    this.pnlHistorico = document.getElementById('pnlHistorico') as HTMLDivElement;
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
        botao.addEventListener("click", (sender) => this.Enter(sender));
      }
      if (botao.textContent == "Recomeçar")
      {
        botao.addEventListener("click", (sender) => this.recomecar(sender));
      }   
    }
    this.btnExibirHistorico.addEventListener('click', () => {
      this.pnlHistorico.style.display = 'grid';
    });
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (!this.pnlHistorico.contains(target) && event.target != this.btnExibirHistorico)
        this.pnlHistorico.style.display = 'none';
    });
  }

  darPalpite(sender: Event): void 
  {

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

    this.txtNotificacao.textContent = "";
    
    this.atualizarVariaveis()

    this.tentativafoiAvaliada = false;
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
      
    }
  }

  Enter(sender : Event)
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
   }
   this.termo.registrarTetativas();
   
    if (this.pontos == 5)
      {
        this.vitoria();
        return;
      }
    if (this.posLinhaAtual == 4 && this.posColunaAtual == 5)
      {
        this.derrota();
      }
   this.pontos = 0;
  }

  vitoria() 
  {
    
    this.termo.registrarVitoria();
    this.localStorageService.salvarDados(this.termo.historico);
    this.termo.tentativas = 0;
    
    this.txtNotificacao.textContent = "Você Venceu! A palavra era: " + this.termo.termoMisterioso;
    this.txtNotificacao.style.color = "green";

    this.tecladoApenasBotaoRecomecar();
  }

  derrota() 
  {
    
    this.termo.registrarDerrota();
    this.localStorageService.salvarDados(this.termo.historico);
    this.termo.tentativas = 0;
    
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

  recomecar(sender : Event)
  {
    this.termo = new Termo(this.localStorageService.carregarDados());
    this.termo.tentativas = 0;
    this.txtNotificacao.style.color = "white";
    this.posColunaAtual = 0;
    this.posLinhaAtual = 0;
    this.pontos = 0;
    this.tentativa = [];
    this.txtNotificacao.textContent = "";

    for (let divLinha of this.pnlTermo.children)
    {
        for (let divLetra of divLinha.children)
      {
        (divLetra as HTMLDivElement).style.backgroundColor = "#bebebe";

        (divLetra as HTMLDivElement).textContent = "";
      }
    }

    for (let botao of this.pnlTeclado.children)
    {
      (botao as HTMLButtonElement).disabled = false;
    }
  }

  private popularEstatisticas()
  {
    const lblJogos = document.getElementById('lblJogos') as HTMLParagraphElement;
    const lblVitorias = document.getElementById('lblVitorias') as HTMLParagraphElement;
    const lblDerrotas = document.getElementById('lblDerrotas') as HTMLParagraphElement;
    const lblSequencia = document.getElementById('lblSequencia') as HTMLParagraphElement;

    lblJogos.textContent = this.termo.historico.jogos.toString();
    lblVitorias.textContent = this.termo.historico.vitorias.toString();
    lblDerrotas.textContent = this.termo.historico.derrotas.toString();
    lblSequencia.textContent = this.termo.historico.sequencia.toString();
  }

  private desenharGridTentativas(): void {
    const elementos = Array.from(document.querySelectorAll('.valor-tentativa')) as HTMLParagraphElement[];
    
    const tentativas = this.termo.historico.tentativas;

    for (let i = 0; i < tentativas.length; i++) {
      const label = elementos[i];
      const qtdTentativas = tentativas[i];

      label.textContent = qtdTentativas.toString();

      let tamanho: number = 0;

      if (qtdTentativas > 0 && this.termo.historico.vitorias > 0)
        tamanho = qtdTentativas / this.termo.historico.vitorias;
      else
        tamanho = 0.05;

      const novoTamanho = tamanho * 100;      
      label.style.width = `${(novoTamanho).toString()}%`;
    }
  }

  private resetarHistorico() 
  {
    this.termo.historico.jogos = 0;
    this.termo.historico.vitorias = 0;
    this.termo.historico.derrotas = 0;
    this.termo.historico.sequencia = 0;
    this.termo.historico.tentativas = [0, 0, 0, 0, 0]
  }
  
}
window.addEventListener("load", () => new TelaTermo());
