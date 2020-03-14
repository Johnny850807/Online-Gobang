package tw.waterball.gobang.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import tw.waterball.gobang.services.GobangService;
import tw.waterball.gobang.services.dto.CreateGameResponse;
import tw.waterball.gobang.services.dto.GobangSnapshot;
import tw.waterball.gobang.services.dto.JoinGameResponse;
import tw.waterball.gobang.services.dto.JoinGameResult;
import tw.waterball.gobang.services.exceptions.FullPlayersException;
import tw.waterball.gobang.services.exceptions.GameNotFoundException;

@CrossOrigin
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
        return gobangService.createGame(DEFAULT_BOARD_SIZE);
    }


    @PostMapping("/{gameId}")
    public ResponseEntity<JoinGameResult> joinGame(@PathVariable int gameId) {
        try {
            JoinGameResponse response = gobangService.joinGame(gameId);
            simpMessaging.convertAndSend("/topic/games/gameStarted", "");
            return ResponseEntity.ok(JoinGameResult.success(response.token));
        } catch (GameNotFoundException err) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(JoinGameResult.fail(err.getMessage()));
        } catch (FullPlayersException err) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(JoinGameResult.fail(err.getMessage()));
        }
    }


    @GetMapping("/{gameId}")
    public GobangSnapshot syncGameStatus(@PathVariable int gameId) {
        return gobangService.getGameStatus(gameId);
    }
}
