package tw.waterball.gobang.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tw.waterball.gobang.GameIsOverException;
import tw.waterball.gobang.Gobang;
import tw.waterball.gobang.NotYourTurnException;
import tw.waterball.gobang.Tile;
import tw.waterball.gobang.model.Game;
import tw.waterball.gobang.model.GameRecord;
import tw.waterball.gobang.model.repositories.GameRepository;
import tw.waterball.gobang.services.dto.Converts;
import tw.waterball.gobang.services.dto.GobangDTO;
import tw.waterball.gobang.services.dto.ChessPlacement;
import tw.waterball.gobang.services.dto.GobangStatusDTO;
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
        Game game = new Game();
        game.setSize(defaultBoardSize);
        game.setP1Token(UUID.randomUUID().toString());
        return gameRepository.save(game).getId();
    }

    @Override
    public boolean joinGame(int gameId) {
        Game game = findGameOrThrow(gameId);
        if (game.getPlayerCount() == 1) {
            game.setP2Token(UUID.randomUUID().toString());
            return true;
        } else {
            return false;
        }
    }

    @Override
    public GobangStatusDTO putChess(int gameId, ChessPlacement placement, String token)
            throws NotYourTurnException, GameIsOverException, TokenInvalidException {
        Game game = findGameOrThrow(gameId);
        Gobang gobang = game.applyGameRecordsAndGetGobang();
        Tile.Color color = validateTokenAndReturnColor(game, gobang, token);
        gobang.putChess(placement.getRow(), placement.getCol(), color);
        game.addGameRecord(new GameRecord(placement.getRow(),
                placement.getCol(), Converts.colorToTeam(color)));
        gameRepository.save(game);
        if (gobang.isGameOver()) {
            return new GobangStatusDTO(gobang.getWinner());
        }
        return GobangStatusDTO.noWinner();
    }

    private Tile.Color validateTokenAndReturnColor(Game game, Gobang gobang, String token) {
        if (gobang.getTurn() == Game.P1_COLOR) {
            validateToken(game.getP1Token(), token);
            return Game.P1_COLOR;
        } else {
            validateToken(game.getP2Token(), token);
            return Game.P2_COLOR;
        }
    }

    private void validateToken(String expect, String actual) {
        if (!expect.equals(actual)) {
            throw new TokenInvalidException();
        }
    }

    @Override
    public GobangDTO getGameStatus(int gameId) {
        Game game = findGameOrThrow(gameId);
        return GobangDTO.project(game.applyGameRecordsAndGetGobang());
    }

    private Game findGameOrThrow(int gameId) {
        return gameRepository.findById(gameId).orElseThrow(() -> new GameNotFoundException(gameId));
    }

}
