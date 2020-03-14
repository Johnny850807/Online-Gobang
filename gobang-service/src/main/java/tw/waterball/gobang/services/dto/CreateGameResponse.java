package tw.waterball.gobang.services.dto;

/**
 * @author johnny850807@gmail.com (Waterball))
 */
public class CreateGameResponse {
    public int gameId;
    public String token;

    public CreateGameResponse(int gameId, String token) {
        this.gameId = gameId;
        this.token = token;
    }
}