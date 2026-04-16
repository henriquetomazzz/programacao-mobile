import { Jogador } from './Jogador';
import { Peca, SituacaoPartida } from './Enum';

export class Partida {
  private tabuleiro: (Peca | null)[][];
  private vezJogador1: boolean = true;

  constructor(private jogador1: Jogador, private jogador2: Jogador) {
    this.tabuleiro = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
  }

  getJogador1() { return this.jogador1; }
  getJogador2() { return this.jogador2; }
  getTabuleiro() { return this.tabuleiro; }
  getVezJogador1() { return this.vezJogador1; }

  joga(linha: number, coluna: number): boolean {
    if (this.tabuleiro[linha][coluna] !== null) return false;
    
    this.tabuleiro[linha][coluna] = this.vezJogador1 ? Peca.Xis : Peca.Circulo;
    this.vezJogador1 = !this.vezJogador1;
    return true;
  }

  verificaFim(): SituacaoPartida {
    const t = this.tabuleiro;
    const combinacoes = [
      // Linhas
      [[0,0], [0,1], [0,2]], [[1,0], [1,1], [1,2]], [[2,0], [2,1], [2,2]],
      // Colunas
      [[0,0], [1,0], [2,0]], [[0,1], [1,1], [2,1]], [[0,2], [1,2], [2,2]],
      // Diagonais
      [[0,0], [1,1], [2,2]], [[0,2], [1,1], [2,0]]
    ];

    for (const combo of combinacoes) {
      const [a, b, c] = combo;
      if (t[a[0]][a[1]] && t[a[0]][a[1]] === t[b[0]][b[1]] && t[a[0]][a[1]] === t[c[0]][c[1]]) {
        return t[a[0]][a[1]] === Peca.Xis ? SituacaoPartida.VitoriaJogador1 : SituacaoPartida.VitoriaJogador2;
      }
    }

    const empate = t.every(linha => linha.every(celula => celula !== null));
    return empate ? SituacaoPartida.Empate : SituacaoPartida.EmAndamento;
  }
}