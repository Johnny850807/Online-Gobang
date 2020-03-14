package tw.waterball.gobang.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import tw.waterball.gobang.GameOverException;
import tw.waterball.gobang.NotYourTurnException;
import tw.waterball.gobang.Tile;
import tw.waterball.gobang.services.GobangService;
import tw.waterball.gobang.services.dto.ChessPlacement;
import tw.waterball.gobang.services.dto.GobangStatusDTO;
import tw.waterball.gobang.services.exceptions.JoinGameException;

import java.security.Principal;

@Controller
public class GobangController {
    private GobangService gobangService;
    private SimpMessagingTemplate simpMessaging;

    @Autowired
    public GobangController(GobangService gobangService, SimpMessagingTemplate simpMessaging) {
        this.gobangService = gobangService;
        this.simpMessaging = simpMessaging;
    }

    @MessageMapping("/games/{gameId}")
    @SendTo("topic/games/gameStarted")
    public String joinGame(@DestinationVariable int gameId) {
        gobangService.joinGame(gameId);
        return "";
    }

    @MessageMapping("/games/{gameId}/putChess")
    @SendTo("/topic/games/{gameId}/newChess")
    public PutChessResponse putChess(@DestinationVariable int gameId, @Payload PutChessRequest request) {
        GobangStatusDTO status = gobangService.putChess(gameId, request.chessPlacement, request.token);
        return new PutChessResponse(request.chessPlacement, status.getWinner());
    }

    @MessageExceptionHandler
    @SendToUser("/queue/error")
    public String handleException(Exception ex) {
        return ex.getMessage();
    }


    public static class PutChessRequest {
        public String token;
        public ChessPlacement chessPlacement;
    }

    public static class PutChessResponse {
        public ChessPlacement newStep;
        public Tile.Color winner;

        public PutChessResponse(ChessPlacement newStep, Tile.Color winner) {
            this.newStep = newStep;
            this.winner = winner;
        }
    }

}
