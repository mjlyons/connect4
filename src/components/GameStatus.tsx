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
  let message = `${currentPlayer}'s turn`;
  if (winner) message = `${winner} wins!`;
  if (isDraw) message = "It's a draw.";

  return (
    <p className="status" data-testid="game-status">
      {message}
    </p>
  );
};
