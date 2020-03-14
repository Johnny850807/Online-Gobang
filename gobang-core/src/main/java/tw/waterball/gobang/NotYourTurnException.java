package tw.waterball.gobang;

public class NotYourTurnException extends RuntimeException {
    private Tile.Color color;

    public NotYourTurnException(Tile.Color invalidColor) {
        super("Not " + invalidColor.getName() + "'s turn.");
        this.color = invalidColor;
    }

    public Tile.Color getColor() {
        return color;
    }
}
