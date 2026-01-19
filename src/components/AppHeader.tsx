type AppHeaderProps = {
  onNewGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export const AppHeader = ({
  onNewGame,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: AppHeaderProps) => (
  <header className="app__header">
    <h1>Connect Four</h1>
    <div className="app__controls">
      <button
        className="app__button app__button--secondary"
        onClick={onUndo}
        disabled={!canUndo}
      >
        Undo
      </button>
      <button
        className="app__button app__button--secondary"
        onClick={onRedo}
        disabled={!canRedo}
      >
        Redo
      </button>
      <button className="app__button" onClick={onNewGame}>
        New Game
      </button>
    </div>
  </header>
);
