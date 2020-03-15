package tw.waterball.gobang;

public class Gobang {
    private Tile.Color turn = Tile.Color.BLACK;
    private Board board;
    private Tile.Color winner = Tile.Color.NONE;

    public Gobang(int size) {
        board = new Board(size);
    }

    public void putChess(int row, int col, Tile.Color color)
            throws NotYourTurnException, GameOverException {
        validateMove(row, col, color);
        board.put(row, col, color);

        if (board.hasFiveConnected(row, col, color)) {
            winner = color;
        } else {
            turn = turn == Tile.Color.WHITE ? Tile.Color.BLACK : Tile.Color.WHITE;
        }
    }

    private void validateMove(int row, int col, Tile.Color color) {
        if (isGameOver()) {
            throw new GameOverException();
        } else if (turn != color) {
            throw new NotYourTurnException(color);
        } else if (board.hasUsed(row, col)) {
            throw new InvalidPositionException();
        }
    }

    public Tile.Color getWinner() {
        return winner;
    }

    public boolean isGameOver() {
        return getWinner() != null && getWinner() != Tile.Color.NONE;
    }

    public Tile.Color getTurn() {
        return turn;
    }

    public Board getBoard() {
        return board;
    }
}
