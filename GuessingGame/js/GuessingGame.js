function generateWinningNumber() {
    return Math.floor(Math.random()*100 + 1)
}

Game.prototype.currentMax = function() {
    var max = 100;
    if (this.pastGuesses.length > 0) {
        for(var i = 0; i < this.pastGuesses.length; i++) {
            if (this.pastGuesses[i] > this.winningNumber && max > this.pastGuesses[i]) {
                max = this.pastGuesses[i]
            }
        }
    }
    return max;
}

Game.prototype.currentMin = function() {
    var min = 1;
    if (this.pastGuesses.length > 0) {
        for (var i =0; i < this.pastGuesses.length; i++) {
            if (this.pastGuesses[i] < this.winningNumber && min < this.pastGuesses[i]) {
                min = this.pastGuesses[i]
            }
        }
    }
    return min;
}

Game.prototype.generateHintNumber = function() {
    var max = Math.max.apply(null, this.pastGuesses)
    if (max < this.winningNumber) {
        max = 100
    }

    var min = Math.min.apply(null, this.pastGuesses)
    if (min > this.winningNumber) {
        min = 1
    }

    for(var i = 0; i < this.pastGuesses.length; i++) {
        if (this.pastGuesses[i] > this.winningNumber) {
            if ((this.pastGuesses[i] - this.winningNumber) < (max - this.winningNumber)){
                max = this.pastGuesses[i]
            }
        } else {
            if ((this.winningNumber - this.pastGuesses[i]) < (this.winningNumber - min)){
                min = this.pastGuesses[i]
            }
        }
    }
    var gap = max - min - 1
    this.between = gap
    return Math.floor(Math.random()*gap + min + 1)
}

function shuffle(arr) {
    var maxNumber = arr.length, ranNum, temp;
    while(maxNumber) {
        ranNum = Math.floor(Math.random() * maxNumber--)

        temp = arr[maxNumber];
        arr[maxNumber] = arr[ranNum]
        arr[ranNum] = temp
    }
    return arr
}

function Game() {
    this.playersGuess = null
    this.pastGuesses = []
    this.winningNumber = generateWinningNumber()
    this.between = 0
    this.count = 0;
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber)
}

Game.prototype.isLower = function() {
    return this.winningNumber > this.playersGuess
}

Game.prototype.playersGuessSubmission = function(num) {
    if (num >= 1 && num <= 100) {
        this.playersGuess = num
        return this.checkGuess()
    } else {
        throw 'That is an invalid guess.'
    }
}

Game.prototype.checkGuess = function() {
    if (this.winningNumber === this.playersGuess) {
        $('#hint, #player-input, #submit').prop('disabled', true);
        $('#subtitle').text("Press the Resut button to play again!")
        this.pastGuesses.push(this.playersGuess)
        $('#winning').text('Win: ' + winning())
        $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess).css('color', 'blue')
        return 'You Win!  ' + this.winningNumber
    } 
    else {
        if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
            $('#subtitle').text("Guess numbers in between")
            return 'You have already guessed that number.'
        } else if(this.playersGuess >= this.currentMax()){
            $('#subtitle').text("Guess numbers in between")
            return 'Your highest guessing number is ' + this.currentMax()
        } else if(this.playersGuess <= this.currentMin()){
            $('#subtitle').text("Guess numbers in between")
            return 'Your lowest guessing number is ' + this.currentMin()
        }
        else {
            this.pastGuesses.push(this.playersGuess)
            $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess).css('color', '#303030')
            if (this.pastGuesses.length === 4) {
                $('#hint').show(150)
            }
            if (this.pastGuesses.length === 5) {
                $('#hint, #player-input, #submit').prop("disabled", true)
                $('#subtitle').text("Press the Reset button to play again!")
                return "You Lose. The number is " + this.winningNumber
            } else {
                if(this.isLower()) {
                    $('#subtitle').text("Guess Higher!")
                } else {
                    $('#subtitle').text('Guess Lower!')
                }
                if (this.difference() < 10) return "You're burning up!"
                else if (this.difference() < 25) return "You're lukewarm."
                else if (this.difference() < 50) return "You're a bit chilly."
                else return "You're ice cold!"
            }
        }
    }
}

