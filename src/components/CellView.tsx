import type { CSSProperties } from "react";
import { Cell } from "../model/board";

type CellViewProps = {
  value: Cell;
  animate: boolean;
  dropRows: number;
};

export const CellView = ({ value, animate, dropRows }: CellViewProps) => {
  const colorClass = value ? `cell--${value.toLowerCase()}` : "";
  const occupiedClass = value ? "cell--occupied" : "";
  const className = [
    "cell",
    occupiedClass,
    colorClass,
    animate ? "cell--drop" : ""
  ]
    .filter(Boolean)
    .join(" ");
  const style = animate
    ? ({ "--drop-rows": dropRows } as CSSProperties)
    : undefined;
  return <div className={className} style={style} aria-hidden="true" />;
};
