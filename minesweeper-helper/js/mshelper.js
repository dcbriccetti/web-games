"use strict";

var MsHelper = {
    mine: "✸",
    criteria: [
        "  1     ",
        " 1 2 3  ",
        "        ",
        "    4  1",
        "1 3  12 ",
        "    3   ",
        "  1 2 3 ",
        "        "
    ],
    mines: [],
    init: function () {
        this.mines = [];
        for (var i = 0; i < 8; ++i) {
            var row = [];
            for (var j = 0; j < 8; ++j) {
                row.push(false);
            }
            this.mines.push(row);
        }
    },
    build: function () {
        $("#grid tr").remove();
        for (var iRow = 0; iRow < 8; ++iRow) {
            var rowVals = this.criteria[iRow];
            var row = $("<tr/>");
            for (var iCol = 0; iCol < 8; ++iCol) {
                var rv = rowVals[iCol];
                var ch = "";
                var ok = false;
                if (rv !== " ") {
                    if (parseInt(rv) === this.numNeighboringMines(iRow, iCol))
                        ok = true;
                    ch = rv;
                } else {
                    ch = this.mines[iRow][iCol] ? this.mine : " ";
                }
                var td = $("<td>" + ch + "</td>");
                if (ok)
                    td.addClass("ok")
                td.data("pos", { row: iRow, col: iCol });
                var msh = this;
                td.click( function() {
                    msh.clicked(this);
                });
                row.append(td);
            }
            $("#grid").append(row);
        }
    },
    clicked: function (cell) {
        var c = $(cell);
        var d = c.data("pos");
        var x = this.criteria[d.row][d.col];
        if (x === " ") {
            var t = c.text();
            var setMine = t !== this.mine;
            c.text(setMine ? this.mine : " ");
            this.mines[d.row][d.col] = setMine;
            this.build();
        }
    },
    numNeighboringMines: function (row, col) {
        var num = 0;
        var above = row - 1;
        var below = row + 1;
        var left = col - 1;
        var right = col + 1;

        if (above >= 0) {
            if (left >= 0 && this.mines[above][left])
                ++num;
            if (this.mines[above][col])
                ++num;
            if (right < 8 && this.mines[above][right])
                ++num;
        }
        if (left >= 0 && this.mines[row][left])
            ++num;
        if (right < 8 && this.mines[row][right])
            ++num;
        if (below < 8) {
            if (left >= 0 && this.mines[below][left])
                ++num;
            if (this.mines[below][col])
                ++num;
            if (right < 8 && this.mines[below][right])
                ++num;
        }
        return num;
    }
};