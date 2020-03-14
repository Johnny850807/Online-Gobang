package tw.waterball.gobang.services;

import tw.waterball.gobang.services.dto.GobangSnapshot;
import tw.waterball.gobang.services.dto.ChessPlacement;
import tw.waterball.gobang.services.dto.GobangStatusDTO;

public interface GobangService {
    int createGameAndGetId(int defaultBoardSize);
    void joinGame(int gameId);
    GobangStatusDTO putChess(int gameId, ChessPlacement chessPlacement, String token);
    GobangSnapshot getGameStatus(int gameId);
}
