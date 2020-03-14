package tw.waterball.gobang;

public class FullPlayersException extends RuntimeException {
    private int limitPlayers;

    public FullPlayersException(int limitPlayers) {
        super("The game can have " + limitPlayers + " at most.");
        this.limitPlayers = limitPlayers;
    }
}
