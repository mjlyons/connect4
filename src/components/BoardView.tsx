import type { RefObject } from "react";
import type { Board, Player } from "../model/board";
import { CellView } from "./CellView";

type BoardViewProps = {
  board: Board;
  currentPlayer: Player;
  dragging: boolean;
  lastMove: { row: number; column: number } | null;
  boardRef: RefObject<HTMLDivElement>;
  onDropColumn: (column: number) => void;
};

export const BoardView = ({
  board,
  dragging,
  lastMove,
  boardRef,
  onDropColumn
}: BoardViewProps) => {
  return (
    <div
      ref={boardRef}
      className="board"
      role="grid"
      aria-label="Connect Fjord board"
    >
      {board[0].map((_, colIndex) => (
        <div
          key={`column-${colIndex}`}
          className="board__column"
          role="presentation"
          data-testid={`column-${colIndex}`}
          onClick={() => {
            if (dragging) return;
            onDropColumn(colIndex);
          }}
          onDragOver={(event) => {
            if (dragging) event.preventDefault();
          }}
          onDrop={(event) => {
            event.preventDefault();
            onDropColumn(colIndex);
          }}
        >
          {board.map((row, rowIndex) => (
            <CellView
              key={`cell-${rowIndex}-${colIndex}`}
              value={row[colIndex]}
              animate={
                lastMove?.row === rowIndex && lastMove.column === colIndex
              }
              dropRows={rowIndex + 1}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
