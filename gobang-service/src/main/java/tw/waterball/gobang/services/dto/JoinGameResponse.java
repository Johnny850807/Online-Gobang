package tw.waterball.gobang.services.dto;

/**
 * @author johnny850807@gmail.com (Waterball))
 */
public class JoinGameResponse {
    public int gameId;
    public String token;

    public JoinGameResponse(int gameId, String token) {
        this.gameId = gameId;
        this.token = token;
    }
}
