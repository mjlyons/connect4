import type { PointerEvent, TouchEvent } from "react";
import { Player } from "../model/board";

type TokenTrayProps = {
  player: Player;
  setDragging: (dragging: boolean) => void;
  hideToken: boolean;
  onPointerStart: (point: { x: number; y: number }) => void;
  onPointerMove: (point: { x: number; y: number }) => void;
  onPointerEnd: () => void;
  onTouchStart: (point: { x: number; y: number }) => void;
  onTouchMove: (point: { x: number; y: number }) => void;
  onTouchEnd: () => void;
};

export const TokenTray = ({
  player,
  setDragging,
  hideToken,
  onPointerStart,
  onPointerMove,
  onPointerEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}: TokenTrayProps) => {
  const className = `tray__token tray__token--${player.toLowerCase()}${
    hideToken ? " tray__token--hidden" : ""
  }`;
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    onPointerStart({ x: event.clientX, y: event.clientY });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (event.buttons === 0) return;
    onPointerMove({ x: event.clientX, y: event.clientY });
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onPointerEnd();
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    event.preventDefault();
    onTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    event.preventDefault();
    onTouchMove({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (event.changedTouches[0]) {
      onTouchEnd();
    } else {
      setDragging(false);
    }
  };

  const handleTouchCancel = () => {
    setDragging(false);
  };
  return (
    <div className="tray" aria-label="Current player token">
      <span className="tray__label">Drag a {player} piece</span>
      <div
        className={className}
        role="img"
        aria-label={`${player} piece`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      />
    </div>
  );
};
