package tw.waterball.gobang.services.dto;

public class JoinGameResult {
    public boolean successful;
    public String message;

    public static JoinGameResult success() {
        return new JoinGameResult(true, null);
    }

    public static JoinGameResult fail(String errorMessage) {
        return new JoinGameResult(false, errorMessage);
    }

    public JoinGameResult(boolean successful, String message) {
        this.successful = successful;
        this.message = message;
    }

}
