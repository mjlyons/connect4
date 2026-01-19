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
  let message = `${currentPlayer}'s turn`;
  if (winner) message = `${winner} Wins!`;
  if (isDraw) message = "It's a draw.";

  const celebrationEmojis = ["🎉", "🎊", "🥳", "✨", "🎈", "🎉", "🎊", "🥳"];

  return (
    <div
      className={`status${isWinner ? " status--win" : ""}`}
      data-testid="game-status"
    >
      <span className="status__message">{message}</span>
      {isWinner && (
        <div className="status__confetti" aria-hidden="true">
          {celebrationEmojis.map((emoji, index) => (
            <span key={`${emoji}-${index}`} className="status__confetti-item">
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
