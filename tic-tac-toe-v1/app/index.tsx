import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions, 
  Alert, 
  SafeAreaView, 
  Platform, 
  StatusBar 
} from 'react-native';

const { width } = Dimensions.get('window');

const BOARD_MARGIN_LATERAL = 40;
const BOARD_WIDTH = width - BOARD_MARGIN_LATERAL;
const CELL_MARGIN = 2.5;
const BOARD_PADDING = 5;

const SPACE_FOR_CELLS = BOARD_WIDTH - (2 * BOARD_PADDING) - (3 * 2 * CELL_MARGIN);
const CELL_SIZE = SPACE_FOR_CELLS / 3;

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [scores, setScores] = useState({ player: 0, computer: 0 });

  useEffect(() => {
    if (!isPlayerTurn && !checkWinner(board)) {
      const timer = setTimeout(() => computerMove(), 600);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn]);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.includes(null) ? null : 'Empate';
  };

  const handlePress = (index: number) => {
    if (board[index] || !isPlayerTurn || checkWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      finalizeGame(winner);
    } else {
      setIsPlayerTurn(false);
    }
  };

  const computerMove = () => {
    const emptyIndices = board.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null);
    if (emptyIndices.length === 0) return;

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...board];
    newBoard[randomIndex] = 'O';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      finalizeGame(winner);
    } else {
      setIsPlayerTurn(true);
    }
  };

  const finalizeGame = (winner: string | null) => {
    let title = '';
    let message = '';

    if (winner === 'X') {
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
      title = 'Vitória!';
      message = 'Você derrotou a máquina!';
    } else if (winner === 'O') {
      setScores(prev => ({ ...prev, computer: prev.computer + 1 }));
      title = 'Derrota';
      message = 'O computador foi mais rápido dessa vez.';
    } else {
      title = 'Empate';
      message = 'Jogo equilibrado!';
    }

    Alert.alert(title, message, [{ text: 'Jogar Novamente', onPress: resetBoard }]);
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Tic Tac Toe</Text>

        <View style={styles.scoreboard}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>User (X)</Text>
            <Text style={styles.scoreValue}>{scores.player}</Text>
          </View>
          <View style={[styles.scoreItem, styles.scoreSeparator]}>
            <Text style={styles.scoreLabel}>CPU (O)</Text>
            <Text style={styles.scoreValue}>{scores.computer}</Text>
          </View>
        </View>

        <View style={styles.board}>
          {board.map((cell, index) => (
            <TouchableOpacity
              key={index}
              style={styles.cell}
              onPress={() => handlePress(index)}
              activeOpacity={0.7}
              disabled={!isPlayerTurn || cell !== null}
            >
              <Text style={[
                styles.cellText, 
                { color: cell === 'X' ? '#0d9e00' : '#ff0000' }
              ]}>
                {cell}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={() => setScores({ player: 0, computer: 0 })}
        >
          <Text style={styles.resetText}>REINICIAR PLACAR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
  },
  scoreboard: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreSeparator: {
    borderLeftWidth: 1,
    borderLeftColor: '#ffffff',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  board: {
    width: BOARD_WIDTH,
    height: BOARD_WIDTH,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#181818',
    borderRadius: 15,
    padding: BOARD_PADDING,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#fff',
    margin: CELL_MARGIN,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cellText: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  resetButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ffffff',
    marginTop: 30,  
  },
  resetText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});