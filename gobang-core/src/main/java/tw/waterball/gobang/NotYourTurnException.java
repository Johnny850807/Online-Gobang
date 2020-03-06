package tw.waterball.gobang;

public class NotYourTurnException extends RuntimeException {
    private Tile.Color color;

    public NotYourTurnException(Tile.Color color) {
        super("Not " + color.getName() + "'s turn.");
        this.color = color;
    }

    public Tile.Color getColor() {
        return color;
    }
}
