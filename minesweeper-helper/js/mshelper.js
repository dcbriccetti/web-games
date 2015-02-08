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
    
    mapHeight: 0,
    mapWidth:  0,
    
    mines: [],
    
    emptyCell: " ",
    
    init: function () {
        this.mapHeight = this.criteria.length,
        this.mapWidth =  this.criteria[0].length,
        this.mines = [];
        for (var i = 0; i < this.mapHeight; ++i) {
            var row = [];
            for (var j = 0; j < this.mapWidth; ++j) {
                row.push(false);
            }
            this.mines.push(row);
        }
    },
    
    build: function () {
        $("#grid tr").remove();
        var minesPlaced = 0;
        var numCriteria = 0;
        var criteriaSatisfied = 0;
        
        for (var iRow = 0; iRow < this.mapHeight; ++iRow) {
            var row = $("<tr/>");
            for (var iCol = 0; iCol < this.mapWidth; ++iCol) {
                var rv = this.criteria[iRow][iCol];
                var ch = "";
                var satisfied = false;
                if (rv === this.emptyCell) {
                    var mine = this.mines[iRow][iCol]
                    if (mine) ++minesPlaced;
                    ch = mine ? this.mine : this.emptyCell;
                } else {
                    ++numCriteria;
                    if (parseInt(rv) === this.numNeighboringMines(iRow, iCol)) {
                        satisfied = true;
                        ++criteriaSatisfied;
                    }
                    ch = rv;
                }
                var td = $("<td>" + ch + "</td>");
                if (satisfied) {
                    td.addClass("satisfied");
                }
                td.data("pos", { row: iRow, col: iCol });
                var msh = this;
                td.click( function() {
                    msh.clicked(this);
                });
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
        var cellElem = $(cell);
        var cellPos = cellElem.data("pos");
        var cellValue = this.criteria[cellPos.row][cellPos.col];
        if (cellValue === this.emptyCell) {
            var cellText = cellElem.text();
            var setMine = cellText !== this.mine;
            cellElem.text(setMine ? this.mine : this.emptyCell);
            this.mines[cellPos.row][cellPos.col] = setMine;
            this.build();
        }
    },
    
    numNeighboringMines: function (row, col) {
        var num = 0;
        var above = row - 1;
        var below = row + 1;
        var left  = col - 1;
        var right = col + 1;

        if (above >= 0) { // Look above unless at top
            if (left >= 0             && this.mines[above][left ]) ++num;
            if (                         this.mines[above][col  ]) ++num;
            if (right < this.mapWidth && this.mines[above][right]) ++num;
        }
        
        // Look at same row
        if (left >= 0             && this.mines[row][left ]) ++num;
        if (right < this.mapWidth && this.mines[row][right]) ++num;
        
        if (below < this.mapHeight) { // Look below unless at bottom
            if (left >= 0             && this.mines[below][left ]) ++num;
            if (                         this.mines[below][col  ]) ++num;
            if (right < this.mapWidth && this.mines[below][right]) ++num;
        }
        
        return num;
    }
};