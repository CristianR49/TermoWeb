import { HistoricoUsuario } from "../dominio/historico-usuario.js";

export class LocalStorageService{

  endereco = "Termo";

  salvarDados(historico : HistoricoUsuario): void 
  {
    let jsonString = JSON.stringify(historico);

    localStorage.setItem(this.endereco,jsonString);

  }

  carregarDados(): HistoricoUsuario
  {
    const dadosJson = localStorage.getItem(this.endereco);
    
    if (dadosJson)
      return JSON.parse(dadosJson) as HistoricoUsuario;

    return new HistoricoUsuario();
  }
}
