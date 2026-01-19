import { useMemo, useState } from "react";
import { BoardView } from "./components/BoardView";
import { GameStatus } from "./components/GameStatus";
import { TokenTray } from "./components/TokenTray";
import { useStoredGame } from "./hooks/useStoredGame";
import { applyMove, isInProgress } from "./model/game";
import "./styles/app.css";

export const App = () => {
  const { state, setState, reset } = useStoredGame();
  const [dragging, setDragging] = useState(false);
  const status = useMemo(
    () => ({
      winner: state.winner,
      isDraw: state.isDraw,
      currentPlayer: state.currentPlayer
    }),
    [state]
  );

  const handleDrop = (column: number) => {
    setState((prev) => applyMove(prev, column));
  };

  const handleNewGame = () => {
    if (isInProgress(state)) {
      const shouldReset = window.confirm(
        "Start a new game? Your current progress will be lost."
      );
      if (!shouldReset) return;
    }
    reset();
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Connect Four</h1>
        <button className="app__button" onClick={handleNewGame}>
          New Game
        </button>
      </header>
      <GameStatus {...status} />
      <TokenTray player={state.currentPlayer} setDragging={setDragging} />
      <BoardView
        board={state.board}
        currentPlayer={state.currentPlayer}
        dragging={dragging}
        onDropColumn={handleDrop}
      />
    </div>
  );
};
