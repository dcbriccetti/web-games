function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function draw() {
    const canvas = document.getElementById('board');
    const boardLen = canvas.width;
    const cellLen = boardLen / 8;
    const ctx = canvas.getContext('2d');

    let totalSquares = 0;

    function drawBoard() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, boardLen, boardLen);
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;
        for (let x = 0; x < boardLen; x += cellLen)
            for (let y = 0; y < boardLen; y += cellLen)
                ctx.strokeRect(x, y, cellLen, cellLen);
    }

    for (let squareSize = 1; squareSize <= 8; ++squareSize) {
        let thisSizeSquares = 0;
        $(`<tr><td>${squareSize}</td><td id="size${squareSize}Total" align="right"></td></tr>`).insertBefore('#totalRow');
        const hue = 360 / 8 * (squareSize - 1);
        const operations = Math.pow(9 - squareSize, 2);
        const sleepMs = 2000 / operations;

        for (let yOffset = 0; yOffset <= 8 - squareSize; ++yOffset) {
            for (let xOffset = 0; xOffset <= 8 - squareSize; ++xOffset) {
                drawBoard();
                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.fillRect(xOffset * cellLen, yOffset * cellLen,
                    squareSize * cellLen, squareSize * cellLen);
                ++thisSizeSquares;
                ++totalSquares;
                $('#total').text(totalSquares.toString());
                $(`#size${squareSize}Total`).text(thisSizeSquares.toString());
                await sleep(sleepMs);
            }
        }
        await sleep(250);
    }
    drawBoard();
}

$(() => draw());