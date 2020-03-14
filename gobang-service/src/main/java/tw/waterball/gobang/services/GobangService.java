package tw.waterball.gobang.services;

import tw.waterball.gobang.GameOverException;
import tw.waterball.gobang.NotYourTurnException;
import tw.waterball.gobang.services.dto.*;
import tw.waterball.gobang.services.exceptions.TokenInvalidException;

public interface GobangService {
    CreateGameResponse createGame(int boardSize);
    JoinGameResponse joinGame(int gameId);
    GobangStatusDTO putChess(int gameId, ChessPlacement chessPlacement, String token) throws NotYourTurnException, GameOverException, TokenInvalidException;
    GobangSnapshot getGameStatus(int gameId);
}
