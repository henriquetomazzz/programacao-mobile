import { Peca } from "./Enum";

export class Jogador {
  constructor(protected nome: string, protected vitorias: number = 0) {}

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
    let melhorPontuacao = -Infinity;
    let jogada: [number, number] = [-1, -1];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (tabuleiro[i][j] === null) {
          tabuleiro[i][j] = Peca.Circulo;
          const pontuacao = this.minimax(tabuleiro, 0, false);
          tabuleiro[i][j] = null;

          if (pontuacao > melhorPontuacao) {
            melhorPontuacao = pontuacao;
            jogada = [i, j];
          }
        }
      }
    }
    return jogada;
  }

  private minimax(tabuleiro: (Peca | null)[][], profundidade: number, ehMaximizador: boolean): number {
    const resultado = this.avaliarTabuleiro(tabuleiro);
    
    if (resultado !== null) {
      if (resultado === 'VitoriaCPU') return 10 - profundidade;
      if (resultado === 'VitoriaHumano') return profundidade - 10;
      return 0;
    }

    if (ehMaximizador) {
      let melhor = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (tabuleiro[i][j] === null) {
            tabuleiro[i][j] = Peca.Circulo;
            melhor = Math.max(melhor, this.minimax(tabuleiro, profundidade + 1, false));
            tabuleiro[i][j] = null;
          }
        }
      }
      return melhor;
    } else {
      let melhor = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (tabuleiro[i][j] === null) {
            tabuleiro[i][j] = Peca.Xis;
            melhor = Math.min(melhor, this.minimax(tabuleiro, profundidade + 1, true));
            tabuleiro[i][j] = null;
          }
        }
      }
      return melhor;
    }
  }

  private avaliarTabuleiro(t: (Peca | null)[][]): string | null {
    const linhas = [
      [[0,0], [0,1], [0,2]], [[1,0], [1,1], [1,2]], [[2,0], [2,1], [2,2]],
      [[0,0], [1,0], [2,0]], [[0,1], [1,1], [2,1]], [[0,2], [1,2], [2,2]],
      [[0,0], [1,1], [2,2]], [[0,2], [1,1], [2,0]]
    ];

    for (const combo of linhas) {
      const [a, b, c] = combo;
      if (t[a[0]][a[1]] && t[a[0]][a[1]] === t[b[0]][b[1]] && t[a[0]][a[1]] === t[c[0]][c[1]]) {
        return t[a[0]][a[1]] === Peca.Circulo ? 'VitoriaCPU' : 'VitoriaHumano';
      }
    }

    const disponivel = t.some(linha => linha.some(celula => celula === null));
    return !disponivel ? 'Empate' : null;
  }
}
