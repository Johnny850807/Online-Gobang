package tw.waterball.gobang.services.exceptions;

public class GameNotFoundException extends RuntimeException {
    private int gameId;

    public GameNotFoundException(int gameId) {
        super("The game " + gameId + " is not found.");
    }
}
