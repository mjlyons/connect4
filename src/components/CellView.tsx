import { Cell } from "../model/board";

type CellViewProps = {
  value: Cell;
};

export const CellView = ({ value }: CellViewProps) => {
  const className = value ? `cell cell--${value.toLowerCase()}` : "cell";
  return <div className={className} aria-hidden="true" />;
};
