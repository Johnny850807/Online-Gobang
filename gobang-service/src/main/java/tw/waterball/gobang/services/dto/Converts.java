package tw.waterball.gobang.services.dto;

import tw.waterball.gobang.Tile;
import tw.waterball.gobang.model.Team;

public class Converts {
    public static Team colorToTeam(Tile.Color color) {
        switch (color) {
            case BLACK:
                return Team.BLACK;
            case WHITE:
                return Team.WHITE;
            default:
                return Team.NONE;
        }
    }

    public static Tile.Color teamToColor(Team team) {
        switch (team) {
            case WHITE:
                return Tile.Color.WHITE;
            case BLACK:
                return Tile.Color.BLACK;
            default:
                return Tile.Color.NONE;
        }
    }

    public static char teamToSymbol(Team team) {
        switch (team) {
            case WHITE:
                return 'O';
            case BLACK:
                return 'X';
            default:
                return '-';
        }
    }
}
