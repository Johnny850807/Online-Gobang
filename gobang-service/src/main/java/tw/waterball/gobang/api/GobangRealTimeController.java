package tw.waterball.gobang.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import tw.waterball.gobang.Tile;
import tw.waterball.gobang.services.GobangService;
import tw.waterball.gobang.services.dto.ChessPlacement;
import tw.waterball.gobang.services.dto.GobangStatusDTO;

@Controller
public class GobangRealTimeController {
    private GobangService gobangService;

    @Autowired
    public GobangRealTimeController(GobangService gobangService) {
        this.gobangService = gobangService;
    }

    @MessageMapping("/game/{gameId}")
    @SendTo("/topic/game/{gameId}/newPlayer")
    public String joinGame(@DestinationVariable int gameId) {
        if (gobangService.joinGame(gameId)) {
            return "New player joins.";
        }
        return "The game is full of player.";
    }

    @MessageMapping("/game/{gameId}/putChess")
    @SendTo("/topic/game/{gameId}")
    public PutChessResponse putChess(@DestinationVariable int gameId, @Payload PutChessRequest request) {
        GobangStatusDTO status = gobangService.putChess(gameId, request.chessPlacement, request.token);
        return new PutChessResponse(request.chessPlacement, status.getWinner());
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
