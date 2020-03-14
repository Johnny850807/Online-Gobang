package tw.waterball.gobang.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tw.waterball.gobang.services.GobangService;
import tw.waterball.gobang.services.dto.GobangSnapshot;

@RequestMapping("/api/game")
@RestController
public class GobangController {
    public final static int DEFAULT_BOARD_SIZE = 15;
    private GobangService gobangService;

    @Autowired
    public GobangController(GobangService gobangService) {
        this.gobangService = gobangService;
    }

    @PostMapping
    public CreateGameResponse createGame() {
        int gameId = gobangService.createGameAndGetId(DEFAULT_BOARD_SIZE);
        return new CreateGameResponse(gameId,  "/api/games/" + gameId);
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
