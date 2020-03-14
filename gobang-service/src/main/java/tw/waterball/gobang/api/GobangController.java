package tw.waterball.gobang.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import tw.waterball.gobang.GameOverException;
import tw.waterball.gobang.NotYourTurnException;
import tw.waterball.gobang.Tile;
import tw.waterball.gobang.services.GobangService;
import tw.waterball.gobang.services.dto.ChessPlacement;
import tw.waterball.gobang.services.dto.GameMoveDTO;
import tw.waterball.gobang.services.dto.PutChessResponse;
import tw.waterball.gobang.services.exceptions.TokenInvalidException;

import java.util.HashMap;
import java.util.Map;

@Controller
public class GobangController {
    private GobangService gobangService;
    private SimpMessagingTemplate simpMessaging;

    private final static Map<Class<? extends Exception>, Integer> errNoMap = new HashMap<>();

    static {
        errNoMap.put(NotYourTurnException.class, 4000);
        errNoMap.put(GameOverException.class, 4001);
        errNoMap.put(TokenInvalidException.class, 4002);
    }

    @Autowired
    public GobangController(GobangService gobangService, SimpMessagingTemplate simpMessaging) {
        this.gobangService = gobangService;
        this.simpMessaging = simpMessaging;
    }

    @MessageMapping("/games/{gameId}/putChess")
    public void putChess(@DestinationVariable int gameId, @Payload PutChessRequest request) {
        try {
            PutChessResponse response = gobangService.putChess(gameId, request.chessPlacement, request.token);
            simpMessaging.convertAndSend(String.format("/topic/games/%d/newChess", gameId), response);
        } catch (NotYourTurnException | GameOverException err) {
            String destination = String.format("/queue/%d/%s/error", gameId, request.token);
            simpMessaging.convertAndSend(destination,
                    new ErrorMessage(errNoMap.get(err.getClass()), err.getMessage()));
        } catch (TokenInvalidException ignored) { }
    }

    public static class PutChessRequest {
        public String token;
        public ChessPlacement chessPlacement;
    }

    public static class ErrorMessage {
        public int errNo;
        public String errMsg;

        public ErrorMessage(int errNo, String errMsg) {
            this.errNo = errNo;
            this.errMsg = errMsg;
        }
    }

}
