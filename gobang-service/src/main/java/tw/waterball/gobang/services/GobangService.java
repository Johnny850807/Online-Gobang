package tw.waterball.gobang.services;

import tw.waterball.gobang.services.dto.GobangDTO;
import tw.waterball.gobang.services.dto.ChessPlacement;
import tw.waterball.gobang.services.dto.GobangStatusDTO;

public interface GobangService {
    int createGameAndGetId();
    boolean joinGame(int gameId);
    GobangStatusDTO putChess(int gameId, ChessPlacement chessPlacement, String token);
    GobangDTO getGameStatus(int gameId);
}
