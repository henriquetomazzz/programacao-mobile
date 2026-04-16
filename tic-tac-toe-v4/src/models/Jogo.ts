import { Jogador } from './Jogador';
import { Partida } from './Partida';

export class Jogo {
  private numeroPartidas: number = 0;
  private jogador1: Jogador;
  private jogador2: Jogador;

  constructor(j1: Jogador, j2: Jogador) {
    this.jogador1 = j1;
    this.jogador2 = j2;
  }

  getJogador1() { return this.jogador1; }
  getJogador2() { return this.jogador2; }
  getNumeroPartidas() { return this.numeroPartidas; }

  incrementaPartidas() { this.numeroPartidas++; }

  iniciaPartida(): Partida {
    return new Partida(this.jogador1, this.jogador2);
  }

  reiniciaJogo(): void {
    this.numeroPartidas = 0;
    this.jogador1.reinicia();
    this.jogador2.reinicia();
  }
}