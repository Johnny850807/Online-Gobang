package tw.waterball.gobang.services.exceptions;

public class FullPlayersException extends JoinGameException {
    private int limitPlayers;

    public FullPlayersException(int limitPlayers) {
        super("The game can have " + limitPlayers + " at most.");
        this.limitPlayers = limitPlayers;
    }

    public int getLimitPlayers() {
        return limitPlayers;
    }
}
