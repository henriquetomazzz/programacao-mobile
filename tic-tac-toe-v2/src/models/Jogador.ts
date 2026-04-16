import { Peca } from "./Enum";

export class Jogador {
  constructor(private nome: string, private vitorias: number = 0) {}

  getNome(): string { return this.nome; }
  getVitorias(): number { return this.vitorias; }
  adicionaVitoria(): void { this.vitorias++; }
  reinicia(): void { this.vitorias = 0; }
}

export class JogadorAutomatizado extends Jogador {
  constructor() {
    super('CPU');
  }

  realizaJogada(tabuleiro: (Peca | null)[][]): [number, number] {
    const disponiveis: [number, number][] = [];
    tabuleiro.forEach((linha, i) => {
      linha.forEach((celula, j) => {
        if (celula === null) disponiveis.push([i, j]);
      });
    });

    const index = Math.floor(Math.random() * disponiveis.length);
    return disponiveis[index];
  }
}