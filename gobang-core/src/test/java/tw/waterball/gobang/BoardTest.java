package tw.waterball.gobang;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BoardTest {

    @Test
    void testHorizontally5NotConnected() {
        String[] rows =
                        {"-----",
                        "-----",
                        "OOOOX",
                        "-----",
                        "-----",};
        Board board = new Board(rows, 'X', 'O');

        for (int i = 0; i < rows.length; i++) {
            assertFalse(board.hasFiveConnected(2, i, Tile.Color.WHITE));
        }
    }

    @Test
    void testHorizontally5Connected() {
        String[] rows =
                        {"-----",
                        "-----",
                        "OOOOO",
                        "-----",
                        "-----",};
        Board board = new Board(rows, 'X', 'O');

        for (int i = 0; i < rows.length; i++) {
            assertTrue(board.hasFiveConnected(2, i, Tile.Color.WHITE));
        }
    }

    @Test
    void testVertically5Connected() {
        String[] rows =
                        {"--O--",
                        "--O--",
                        "--O--",
                        "--O--",
                        "--O--",};
        Board board = new Board(rows, 'X', 'O');

        for (int i = 0; i < rows.length; i++) {
            assertTrue(board.hasFiveConnected(i, 2, Tile.Color.WHITE));
        }
    }

    @Test
    void testVertically5NotConnected() {
        String[] rows =
                        {"--O--",
                        "--O--",
                        "--O--",
                        "--O--",
                        "--X--",};
        Board board = new Board(rows, 'X', 'O');

        for (int i = 0; i < rows.length; i++) {
            assertFalse(board.hasFiveConnected(i, 2, Tile.Color.WHITE));
        }
    }


    @Test
    void testLeftObliquely5Connected() {
        String[] rows =
                       {"O----",
                        "-O---",
                        "--O--",
                        "---O-",
                        "----O",};
        Board board = new Board(rows, 'X', 'O');

        for (int diff = 0; diff < rows.length; diff++) {
            assertTrue(board.hasFiveConnected(diff, diff, Tile.Color.WHITE));
        }
    }

    @Test
    void testLeftObliquely5NotConnected() {
        String[] rows =
                       {"O----",
                        "-O---",
                        "--O--",
                        "---O-",
                        "----X",};
        Board board = new Board(rows, 'X', 'O');

        for (int diff = 0; diff < rows.length; diff++) {
            assertFalse(board.hasFiveConnected(diff, diff, Tile.Color.WHITE));
        }
    }


    @Test
    void testRightObliquely5Connected() {
        String[] rows =
                       {"----O",
                        "---O-",
                        "--O--",
                        "-O---",
                        "O----",};
        Board board = new Board(rows, 'X', 'O');

        for (int diff = 0; diff < rows.length; diff++) {
            assertTrue(board.hasFiveConnected(rows.length-1-diff, diff, Tile.Color.WHITE));
        }
    }


    @Test
    void testRightObliquely5NotConnected() {
        String[] rows =
                        {"----O",
                        "---O-",
                        "--O--",
                        "-O---",
                        "X----",};
        Board board = new Board(rows, 'X', 'O');

        for (int diff = 0; diff < rows.length; diff++) {
            assertFalse(board.hasFiveConnected(rows.length-1-diff, diff, Tile.Color.WHITE));
        }
    }
}