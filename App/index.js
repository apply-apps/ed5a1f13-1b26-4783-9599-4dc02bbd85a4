// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button, Alert } from 'react-native';

const CELL_SIZE = 20;
const BOARD_SIZE = 15;

const getInitialSnake = () => [
  { x: 2, y: 2 },
  { x: 1, y: 2 },
  { x: 0, y: 2 },
];

const getRandomFoodPosition = (snake) => {
  let position;
  while (!position || snake.some(segment => segment.x === position.x && segment.y === position.y)) {
    position = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  }
  return position;
};

export default function App() {
  const [snake, setSnake] = useState(getInitialSnake());
  const [food, setFood] = useState(getRandomFoodPosition(snake));
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const intervalRef = useRef(null);

  const moveSnake = () => {
    setSnake(prevSnake => {
      const newHead = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y,
      };

      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(getRandomFoodPosition([...prevSnake, newHead]));
        return [newHead, ...prevSnake];
      } else {
        const newSnake = [newHead, ...prevSnake.slice(0, -1)];

        if (
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y >= BOARD_SIZE ||
          newSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          clearInterval(intervalRef.current);
          Alert.alert('Game Over', 'Better luck next time!', [{ text: 'Restart', onPress: resetGame }]);
        }

        return newSnake;
      }
    });
  };

  const resetGame = () => {
    setSnake(getInitialSnake());
    setFood(getRandomFoodPosition(snake));
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    intervalRef.current = setInterval(moveSnake, 200);
  };

  useEffect(() => {
    intervalRef.current = setInterval(moveSnake, 200);
    return () => clearInterval(intervalRef.current);
  }, []);

  const changeDirection = (newDirection) => {
    if (
      (direction.x !== 0 && newDirection.x !== 0) ||
      (direction.y !== 0 && newDirection.y !== 0)
    ) {
      return;
    }
    setDirection(newDirection);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Snake Game</Text>
      <View style={styles.board}>
        {Array.from({ length: BOARD_SIZE }).map((_, y) =>
          Array.from({ length: BOARD_SIZE }).map((_, x) => {
            const isSnakeCell = snake.some(segment => segment.x === x && segment.y === y);
            const isFoodCell = food.x === x && food.y === y;
            return (
              <View
                key={`${x}-${y}`}
                style={[
                  styles.cell,
                  isSnakeCell && styles.snake,
                  isFoodCell && styles.food,
                ]}
              />
            );
          })
        )}
      </View>
      <View style={styles.controls}>
        <Button title="Up" onPress={() => changeDirection({ x: 0, y: -1 })} />
        <View style={styles.row}>
          <Button title="Left" onPress={() => changeDirection({ x: -1, y: 0 })} />
          <Button title="Right" onPress={() => changeDirection({ x: 1, y: 0 })} />
        </View>
        <Button title="Down" onPress={() => changeDirection({ x: 0, y: 1 })} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  board: {
    width: CELL_SIZE * BOARD_SIZE,
    height: CELL_SIZE * BOARD_SIZE,
    backgroundColor: '#f0f0f0',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  snake: {
    backgroundColor: '#00f',
  },
  food: {
    backgroundColor: '#f00',
  },
  controls: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CELL_SIZE * 3,
    marginBottom: 10,
  },
});