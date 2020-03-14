package tw.waterball.gobang.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tw.waterball.gobang.GameOverException;
import tw.waterball.gobang.Gobang;
import tw.waterball.gobang.NotYourTurnException;
import tw.waterball.gobang.Tile;
import tw.waterball.gobang.model.GobangGame;
import tw.waterball.gobang.model.GameMove;
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
    public CreateGameResponse createGame(int boardSize) {
        GobangGame gobangGame = new GobangGame();
        gobangGame.setP1Token(UUID.randomUUID().toString());
        int gameId = gameRepository.save(gobangGame).getId();
        return new CreateGameResponse(gameId, gobangGame.getP1Token());
    }

    @Override
    public JoinGameResponse joinGame(int gameId) {
        GobangGame gobangGame = findGameOrThrow(gameId);
        if (gobangGame.getPlayerCount() == 1) {
            gobangGame.setP2Token(UUID.randomUUID().toString());
            return new JoinGameResponse(gobangGame.getId(), gobangGame.getP2Token());
        } else {
            throw new FullPlayersException(1);
        }
    }

    @Override
    public GobangStatusDTO putChess(int gameId, ChessPlacement placement, String token)
            throws NotYourTurnException, GameOverException, TokenInvalidException {
        GobangGame gobangGame = findGameOrThrow(gameId);
        Gobang gobang = gobangGame.applyGameRecordsAndGetGobang();

        if (gobang.isGameOver()) {
            throw new GameOverException();
        }

        Tile.Color color = validateTokenAndGetColor(gobangGame, gobang, token);
        gobang.putChess(placement.getRow(), placement.getCol(), color);
        gobangGame.addGameMove(new GameMove(placement.getRow(), placement.getCol(), color));
        gameRepository.save(gobangGame);

        // notify that the game is over
        if (gobang.isGameOver()) {
            return new GobangStatusDTO(gobang.getTurn(), gobang.getWinner());
        }
        return new GobangStatusDTO(gobang.getTurn(), gobang.getWinner());
    }

    private Tile.Color validateTokenAndGetColor(GobangGame gobangGame, Gobang gobang, String token) {
        Tile.Color color = validateTokenAndGetColor(gobangGame, token);
        if (gobang.getTurn() == color) {
            return color;
        } else {
            throw new NotYourTurnException(color);
        }
    }

    private Tile.Color validateTokenAndGetColor(GobangGame gobangGame, String token) {
        if (gobangGame.getP1Token().equals(token)) {
            return GobangGame.P1_COLOR;
        } else if (gobangGame.getP2Token().equals(token)) {
            return GobangGame.P2_COLOR;
        }
        throw new TokenInvalidException();
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
