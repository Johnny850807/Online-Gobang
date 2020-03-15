package tw.waterball.gobang;


import java.util.Arrays;

public class Board {
    private Tile[][] tiles;
    private int size;

    public Board(int size) {
        this.size = size;
        initTiles(size);
    }

    public Board(Tile[][] tiles) {
        this.tiles = tiles;
        this.size = tiles.length;
        assert Arrays.stream(tiles).allMatch(row -> row.length == size) : "Row sizes are not consistent.";
    }

    public Board(String[] rows, char blackSymbol, char whiteSymbol) {
        this.size = rows.length;
        assert Arrays.stream(rows).allMatch(row -> row.length() == size) : "Row sizes are not consistent.";

        tiles = new Tile[rows.length][rows.length];
        for (int i = 0; i < rows.length; i++) {
            for (int j = 0; j < rows[i].length(); j++) {
                tiles[i][j] = new Tile();
                if (rows[i].charAt(j) == blackSymbol) {
                    tiles[i][j].setColor(Tile.Color.BLACK);
                } else if (rows[i].charAt(j) == whiteSymbol) {
                    tiles[i][j].setColor(Tile.Color.WHITE);
                }
            }
        }
    }


    private void initTiles(int size) {
        tiles = new Tile[size][size];
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                tiles[i][j] = new Tile();
            }
        }
    }

    public Tile get(int row, int col) {
        return tiles[row][col];
    }

    public void put(int row, int col, Tile.Color color) {
        tiles[row][col].setColor(color);
    }

    public boolean hasFiveConnected(int row, int col, Tile.Color color) {
        return tiles[row][col].isColor(color) &&
                (hasFiveConnectedHorizontally(row, col, color) ||
                        hasFiveConnectedVertically(row, col, color)) ||
                hasFiveConnectedLeftObliquely(row, col, color) ||
                hasFiveConnectedRightObliquely(row, col, color);
    }

    private boolean hasFiveConnectedHorizontally(int row, int col, Tile.Color color) {
        int left = col;
        int right = col;

        while (left - 1 >= 0 && tiles[row][left - 1].isColor(color)) {
            left--;
        }

        while (right + 1 < size && tiles[row][right + 1].isColor(color)) {
            right++;
        }

        return right - left + 1 >= 5;
    }

    private boolean hasFiveConnectedVertically(int row, int col, Tile.Color color) {
        int up = row;
        int down = row;

        while (up - 1 >= 0 && tiles[up - 1][col].isColor(color)) {
            up--;
        }

        while (down + 1 < size && tiles[down + 1][col].isColor(color)) {
            down++;
        }

        return down - up + 1 >= 5;
    }

    private boolean hasFiveConnectedLeftObliquely(int row, int col, Tile.Color color) {
        int leftTopDiff = 0;
        int rightDownDiff = 0;

        while ((row - leftTopDiff) >= 0 && (col - leftTopDiff) >= 0 &&
                tiles[row - leftTopDiff][col - leftTopDiff].isColor(color)) {
            leftTopDiff++;
        }
        leftTopDiff--;

        while ((row + rightDownDiff) < size && (col + rightDownDiff) < size &&
                tiles[row + rightDownDiff][col + rightDownDiff].isColor(color)) {
            rightDownDiff++;
        }
        rightDownDiff--;

        return leftTopDiff + rightDownDiff + 1 >= 5;
    }

    private boolean hasFiveConnectedRightObliquely(int row, int col, Tile.Color color) {
        int rightTopDiff = 0;
        int leftDownDiff = 0;

        while ((row - rightTopDiff) >= 0 && (col + rightTopDiff) < size &&
                tiles[row - rightTopDiff][col + rightTopDiff].isColor(color)) {
            rightTopDiff++;
        }
        rightTopDiff--;

        while ((row + leftDownDiff) < size && (col - leftDownDiff) >= 0 &&
                tiles[row + leftDownDiff][col - leftDownDiff].isColor(color)) {
            leftDownDiff++;
        }
        leftDownDiff--;

        return rightTopDiff + leftDownDiff + 1 >= 5;
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                stringBuilder.append(tiles[i][j]);
            }
            stringBuilder.append("\n");
        }
        return stringBuilder.toString();
    }

    public int size() {
        return size;
    }

    public boolean hasUsed(int row, int col) {
        return this.tiles[row][col].getColor() != Tile.Color.NONE;
    }
}
