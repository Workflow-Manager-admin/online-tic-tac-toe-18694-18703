import React, { useState, useEffect } from 'react';
import './App.css';

// Color palette for the app
const COLORS = {
  primary: '#1976d2',
  secondary: '#424242',
  accent: '#ffb300'
};

// Returns array of winning line indices
function calculateWinner(squares) {
  // Possible winning lines for 3x3
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { player: squares[a], line: lines[i] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // Theme and env
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const [playerNames, setPlayerNames] = useState({ X: '', O: '' });
  const [inputNames, setInputNames] = useState({ X: '', O: '' });
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Handle env demonstration (future use/expansion)
  useEffect(() => {
    if (process.env.REACT_APP_SITE_URL) {
      // Example: use process.env in app logic if needed
    }
  }, []);

  // Reset the game state
  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setTurn('X');
    setWinner(null);
    setWinningLine([]);
    setGameStarted(false);
    setInputNames({ X: '', O: '' });
    setPlayerNames({ X: '', O: '' });
  }

  // Handle square click
  // PUBLIC_INTERFACE
  function handleClick(i) {
    if (winner || !gameStarted || squares[i]) return;
    const next = squares.slice();
    next[i] = turn;
    const win = calculateWinner(next);
    setSquares(next);
    if (win) {
      setWinner(win.player);
      setWinningLine(win.line);
    } else if (next.every(Boolean)) {
      setWinner('draw');
      setWinningLine([]);
    } else {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
  }

  // Handle player name input
  // PUBLIC_INTERFACE
  function handleNameInput(e, symbol) {
    setInputNames({ ...inputNames, [symbol]: e.target.value });
  }

  // Confirm names and start
  // PUBLIC_INTERFACE
  function startGame(e) {
    e.preventDefault();
    if (inputNames.X.trim() && inputNames.O.trim()) {
      setPlayerNames({
        X: inputNames.X.trim(),
        O: inputNames.O.trim()
      });
      setGameStarted(true);
    }
  }

  // Theme switch
  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Status line
  let status;
  if (!gameStarted) {
    status = "Enter player names to start";
  } else if (winner === 'draw') {
    status = "It's a draw!";
  } else if (winner) {
    status = `${playerNames[winner]} (${winner}) wins!`;
  } else {
    status = `Next: ${playerNames[turn] || ``} (${turn})`;
  }

  // Square rendering for the board
  function renderSquare(i) {
    const isWinning = winningLine.includes(i);
    return (
      <button
        key={i}
        className="ttt-square"
        style={{
          color: squares[i] === 'X' ? COLORS.primary : squares[i] === 'O' ? COLORS.accent : COLORS.secondary,
          background:
            isWinning && winner !== 'draw'
              ? COLORS.accent + '22'
              : 'transparent',
          borderColor: isWinning ? COLORS.accent : COLORS.secondary,
          fontWeight: isWinning ? 700 : 500,
          cursor: squares[i] || winner || !gameStarted ? 'default' : 'pointer',
        }}
        onClick={() => handleClick(i)}
        aria-label={`cell ${i + 1} ${squares[i] ? squares[i] : ''}`}
        disabled={!!winner || !gameStarted || !!squares[i]}
      >
        {squares[i]}
      </button>
    );
  }

  // Render name inputs at top, board centered, controls & status below
  return (
    <div className="App">
      <header className="ttt-header">
        <h1 className="ttt-title" style={{ color: COLORS.primary, margin: "0.3em 0 0.7em" }}>
          Tic Tac Toe
        </h1>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          type="button"
          style={{
            backgroundColor: COLORS.primary,
            color: '#fff',
            boxShadow: '0 2px 8px #0001',
            position: 'absolute',
            top: 24,
            right: 32,
            zIndex: 2
          }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <form className="ttt-player-form" onSubmit={startGame} style={{ display: 'flex', justifyContent: 'center', gap: '2em', marginBottom: '1.5em' }}>
          <div className="ttt-player-input">
            <label htmlFor="player-x" style={{ color: COLORS.primary, fontWeight: 500 }}>
              X:
            </label>
            <input
              id="player-x"
              type="text"
              maxLength={12}
              value={inputNames.X}
              onChange={e => handleNameInput(e, 'X')}
              placeholder="Player X"
              autoComplete="off"
              disabled={gameStarted}
              style={{
                marginLeft: 8,
                padding: '7px 11px',
                border: `1.5px solid ${COLORS.primary}`,
                borderRadius: 7,
                background: '#fff',
                outline: 'none',
                fontSize: 16,
                color: COLORS.primary,
                minWidth: 90,
                fontWeight: 500
              }}
              required
            />
          </div>
          <div className="ttt-player-input">
            <label htmlFor="player-o" style={{ color: COLORS.accent, fontWeight: 500 }}>
              O:
            </label>
            <input
              id="player-o"
              type="text"
              maxLength={12}
              value={inputNames.O}
              onChange={e => handleNameInput(e, 'O')}
              placeholder="Player O"
              autoComplete="off"
              disabled={gameStarted}
              style={{
                marginLeft: 8,
                padding: '7px 11px',
                border: `1.5px solid ${COLORS.accent}`,
                borderRadius: 7,
                background: '#fff',
                outline: 'none',
                fontSize: 16,
                color: COLORS.accent,
                minWidth: 90,
                fontWeight: 500
              }}
              required
            />
          </div>
          <button
            type="submit"
            className="ttt-start-btn"
            style={{
              marginLeft: 18,
              background: COLORS.primary,
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              border: 'none',
              borderRadius: 8,
              boxShadow: '0 1px 4px #0001',
              padding: '.6em 2.2em',
              cursor: !inputNames.X || !inputNames.O || gameStarted ? 'not-allowed' : 'pointer',
              opacity: gameStarted ? 0.45 : 1,
              transition: 'opacity 0.2s',
              outline: 'none'
            }}
            disabled={!inputNames.X || !inputNames.O || gameStarted}
          >
            Start
          </button>
        </form>
      </header>

      {/* Board */}
      <main>
        <div className="ttt-board-outer">
          <div
            className="ttt-board"
            style={{
              margin: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(65px, 86px))',
              gridTemplateRows: 'repeat(3, minmax(65px, 86px))',
              gap: '0.6em',
              padding: '1em',
              background: '#fff',
              borderRadius: '18px',
              boxShadow: '0 2px 16px #1976d26b, 0 1.5px 7px #42424222',
              alignItems: 'center',
              justifyItems: 'center',
              minWidth: 210,
              minHeight: 210,
              maxWidth: 302,
              maxHeight: 302
            }}
          >
            {Array(9)
              .fill(0)
              .map((_, i) => renderSquare(i))}
          </div>
        </div>

        {/* Controls & status area */}
        <div className="ttt-controls" style={{ margin: '2em auto 0', textAlign: 'center' }}>
          <div
            className="ttt-status"
            style={{
              fontWeight: 600,
              color: winner !== null && winner !== 'draw'
                ? COLORS.accent
                : winner === 'draw'
                ? COLORS.secondary
                : turn === 'X'
                ? COLORS.primary
                : COLORS.accent,
              fontSize: 24,
              minHeight: 32,
              marginBottom: '0.5em',
              letterSpacing: 0.5
            }}
            data-testid="game-status"
          >
            {status}
          </div>
          <button
            type="button"
            className="ttt-restart-btn"
            onClick={handleRestart}
            style={{
              marginTop: 0,
              background: COLORS.secondary,
              color: '#fff',
              fontWeight: 500,
              fontSize: 17,
              border: 'none',
              borderRadius: 8,
              padding: '.6em 2.4em',
              boxShadow: '0 0.5px 4px #0001',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            Restart
          </button>
        </div>
      </main>

      {/* Responsive/modern spacer */}
      <div style={{ height: 50 }} />
    </div>
  );
}

export default App;
