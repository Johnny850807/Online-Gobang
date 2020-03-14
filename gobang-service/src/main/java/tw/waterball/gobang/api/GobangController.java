package tw.waterball.gobang.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import tw.waterball.gobang.GameOverException;
import tw.waterball.gobang.NotYourTurnException;
import tw.waterball.gobang.Tile;
import tw.waterball.gobang.services.GobangService;
import tw.waterball.gobang.services.dto.ChessPlacement;
import tw.waterball.gobang.services.dto.GobangStatusDTO;
import tw.waterball.gobang.services.exceptions.TokenInvalidException;

@Controller
public class GobangController {
    private GobangService gobangService;

    @Autowired
    public GobangController(GobangService gobangService) {
        this.gobangService = gobangService;
    }

    @MessageMapping("/games/{gameId}/putChess")
    @SendTo("/topic/games/{gameId}/newChess")
    public NewGameStatus putChess(@DestinationVariable int gameId, @Payload PutChessRequest request) {
        GobangStatusDTO status = gobangService.putChess(gameId, request.chessPlacement, request.token);
        return new NewGameStatus(request.chessPlacement, status.currentTurn, status.winner);
    }

    @MessageExceptionHandler
    @SendToUser("/queue/error")
    public ErrorMessage handleException(Exception err) {
        if (err instanceof NotYourTurnException) {
            return new ErrorMessage(4000, err.getMessage());
        } else if (err instanceof GameOverException) {
            return new ErrorMessage(4001, err.getMessage());
        } else if (err instanceof TokenInvalidException) {
            return new ErrorMessage(4002, err.getMessage());
        }
        throw new IllegalStateException("The case for the exception is not handled.", err);
    }


    public static class PutChessRequest {
        public String token;
        public ChessPlacement chessPlacement;
    }

    public static class NewGameStatus {
        public ChessPlacement newMove;
        public Tile.Color currentTurn;
        public Tile.Color winner;

        public NewGameStatus(ChessPlacement newMove, Tile.Color currentTurn, Tile.Color winner) {
            this.newMove = newMove;
            this.currentTurn = currentTurn;
            this.winner = winner;
        }
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
