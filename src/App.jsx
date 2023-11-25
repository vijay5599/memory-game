import { useEffect, useState } from "react";
import "./App.css";
function generateRandomPairs(rows, cols) {
  const emojis = ["😀", "😎", "🚀", "🌈", "🎉", "🥶"]; // Add more emojis if needed
  const pairs = Array.from(
    { length: (rows * cols) / 2 },
    (_, index) => emojis[index % emojis.length]
  );
  const shuffledPairs = pairs.concat(pairs).sort(() => Math.random() - 0.5);
  return Array.from({ length: rows }, (_, rowIndex) =>
    shuffledPairs.slice(rowIndex * cols, (rowIndex + 1) * cols)
  );
}
function App() {
  const initialTimer = 60;
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(initialTimer);
  const [highScore, setHighScore] = useState(0);
  const rows = 3;
  const cols = 4;

  const [grid, setGrid] = useState(() => generateRandomPairs(rows, cols));
  // const [grid, setGrid] = useState([
  //   [0, 1, 2, 3],
  //   [3, 1, 2, 0],
  //   [4, 5, 4, 5],
  // ]);
  const [selectGrid, setSelectGrid] = useState([
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ]);
  // const [selectGrid, setSelectGrid] = useState(() => {
  //   const rows = 3;
  //   const cols = 4;
  //   return new Array(rows).fill(false).map(() => new Array(cols).fill(false));
  // });
  // const hasWon = grid.flat().every((isRevealed) => isRevealed);
  // console.log("hasWOn", hasWon);

  const [previousClick, setPreviousClick] = useState();
  function handleClick(rowIndex, colIndex) {
    if (selectGrid[rowIndex][colIndex]) return;
    const clickedNumber = grid[rowIndex][colIndex];
    let revealedGrid = [...selectGrid];
    revealedGrid[rowIndex][colIndex] = true;
    setSelectGrid(revealedGrid);

    if (previousClick) {
      const previousClickedNumber = grid[previousClick.row][previousClick.col];
      if (previousClickedNumber !== clickedNumber) {
        setTimeout(() => {
          revealedGrid[rowIndex][colIndex] = false;
          revealedGrid[previousClick.row][previousClick.col] = false;
          setSelectGrid([...revealedGrid]);
        }, 1000);
      } else {
        const hasWon = selectGrid.flat().every((isRevealed) => isRevealed);
        console.log("hasWOn", hasWon);
        if (hasWon) {
          setTimeout(() => {
            setGameWon(true);
            alert("You won!");
            resetGame();
            // setSelectGrid(() =>
            //   new Array(rows).fill(false).map(() => new Array(cols).fill(false))
            // );
            // setGrid(generateRandomPairs(rows, cols));
          });
        }
      }
      setPreviousClick(undefined);
    } else {
      setPreviousClick({ row: rowIndex, col: colIndex });
    }
  }

  useEffect(() => {
    let countdown;

    if (timer > 0 && !gameWon) {
      countdown = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && !gameWon) {
      // Reset the game after 30 seconds
      alert("Time's up! Game will reset.");
      resetGame();
    }

    return () => {
      clearTimeout(countdown);
    };
  }, [timer, gameWon]);

  const resetGame = () => {
    setTimer(initialTimer);
    if (timer > highScore) {
      setHighScore(timer);
    }
    setGameWon(false);
    setSelectGrid(() =>
      new Array(rows).fill(false).map(() => new Array(cols).fill(false))
    );
    setGrid(generateRandomPairs(rows, cols));
  };

  useEffect(() => {
    const storedHighdcore = JSON.parse(localStorage.getItem("highScore"));
    if (storedHighdcore) {
      setHighScore(storedHighdcore);
    }
    console.log(storedHighdcore);
  }, []);

  useEffect(() => {
    localStorage.setItem("highScore", JSON.stringify(highScore));
  }, [highScore]);

  return (
    <div>
      <h1 className="game">Memory Game </h1>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((number, colIndex) => (
              <div
                key={colIndex}
                className={selectGrid[rowIndex][colIndex] ? "revealed" : "card"}
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {selectGrid[rowIndex][colIndex] ? number : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      {gameWon && (
        <div>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
      <div>
        <p>Time left: {timer} seconds</p>
        <h1>High score : {highScore}</h1>
      </div>
    </div>
  );
}
export default App;
