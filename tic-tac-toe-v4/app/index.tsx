import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Peca, SituacaoPartida } from "../src/models/Enum";
import { Jogador, JogadorAutomatizado } from "../src/models/Jogador";
import { Jogo } from "../src/models/Jogo";
import { Partida } from "../src/models/Partida";

const { width } = Dimensions.get("window");
const BOARD_WIDTH = width - 40;
const CELL_SIZE = (BOARD_WIDTH - 10 - 15) / 3;

export default function App() {
  const [jogo] = useState(
    new Jogo(new Jogador("User"), new JogadorAutomatizado()),
  );
  const [partida, setPartida] = useState<Partida>(jogo.iniciaPartida());

  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    if (
      !partida.getVezJogador1() &&
      partida.verificaFim() === SituacaoPartida.EmAndamento
    ) {
      const cpu = jogo.getJogador2() as JogadorAutomatizado;
      const timer = setTimeout(() => {
        const [l, c] = cpu.realizaJogada(partida.getTabuleiro());
        partida.joga(l, c);
        checkGameState();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [partida.getVezJogador1()]);

  const checkGameState = () => {
    const status = partida.verificaFim();
    forceUpdate();

    if (status !== SituacaoPartida.EmAndamento) {
      let title = "";
      if (status === SituacaoPartida.VitoriaJogador1) {
        jogo.getJogador1().adicionaVitoria();
        title = "Vitória!";
      } else if (status === SituacaoPartida.VitoriaJogador2) {
        jogo.getJogador2().adicionaVitoria();
        title = "Derrota";
      } else {
        title = "Empate";
      }

      jogo.incrementaPartidas();
      Alert.alert(title, "Deseja jogar novamente?", [
        { text: "Sim", onPress: () => setPartida(jogo.iniciaPartida()) },
      ]);
    }
  };

  const handlePress = (l: number, c: number) => {
    if (
      !partida.getVezJogador1() ||
      partida.verificaFim() !== SituacaoPartida.EmAndamento
    )
      return;

    if (partida.joga(l, c)) {
      checkGameState();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Tic Tac Toe</Text>

        <View style={styles.scoreboard}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>
              {jogo.getJogador1().getNome()} (X)
            </Text>
            <Text style={styles.scoreValue}>
              {jogo.getJogador1().getVitorias()}
            </Text>
          </View>
          <View style={[styles.scoreItem, styles.scoreSeparator]}>
            <Text style={styles.scoreLabel}>
              {jogo.getJogador2().getNome()} (O)
            </Text>
            <Text style={styles.scoreValue}>
              {jogo.getJogador2().getVitorias()}
            </Text>
          </View>
        </View>

        <View style={styles.board}>
          {partida.getTabuleiro().map((linha, i) =>
            linha.map((celula, j) => (
              <TouchableOpacity
                key={`${i}-${j}`}
                style={styles.cell}
                onPress={() => handlePress(i, j)}
                activeOpacity={0.7}
                disabled={!partida.getVezJogador1() || celula !== null}
              >
                <Text
                  style={[
                    styles.cellText,
                    { color: celula === Peca.Xis ? "#0d9e00" : "#ff0000" },
                  ]}
                >
                  {celula}
                </Text>
              </TouchableOpacity>
            )),
          )}
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            jogo.reiniciaJogo();
            setPartida(jogo.iniciaPartida());
          }}
        >
          <Text style={styles.resetText}>REINICIAR TUDO</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 1,
  },
  scoreboard: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#181818",
    borderRadius: 20,
    padding: 20,
  },
  scoreItem: { flex: 1, alignItems: "center" },
  scoreSeparator: { borderLeftWidth: 1, borderLeftColor: "#333" },
  scoreLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 5,
  },
  scoreValue: { fontSize: 32, fontWeight: "bold", color: "#ffffff" },
  board: {
    width: BOARD_WIDTH,
    height: BOARD_WIDTH,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#181818",
    borderRadius: 15,
    padding: 5,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: "#fff",
    margin: 2.5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  cellText: { fontSize: 42, fontWeight: "bold" },
  resetButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ffffff",
    marginTop: 30,
  },
  resetText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
