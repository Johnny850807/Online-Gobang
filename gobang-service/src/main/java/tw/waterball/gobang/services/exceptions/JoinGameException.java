package tw.waterball.gobang.services.exceptions;

public class JoinGameException extends RuntimeException {
    public JoinGameException(String message) {
        super(message);
    }
}
