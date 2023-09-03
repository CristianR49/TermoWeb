import { HistoricoUsuario } from "../dominio/historico-usuario.js";
export class LocalStorageService {
    constructor() {
        this.endereco = "Termo";
    }
    salvarDados(historico) {
        let jsonString = JSON.stringify(historico);
        localStorage.setItem(this.endereco, jsonString);
    }
    carregarDados() {
        const dadosJson = localStorage.getItem(this.endereco);
        if (dadosJson)
            return JSON.parse(dadosJson);
        return new HistoricoUsuario();
    }
}
//# sourceMappingURL=local-storage.service.js.map