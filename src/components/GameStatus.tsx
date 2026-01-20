import { createPortal } from "react-dom";
import { Player } from "../model/board";

type GameStatusProps = {
  winner: Player | null;
  isDraw: boolean;
  currentPlayer: Player;
};

export const GameStatus = ({
  winner,
  isDraw,
  currentPlayer
}: GameStatusProps) => {
  const isWinner = Boolean(winner);
  const turnMessage = `${currentPlayer}'s turn`;
  const winMessage = winner ? `${winner} Wins!` : "";
  let message = turnMessage;
  if (winner) message = winMessage;
  if (isDraw) message = "It's a draw.";

  const celebrationEmojis = ["🎉", "🎊", "🥳", "✨", "🎈", "🎉", "🎊", "🥳"];

  return (
    <div className="status-host">
      <div
        className={`status${isWinner ? " status--placeholder" : ""}`}
        data-testid="game-status"
      >
        <span className="status__message" data-testid="game-status-message">
          {message}
        </span>
      </div>
      {isWinner && typeof document !== "undefined"
        ? createPortal(
            <div
              className={`status status--win status--overlay status--win-${winner?.toLowerCase()}`}
              aria-live="polite"
            >
              <span className="status__message">{winMessage}</span>
              <div className="status__confetti" aria-hidden="true">
                {celebrationEmojis.map((emoji, index) => (
                  <span
                    key={`${emoji}-${index}`}
                    className="status__confetti-item"
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
};
