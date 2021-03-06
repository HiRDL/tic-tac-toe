const fs = require('fs');
const path = require('path');

const moves = {
  7: [0, 0],
  8: [0, 1],
  9: [0, 2],
  4: [1, 0],
  5: [1, 1],
  6: [1, 2],
  1: [2, 0],
  2: [2, 1],
  3: [2, 2],
};

if(process.argv.length === 2) {
  initialiseBoard();
} else {
  fs.readFile(
    path.join(__dirname, '/board.json'),
    (err, gameData) => {
      const game = JSON.parse(gameData);
      if(move(...moves[process.argv[2]], game.player, game.board)) {
        console.log(`${game.player} has won!!`);
        logBoard(game.board);
        game.board = initialiseBoard();
        return;
      };
      logBoard(game.board);
      console.log(`Player ${swapPlayer(game.player)}, your move;\n`);
    }
  )
}

function logBoard(board) {
  console.log(`_______________\n| ${board[0]} |\n| ${board[1]} |\n| ${board[2]} |\n|_____________|\n`);
}

function move(i, j, player, board) {
  board[i][j] = player;
  writeBoard(board, swapPlayer(player), (err) => {
    if(err) { console.error(err); }
  });
  let win = checkRow(board, i) || checkColumn(board, j) || checkDiag(board);
  return win;
}

function writeBoard(board, player, cb) {
  fs.writeFile(path.join(__dirname, '/board.json'), JSON.stringify({
    board: board,
    player: player,
  }), cb);
}

function swapPlayer(player) {
  return (player === ' X ') ? ' O ' : ' X ';
}

function checkRow(board, i) {
  if(board[i][0] !== '   ' && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
    return true;
  }
  return false;
}

function checkColumn(board, j) {
  if(board[0][j] !== '   ' && board[0][j] === board[1][j] && board[0][j] === board[2][j]) {
    return true;
  }
  return false;
}

function checkDiag(board) {
  if(board[0][0] !== '   ' && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
    return true;
  }
  if(board[0][2] !== '   ' && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
    return true;
  }
  return false;
}

function initialiseBoard() {
  const board = [
    ['   ', '   ', '   '],
    ['   ', '   ', '   '],
    ['   ', '   ', '   ']
  ];
  console.log('WELCOME TO MY TIC TAC TOE');
  writeBoard(board, ' X ', (err, data) => {
     if(err) {
       console.error(err);
      } else {
        console.log('\n BOARD INITIALISED,\n Player 1, make your move\n');
        logBoard(board);
        console.log('Player X begin;\n')
      }
  });
}