var gamecount = 1;
var winningcount = 0;

function count() {
    gamecount++
    return gamecount
}

function winning() {
    winningcount++
    return winningcount;
}
function newGame() {
    var newStart = new Game()
    return newStart
}

Game.prototype.provideHint = function() {
    this.generateHintNumber()

    if((this.currentMax()-this.currentMin()-1) <= 5) {
        var a = []
        for (var z = 0; z < this.between; z++) {
            if((this.currentMin()+z+1) !== this.winningNumber) {
                a.push(this.currentMin()+z+1)
            } else {
                continue
            }
        }
        var lessGenerate = shuffle(a).slice(0,this.between-2)
        lessGenerate.push(this.winningNumber)
        return shuffle(lessGenerate).join(', ')
    } else {
        var b = []
        var count = this.currentMin()
        for (var i = 1; i < (this.currentMax()-this.currentMin()); i++) {
            if ((count+i) === this.winningNumber) {
                continue
            } else {
                b.push(i+count)
            }
        }
        var generate = shuffle(b).slice(0,4)
        generate.push(this.winningNumber)
        return shuffle(generate).join(', ')
    }
}

function makeAGuess(game) {
    var guess = parseInt(($('#player-input').val()),10);
    $('#player-input').val('');
    var output = game.playersGuessSubmission(guess)
    $('#title').text(output)
}

Game.prototype.gaugeBar = function() {
    if(this.pastGuesses.length === 1) {
        $('.progress').css({'padding-right': '60px'})
        $('#left').text('4 / 5')
        $('#gaugeBar').css('background-color','rgb(174, 236, 102)')
    } else if(this.pastGuesses.length === 2) {
        $('.progress').css({'padding-right': '120px'})
        $('#left').text('3 / 5')
        $('#gaugeBar').css('background-color','rgb(119, 224, 125)')
    } else if(this.pastGuesses.length === 3) {
        $('.progress').css({'padding-right': '180px'})
        $('#left').text('2 / 5')
        $('#gaugeBar').css('background-color','rgb(255, 233, 35)')
    } else if(this.pastGuesses.length === 4) {
        $('.progress').css({'padding-right': '240px'})
        $('#left').text('L A S T')
        $('#gaugeBar').css('background-color','rgb(250, 129, 29)')
    } else if (this.pastGuesses.length ===5) {
        $('.progress').css({'padding-right': '300px'})
    }
}

$(document).ready(function() {
    var game = new Game();

    $('#hint').hide()

    $('#submit').click(function(e) {
        makeAGuess(game)
        $('#max').text(game.currentMax())
        $('#min').text(game.currentMin())
        game.gaugeBar()
     });

     $('#player-input').keypress(function(event) {
         if ( event.which == 13 ) {
            makeAGuess(game)
            $('#max').text(game.currentMax())
            $('#min').text(game.currentMin())
            game.gaugeBar()
         }
     });

     $('#hint').click(function() {
         var hints = game.provideHint()
         $('#title').text('The winning number is ' +hints)
         $('#hint').prop("disabled", true)
     })

     $('#reset').click(function() {
         alert('new game begin')
         game = newGame();
         $('#title').text('Play the Guessing Game!')
         $('#subtitle').text('Guess a number between 1-100!')
         $('.guess').text('00').css('color', 'white');
         $('#hint, #player-input, #submit').prop('disabled', false)
         $('#hint').hide()
         $('#max').text(100)
         $('#min').text(1)
         $('.progress').css({'padding-right': '0px'})
         $('#left').text('5 / 5')
         $('#gaugeBar').css('background-color','whitesmoke')
         $('#count').text('Play: ' + count())
     })

})  