package tw.waterball.gobang;

public class Tile {
    private Color color = Color.NONE;

    public enum Color {
        NONE('-', "None"), BLACK('X', "Black"), WHITE('O', "White");
        private char symbol;
        private String name;

        Color(char symbol, String name) {
            this.symbol = symbol;
            this.name = name;
        }

        public char getSymbol() {
            return symbol;
        }

        public String getName() {
            return name;
        }

        @Override
        public String toString() {
            return String.valueOf(symbol);
        }
    }

    public boolean isColor(Color color) {
        return this.color == color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Color getColor() {
        return color;
    }

    @Override
    public String toString() {
        return color.toString();
    }
}
