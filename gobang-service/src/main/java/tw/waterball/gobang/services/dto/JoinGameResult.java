package tw.waterball.gobang.services.dto;

public class JoinGameResult {
    public boolean successful;
    public String message;
    public String token;

    public static JoinGameResult success(String token) {
        return new JoinGameResult(true, "Successfully join the game.", token);
    }

    public static JoinGameResult fail(String errorMessage) {
        return new JoinGameResult(false, errorMessage, null);
    }

    public JoinGameResult(boolean successful, String message, String token) {
        this.successful = successful;
        this.message = message;
        this.token = token;
    }

}
