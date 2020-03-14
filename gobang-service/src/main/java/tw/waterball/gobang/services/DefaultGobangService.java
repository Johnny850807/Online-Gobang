package tw.waterball.gobang.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tw.waterball.gobang.GameOverException;
import tw.waterball.gobang.Gobang;
import tw.waterball.gobang.NotYourTurnException;
import tw.waterball.gobang.Tile;
import tw.waterball.gobang.model.GobangGame;
import tw.waterball.gobang.model.GameRecord;
import tw.waterball.gobang.model.repositories.GameRepository;
import tw.waterball.gobang.services.dto.*;
import tw.waterball.gobang.services.exceptions.FullPlayersException;
import tw.waterball.gobang.services.exceptions.GameNotFoundException;
import tw.waterball.gobang.services.exceptions.TokenInvalidException;

import javax.transaction.Transactional;
import java.util.UUID;

@Service
@Transactional
public class DefaultGobangService implements GobangService {
    private GameRepository gameRepository;

    @Autowired
    public DefaultGobangService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Override
    public int createGameAndGetId(int defaultBoardSize) {
        GobangGame gobangGame = new GobangGame();
        gobangGame.setP1Token(UUID.randomUUID().toString());
        return gameRepository.save(gobangGame).getId();
    }

    @Override
    public void joinGame(int gameId) {
        GobangGame gobangGame = findGameOrThrow(gameId);
        if (gobangGame.getPlayerCount() == 1) {
            gobangGame.setP2Token(UUID.randomUUID().toString());
        } else {
            throw new FullPlayersException(1);
        }
    }

    @Override
    public GobangStatusDTO putChess(int gameId, ChessPlacement placement, String token)
            throws NotYourTurnException, GameOverException, TokenInvalidException {
        GobangGame gobangGame = findGameOrThrow(gameId);
        Gobang gobang = gobangGame.applyGameRecordsAndGetGobang();
        Tile.Color color = validateTokenAndGetColor(gobangGame, gobang, token);
        gobang.putChess(placement.getRow(), placement.getCol(), color);
        gobangGame.addGameRecord(new GameRecord(placement.getRow(),
                placement.getCol(), Converts.colorToTeam(color)));
        gameRepository.save(gobangGame);
        if (gobang.isGameOver()) {
            return new GobangStatusDTO(gobang.getWinner());
        }
        return GobangStatusDTO.noWinner();
    }

    private Tile.Color validateTokenAndGetColor(GobangGame gobangGame, Gobang gobang, String token) {
        if (gobang.getTurn() == GobangGame.P1_COLOR) {
            validateToken(gobangGame.getP1Token(), token);
            return GobangGame.P1_COLOR;
        } else {
            validateToken(gobangGame.getP2Token(), token);
            return GobangGame.P2_COLOR;
        }
    }

    private void validateToken(String expect, String actual) {
        if (!expect.equals(actual)) {
            throw new TokenInvalidException();
        }
    }

    @Override
    public GobangSnapshot getGameStatus(int gameId) {
        GobangGame gobangGame = findGameOrThrow(gameId);
        return GobangSnapshot.project(gobangGame.applyGameRecordsAndGetGobang());
    }

    private GobangGame findGameOrThrow(int gameId) {
        return gameRepository.findById(gameId).orElseThrow(() -> new GameNotFoundException(gameId));
    }

}
