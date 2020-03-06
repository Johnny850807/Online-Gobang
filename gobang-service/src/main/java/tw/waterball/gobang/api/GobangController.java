package tw.waterball.gobang.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tw.waterball.gobang.services.GobangService;
import tw.waterball.gobang.services.dto.GobangDTO;

@RequestMapping("/api/games")
@RestController
public class GobangController {
    private GobangService gobangService;

    @Autowired
    public GobangController(GobangService gobangService) {
        this.gobangService = gobangService;
    }


    @PostMapping
    public CreateGameResponse createGame() {
        int gameId = gobangService.createGameAndGetId();
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
    public GobangDTO syncGameStatus(@PathVariable int gameId) {
        return gobangService.getGameStatus(gameId);
    }
}
