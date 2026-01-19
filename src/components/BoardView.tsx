import type { RefObject } from "react";
import { Board, Player } from "../model/board";
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
  currentPlayer,
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
      aria-label="Connect Four board"
    >
      {board[0].map((_, colIndex) => (
        <div
          key={`column-${colIndex}`}
          className="board__column"
          role="button"
          tabIndex={0}
          aria-label={`Drop ${currentPlayer} piece in column ${colIndex + 1}`}
          data-testid={`column-${colIndex}`}
          onClick={() => onDropColumn(colIndex)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onDropColumn(colIndex);
            }
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
