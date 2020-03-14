package tw.waterball.gobang.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import tw.waterball.gobang.services.GobangService;
import tw.waterball.gobang.services.dto.GobangSnapshot;
import tw.waterball.gobang.services.dto.JoinGameResult;
import tw.waterball.gobang.services.exceptions.FullPlayersException;
import tw.waterball.gobang.services.exceptions.GameNotFoundException;
import tw.waterball.gobang.services.exceptions.JoinGameException;

@RequestMapping("/api/games")
@RestController
public class GameController {
    public final static int DEFAULT_BOARD_SIZE = 15;
    private GobangService gobangService;
    private SimpMessagingTemplate simpMessaging;

    @Autowired
    public GameController(GobangService gobangService, SimpMessagingTemplate simpMessaging) {
        this.gobangService = gobangService;
        this.simpMessaging = simpMessaging;
    }

    @PostMapping
    public CreateGameResponse createGame() {
        int gameId = gobangService.createGameAndGetId(DEFAULT_BOARD_SIZE);
        return new CreateGameResponse(gameId, "/api/games/" + gameId);
    }


    @GetMapping("/{gameId}")
    public ResponseEntity<JoinGameResult> joinGame(@PathVariable int gameId) {
        try {
            gobangService.joinGame(gameId);
            simpMessaging.convertAndSend("/topic/games/gameStarted", "");
            return ResponseEntity.ok(JoinGameResult.success());
        } catch (GameNotFoundException err) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(JoinGameResult.fail(err.getMessage()));
        } catch (FullPlayersException err) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(JoinGameResult.fail(err.getMessage()));
        }
    }

    public static class CreateGameResponse {
        public int gameId;
        public String gameUrl;

        public CreateGameResponse(int gameId, String gameUrl) {
            this.gameId = gameId;
            this.gameUrl = gameUrl;
        }
    }

    @GetMapping("/{gameId}")
    public GobangSnapshot syncGameStatus(@PathVariable int gameId) {
        return gobangService.getGameStatus(gameId);
    }
}
