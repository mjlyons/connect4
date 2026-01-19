import { Player } from "../model/board";

type TokenTrayProps = {
  player: Player;
  setDragging: (dragging: boolean) => void;
};

export const TokenTray = ({ player, setDragging }: TokenTrayProps) => {
  const className = `tray__token tray__token--${player.toLowerCase()}`;
  return (
    <div className="tray" aria-label="Current player token">
      <span className="tray__label">Drag a {player} piece</span>
      <div
        className={className}
        draggable
        role="img"
        aria-label={`${player} piece`}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}
      />
    </div>
  );
};
