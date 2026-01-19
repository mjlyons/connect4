import type { PointerEvent, TouchEvent } from "react";
import { Player } from "../model/board";

type TokenTrayProps = {
  player: Player;
  setDragging: (dragging: boolean) => void;
  onTouchDrop: (point: { x: number; y: number }) => void;
};

export const TokenTray = ({
  player,
  setDragging,
  onTouchDrop
}: TokenTrayProps) => {
  const className = `tray__token tray__token--${player.toLowerCase()}`;
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") {
      event.preventDefault();
    }
    setDragging(true);
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    if (touch) {
      onTouchDrop({ x: touch.clientX, y: touch.clientY });
    } else {
      setDragging(false);
    }
  };
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
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={() => setDragging(true)}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handlePointerUp}
      />
    </div>
  );
};
