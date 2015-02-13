var MsHelper = {
    mine: "✸",
    emptyCell: " ",

    cells: [
        "  1     ",
        " 1 2 3  ",
        "        ",
        "    4  1",
        "1 3  12 ",
        "    3   ",
        "  1 2 3 ",
        "        "
    ],

    mapHeight: 0,
    mapWidth:  0,

    init: function () {
        this.mapHeight = this.cells.length;
        this.mapWidth =  this.cells[0].length;
    },

    build: function () {
        $("#grid tr").remove();
        var minesPlaced = 0, numCriteria = 0, criteriaSatisfied = 0, iRow = 0, iCol = 0,
                cellValue, satisfied, td, thisObject = this;

        function clickFn() {
            thisObject.clicked(this);
        }

        for (iRow = 0; iRow < this.mapHeight; ++iRow) {
            var row = $("<tr/>");
            for (iCol = 0; iCol < this.mapWidth; ++iCol) {
                cellValue = this.cells[iRow][iCol];
                satisfied = false;
                if (cellValue === this.mine) {
                    ++minesPlaced;
                } else if (cellValue !== this.emptyCell) {
                    ++numCriteria;
                    if (parseInt(cellValue) === this.numNeighboringMines(iRow, iCol)) {
                        satisfied = true;
                        ++criteriaSatisfied;
                    }
                }
                td = $("<td>" + cellValue + "</td>");
                if (satisfied) {
                    td.addClass("satisfied");
                }
                td.data("pos", { row: iRow, col: iCol });
                td.click(clickFn);
                row.append(td);
            }
            $("#grid").append(row);
        }
        $("#minesPlaced").text(minesPlaced);
        $("#criteriaSatisfied").text(criteriaSatisfied + " of " + numCriteria);
        $("#finished").text(criteriaSatisfied === numCriteria && minesPlaced === 10 ?
                "Yes" : "No");
    },

    clicked: function (cell) {
        function replace(cells, row, col, character) {
            var r = cells[row];
            cells[row] = r.substr(0, col) + character + r.substr(col + 1);
        }
        var cellElem = $(cell);
        var cellPos = cellElem.data("pos");
        var cellValue = this.cells[cellPos.row][cellPos.col];
        if (cellValue === this.emptyCell) {
            replace(this.cells, cellPos.row, cellPos.col, this.mine);
            this.build();
        } else if (cellValue === this.mine) {
            replace(this.cells, cellPos.row, cellPos.col, this.emptyCell);
            this.build();
        }
    },

    numNeighboringMines: function (row, col) {
        var o = this;

        function isMine(row, col) {
            if (row < 0 || row >= o.mapHeight || col < 0 || col >= o.mapWidth) {
                return 0;
            }
            return o.cells[row][col] === o.mine ? 1 : 0;
        }

        var above = row - 1,
            below = row + 1,
            left  = col - 1,
            right = col + 1;

        return (
            isMine(above, left ) +
            isMine(above, col  ) +
            isMine(above, right) +

            isMine(row,   left ) +
            // Skip the cell itself
            isMine(row,   right) +

            isMine(below, left ) +
            isMine(below, col  ) +
            isMine(below, right)
        );
    }
};