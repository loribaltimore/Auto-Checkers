//Creates a Space Object representing each space on the DOM gameboard
let allSpaces = document.querySelectorAll('.space');
allSpacesActive = document.querySelectorAll('.active');
let announcement = document.querySelector('#announcement');
let history = document.querySelector('#history');
let finishTurn = document.querySelector('#finishTurn');
let skippableSpacesCriteria = undefined;
let landingDir = undefined;
let skipChainStart = undefined;
let skipChainEnd;
let skippableSpacesObj = undefined;
let skippableSpacesHTML = [];
let turnOver = false;
let quick = false;
let userDouble = false;
let clickedSpaceHTML = undefined;
let clickedSpacePiece = undefined;
let nonMoveableSpacesObj = undefined;
let moveToSpaceHTML = undefined;
let landingSpacesIds = undefined;
let landingSpacesHTML = [];
let moveableSpaces = [];
let transitionPiece = undefined;
let nonMoveableSpacesHTML = undefined;
let cpuPieces = undefined;
let boardMiddle = 5;
let skipped = false;
let piecesToCheck = [];
let piecesToMove = [];
let playerColors = {
    white: 'red',
    red: 'white'
};
let playerStats = {
    king: {
        white: 8,
        red: 1
    },
    landingDir: {
        white: 1,
        red: -1
    }
};
/// AI PROGRAMMING
let userColor = undefined
let playerUp = undefined;

let assignPlayerUp = function (playerUp) {
    playerUp = playerColors[playerUp];
 
    return playerUp;
};


let allSpacesObj = [];
class Space {
    constructor(space, piece, king, front = []) {
        this.space = space;
        this.piece = piece;
        this.king = king;
        this.front = front
    }
};

let quickSkip = function (user = false) {
    nonMoveableSpacesHTML = undefined;
    console.log('QUICK SKIP WORKING');
    console.log(moveToSpaceHTML);
    moveToSpaceHTML.addEventListener('click', selectPiece);
    landingSpacesHTML[0].addEventListener('click', makeMove);
    if (user = false) {
        moveToSpaceHTML.click();
    landingSpacesHTML[0].click();
    } else { userDouble = true };
    
}

let getClosestToMiddle = function (piecesToMove, outOfMoves = false) {
    let lastPieces = [];
    let kingGuard = [];
    let kingPieces = [];
    let pieceToKing = [];
    let closestToMiddle = piecesToMove.sort(function (a, b) {
        return Math.abs((5 - parseInt(a.space.x))) - Math.abs((5 - parseInt(b.space.x)))
    }).sort(function (a, b) {
        return Math.abs((5 - parseInt(a.space.y))) - Math.abs((5 - parseInt(b.space.y)))
    }).filter(function (element, index) {
        if (element.space.y === playerStats.king[userColor].toString()
            && /[4635]/.test(element.space.x) === true) {
            kingGuard.push(element)
        } else if (parseInt(element.space.y) !== 5 && element.king === false) {
            return element
        } else if (parseInt(element.space.y) === 5) {
            lastPieces.push(element)
        } else if (element.king === true
            && parseInt(element.space.y) !== 4
            || parseInt(element.space.y) !== 5) {
            kingPieces.push(element)
        } else if (parseInt(element.space.y) + playerStats.landingDir[playerUp] === playerStats.king[playerUp]) {
            pieceToKing.push(element)
        } 
    });
    closestToMiddle = pieceToKing.concat(kingPieces)
        .concat(closestToMiddle)
        .concat(lastPieces)
        .concat(kingGuard);
    let moveToHTML = undefined;
    let moveFromHTML = undefined;
    console.log('CLOSEST TO MIDDLE')
    console.log(closestToMiddle);
    ///AFter closestToMiddle is exhausted we get to 'Cant Move'
    ////we have to run it back, but allow a piece to move to a spot where they can be taken
    ////This means going into landingSpaces and changing the filter to allow a skip
    for (let element of closestToMiddle) {
        console.log('STARTING FROM THIS PIECE')
        console.log(element);
        console.log(getSkippableSpaces(allSpacesObj, element, false))
        let skippableSpaces = getSkippableSpaces(allSpacesObj, element, false);
        skippableSpacesObjAi = allSpacesObj.filter(function (element, index) {
            if (skippableSpaces.map(x => x[0]).indexOf(element.space.x + element.space.y) > -1
                && element.piece !== playerColors[userColor]) {
                return element
            }
        });
        console.log('SKIPPABLES')
        console.log(skippableSpacesObjAi)
        let landingSpaces = getLandingSpaces(skippableSpacesObjAi, element, outOfMoves);
        
        console.log('LANDING SPACES');
        console.log(landingSpacesHTML)
        console.log(moveToHTML)
        if (landingSpacesHTML.length) {
            landingSpacesHTML.every(function (el, index) {
                if (moveToHTML !== undefined) {
                    return false
                };
                if (parseInt(el.id[0]) > parseInt(element.space.x)) {
                    console.log('IT IS IN FACT ON THE RIGHT')
                    let moveTo = skippableSpacesObjAi.sort(function (a, b) {
                        return parseInt(b.space.x) - parseInt(a.space.x)
                    })[0];
                    moveToHTML = document.getElementById(moveTo.space.x + moveTo.space.y);
                    moveFromHTML = document.getElementById(element.space.x + element.space.y);
                } else if (el === undefined) {
                    console.log('IT IS IN FACT UNDEFINED')
                } else {
                    console.log('IT IS IN FACT ON THE LEFT')
                    let moveTo = skippableSpacesObjAi.sort(function (a, b) {
                        return parseInt(a.space.x) - parseInt(b.space.x)
                    })[0];
                    moveToHTML = document.getElementById(moveTo.space.x + moveTo.space.y);
                    moveFromHTML = document.getElementById(element.space.x + element.space.y);
                };
            })
        }

        if (moveToHTML !== undefined) {
            moveFromHTML.addEventListener('click', selectPiece);
            moveFromHTML.click();
            moveToHTML.addEventListener('click', makeMove);
            moveToHTML.click();
            break;
        } else {
            console.log('Cant Move');
            if (closestToMiddle.indexOf(element) === closestToMiddle.length - 1) {
                console.log('You are completely out of moves');
                getClosestToMiddle(piecesToMove, true)
            }
        }   
    }
};

let setNonMoveableSpacesObj = function (skippableSpacesObj) {
    console.log(skippableSpacesObj)
    for (let space of skippableSpacesObj.map(x => x[0])) {
        let currentSpaceHTML = document.getElementById(space)
        skippableSpacesHTML.push(currentSpaceHTML);
        if (currentSpaceHTML.classList.contains('blank')) {
            moveableSpaces.push(currentSpaceHTML);
        };
        
    };

    console.log('FRONT')
    console.log(clickedSpacePiece.front)
    
     nonMoveableSpacesHTML = skippableSpacesHTML.filter(function (element, index) {
        let moveableSpaceIds = moveableSpaces.map(x => x.id);
        if (moveableSpaceIds.indexOf(element.id) === -1) {
            return element
        }
    });
    console.log('NON MOVEABLE SPACES')
    console.log(nonMoveableSpacesHTML);
       
     nonMoveableSpacesObj = allSpacesObj.filter(function (obj, index) {
        let nonMoveableIds = nonMoveableSpacesHTML.map(x => x.id);
        if (nonMoveableIds.indexOf(obj.space.x + obj.space.y) > -1) {
            return obj
        }
    })
    console.log('NONMOVEABLESPACESOBJ');
    console.log(nonMoveableSpacesObj)
}

let getLandingSpaces = function (nonMoveableSpacesObj, clickedSpacePiece, outOfMoves = false) {
    landingSpacesHTML = [];
    landingSpacesIds = nonMoveableSpacesObj.map(function (spaceObj, index) {
        if (parseInt(clickedSpacePiece.space.y) < parseInt(spaceObj.space.y)
        && clickedSpacePiece.king === true) {
            landingDir = +1
        } else if (parseInt(clickedSpacePiece.space.y) > parseInt(spaceObj.space.y)
            && clickedSpacePiece.king === true) {
            landingDir = -1
        };
        if (parseInt(clickedSpacePiece.space.x) > parseInt(spaceObj.space.x)) {
                if ((parseInt(spaceObj.space.x) - 1) > 0 && (parseInt(spaceObj.space.y) + landingDir) <= 8) {
                    return (parseInt(spaceObj.space.x) - 1).toString()
                    + (parseInt(spaceObj.space.y) + landingDir).toString() 
                } else {return spaceObj.space.x + spaceObj.space.y}
                // else { return spaceObj.space.x.toString() + spaceObj.space.y.toString() }
        } else {
            console.log(clickedSpacePiece)
            if ((parseInt(spaceObj.space.x) + 1) <= 8 && (parseInt(spaceObj.space.y) + landingDir) > 0) {
                return (parseInt(spaceObj.space.x) + 1).toString()
                    + (parseInt(spaceObj.space.y) + landingDir).toString()
                } else {return spaceObj.space.x + spaceObj.space.y}
            };       
    });

    console.log('LANDINGSPACESIDS');
    console.log(landingSpacesIds);
    allSpacesActive.forEach(function (el, index) {
        if (outOfMoves === false) {
            if (landingSpacesIds.indexOf(el.id) > -1
                && (el.classList.contains('blank') === true
                    || el.classList.contains(playerUp) === true)) {
                landingSpacesHTML.push(el)
            };
        } else {
            if (landingSpacesIds.indexOf(el.id) > -1) {
            landingSpacesHTML.push(el)
        };
        }
    });
       
    console.log('LANDING SPACES');
    console.log(landingSpacesHTML);
}


let getSkippableSpaces = function (allSpacesObj, clickedSpace, frontCheck = false) {
    console.log('SPACES THIS PIECE CAN SKIP');
    if (clickedSpace.king === false && frontCheck === false) {
        if (clickedSpace.piece === 'white') {
            landingDir = 1
            skippableSpacesCriteria = {
                xMinus: (parseInt(clickedSpace.space.x) - 1).toString(),
                xPlus: (parseInt(clickedSpace.space.x) + 1).toString(),
                yPlus: (parseInt(clickedSpace.space.y) + 1).toString(),
            };
        } else {
            landingDir = -1
            skippableSpacesCriteria = {
                xMinus: (parseInt(clickedSpace.space.x) - 1).toString(),
                xPlus: (parseInt(clickedSpace.space.x) + 1).toString(),
                yMinus: (parseInt(clickedSpace.space.y) - 1).toString(),
            }
        };
    } else {
        skippableSpacesCriteria = {
            xMinus: (parseInt(clickedSpace.space.x) - 1).toString(),
            xPlus: (parseInt(clickedSpace.space.x) + 1).toString(),
            yMinus: (parseInt(clickedSpace.space.y) - 1).toString(),
            yPlus: (parseInt(clickedSpace.space.y) + 1).toString()
        }
    };
    let skippableKeys = Object.keys(skippableSpacesCriteria);
    return allSpacesObj.filter(function (space, index) {
        if (clickedSpace.king === false && frontCheck === false) {
            if ((space.space.x === skippableSpacesCriteria.xMinus
                && space.space.y === skippableSpacesCriteria[skippableKeys[2]])
                || (space.space.x === skippableSpacesCriteria.xPlus
                    && space.space.y === skippableSpacesCriteria[skippableKeys[2]])) {
                return space
            }
        } else {
            if ((space.space.x === skippableSpacesCriteria.xMinus
                && space.space.y === skippableSpacesCriteria.yMinus)
                || (space.space.x === skippableSpacesCriteria.xMinus
                    && space.space.y === skippableSpacesCriteria.yPlus)
                || (space.space.x === skippableSpacesCriteria.xPlus
                    && space.space.y === skippableSpacesCriteria.yMinus)
                || (space.space.x === skippableSpacesCriteria.xPlus
                    && space.space.y === skippableSpacesCriteria.yPlus)) {
                return space
            };
        };
    }).filter(function (space, index) {
        if (clickedSpacePiece.king === false && frontCheck === false) {
            if (space.piece !== transitionPiece) {
                return space
            }
        } else {
            return space
        }
    }).map(x => [(x.space.x + x.space.y), x.piece]);
    
};



let makeMove = (event) => {
    console.log('START OF PHASE 2')

    //remove Event 2 handlers, add Event 1 to create event loop
    clickedSpaceHTML.classList.remove('clicked');
    landingSpacesHTML.forEach(function (element, index) {
        element.removeEventListener('click', makeMove);
    });
    moveableSpaces.forEach(function (element, index) {
        element.removeEventListener('click', makeMove);
    });
   
  ///Make changes to allSpacesHTML

    moveToSpaceHTML = event.target;
    moveToSpaceHTML.innerText = clickedSpaceHTML.innerText;
    moveToSpaceHTML.classList.add(clickedSpacePiece.piece);
    moveToSpaceHTML.classList.remove('blank');
    clickedSpaceHTML.classList.add('blank');
    if (clickedSpaceHTML.classList.contains('king')) {
        clickedSpaceHTML.classList.remove('king');
        moveToSpaceHTML.classList.add('king')
    };
    console.log('Phase one click')
    console.log(clickedSpaceHTML)
    console.log('move to space');
    console.log(moveToSpaceHTML);
    clickedSpaceHTML.classList.remove(clickedSpacePiece.piece);
    clickedSpaceHTML.innerText = '';
    ///Make changes to allSpacesObJ

      allSpacesObj = allSpacesObj.map(function (element, index) {
        if (element.space.x + element.space.y
            === clickedSpacePiece.space.x + clickedSpacePiece.space.y) {
            element.piece = 'blank';
            return element
        } else if (element.space.x + element.space.y === event.target.id) {
            element.piece = transitionPiece;
            return element
        } else { return element }
      });
    ///Skip Mechanic
    for (let space of nonMoveableSpacesHTML) {
        let frontTest = undefined;
        let skippedPieceSpace = undefined;
        if ((parseInt(moveToSpaceHTML.id[0]) === parseInt(space.id[0]) + 1)
            || (parseInt(moveToSpaceHTML.id[0]) === parseInt(space.id[0]) - 1)) {
            let skippedPiece = allSpacesObj.map(function (element, index) {
                if (element.space.x + element.space.y === space.id) {
                    skipped = true;
                    skippedPieceSpace = element.space.x + element.space.y;
                    space.classList = 'col border space color active blank';
                    space.innerText = ''
                    element.piece = 'blank'
                    frontTest = element.front.map(x => x[0]);
                    element.front = [];
                    return element
                }
                return element
            }).filter(x => x.space.x + x.space.y === skippedPieceSpace)[0];
            allSpacesObj = allSpacesObj.map(function (element, index) {
                if (frontTest.indexOf(element.space.x + element.space.y) > -1) {
                    element.front = element.front.filter(function (space, index) {
                        if (space[0] !== skippedPiece.space.x + skippedPiece.space.y) {
                            return space
                        }
                    });
                    return element
                };
                    return element
            });
        }
    };

    if (moveToSpaceHTML.id[1] === '8'
        || moveToSpaceHTML.id[1] === '1') {
        console.log('King is Working')
        if (moveToSpaceHTML.innerText.length < 2) {
            moveToSpaceHTML.innerText = moveToSpaceHTML.innerText.repeat(2);

        };
        moveToSpaceHTML.classList.add('king');
        let moveToId = moveToSpaceHTML.id;
        allSpacesObj = allSpacesObj.map(function (element, index) {
            if (element.space.x + element.space.y === moveToId) {
                element.king = true
                return element
            } else {
                return element
            }
        });
           
    };
    if (clickedSpacePiece.king === true) {
        clickedSpacePiece.king === false;
        allSpacesObj.forEach(function (element, index) {
            if (element.space.x + element.space.y === moveToSpaceHTML.id) {
                element.king = true;
            }
        })
    };
    let moveToSpaceObj = allSpacesObj.filter(function (element, index) {
        if (element.space.x + element.space.y === moveToSpaceHTML.id) {
            return element
        }
    })[0];
    ///Before you delete the front you have to check to see if each piece in clickedSpacePiece's front is still in
  
    moveToSpaceObj.front = getSkippableSpaces(allSpacesObj, moveToSpaceObj, true);
    console.log(moveToSpaceObj.front)
    moveToSpaceObj.front = moveToSpaceObj.front.filter(function (element, index) {
        if (element[1] !== 'blank') {
            return element
        }
    });
    console.log('FRONT')
    console.log(moveToSpaceObj.front)
    console.log('moveToSpaceFront', 'skippableSpacesObj', 'clickedSpacePieceFRONT');
    console.log(moveToSpaceObj.front.map(x => x[0]))
    console.log(skippableSpacesObj.map(x => x[0]));
    console.log(clickedSpacePiece.front.map(x => x[0]))
    let clickedSpaceFrontTest = clickedSpacePiece.front.map(x => x[0]);


    allSpacesObj = allSpacesObj.map(function (element, index) {
       
        let front = moveToSpaceObj.front.map(x => x[0]);
        let clickedSpaceFront = skippableSpacesObj.map(x => x[0]);
        if (front.indexOf(element.space.x + element.space.y) > -1) {
            element.front.push([moveToSpaceObj.space.x + moveToSpaceObj.space.y, moveToSpaceObj.piece]);
            return element
        }
        else if (clickedSpaceFrontTest.indexOf(element.space.x + element.space.y) > -1) {
            element.front = element.front.filter(function (space, index) {
                if (space[0] !== clickedSpacePiece.space.x + clickedSpacePiece.space.y) {
                    return element
                }
            })
            return element;
        } else if (clickedSpacePiece.space.x + clickedSpacePiece.space.y
            === element.space.x + element.space.y) {
            element.front = [];
            return element
        }
        else { return element }
        
    });

    console.log();

    console.log('UPDATED FRONT');
    console.log(moveToSpaceObj.front.map(x => x[0]));
    landingSpacesHTML = [];
    console.log(landingSpacesHTML)
    moveableSpaces = [];
    allSpacesActive = document.querySelectorAll('.active');


    if (skipped === true ) {
        nonMoveableSpacesHTML = undefined;
        skippableSpacesHTML = [];
        console.log('CHECKING SKIP CHAIN');
        let skipChainSkippable = getSkippableSpaces(allSpacesObj, moveToSpaceObj, false);
        console.log('getting here')
        setNonMoveableSpacesObj(skipChainSkippable);
        let skipChainLanding = getLandingSpaces(nonMoveableSpacesObj, moveToSpaceObj, false);
        console.log('getting here');
        if (landingSpacesHTML.length > 0 && playerUp === userColor) {

            // moveableSpaces = [];
            // skippableSpacesHTML = [];
            // allSpacesActive.forEach(function (element, index) {
            //     console.log('sparky')
            //     element.removeEventListener('click', makeMove);
            // });
            // moveToSpaceHTML.addEventListener('click', selectPiece);
            // console.log('LANDINGSPACES');
            // console.log(landingSpacesHTML);
            // landingSpacesHTML[0].addEventListener('click', makeMove);
            console.log('userDouble skip possible');
            quickSkip(true);
        } else if (landingSpacesHTML.length === 0
            && playerUp !== userColor
            && turnOver === false
            && quick === false) {
            finishTurn.click()
        };
    } else if (playerUp !== userColor && quick === false) {
        finishTurn.click()
    };
    quick = false;
 
}






let selectPiece = (event) => {
    console.log('START OF PHASE 1');
   console.log(userDouble)
    allSpacesActive.forEach(function (element, index) {
        element.removeEventListener('click', selectPiece)
    });

    //Enlarge piece to show activity
    clickedSpaceHTML = event.target;
    console.log(clickedSpaceHTML)

    if (!event.target.classList.contains('clicked')) {
        event.target.classList.add('clicked');
    } else {
        event.target.classList.remove('clicked');

    }
    //Isolate Space object
    let clickedSpace = allSpacesObj.filter(function (element, index) {
        if (element.space.x === event.target.id[0]
            && element.space.y === event.target.id[1]) {
            return element
        }
    });

    console.log('CLICKED SPACE')
    console.log(clickedSpace[0].space)
    clickedSpacePiece = clickedSpace[0];
    if (userColor === undefined) {
        userColor = clickedSpacePiece.piece;
        playerUp = userColor;
    };

    transitionPiece = clickedSpace[0].piece;


    //Defined skippableSpaces based on clickedSpace
    if (clickedSpace[0].piece !== 'blank') {
        skippableSpacesObj = getSkippableSpaces(allSpacesObj, clickedSpacePiece);

        console.log('SKIPPABLESPACESOBJ');
        console.log(skippableSpacesObj)
        ///Defining moveable vs skippable spaces;
        console.log('SKIPPABLE SPACES');
        console.log(skippableSpacesHTML)
        console.log('MOVEABLE SPACES')
        console.log(moveableSpaces);
        setNonMoveableSpacesObj(skippableSpacesObj);
        getLandingSpaces(nonMoveableSpacesObj, clickedSpacePiece);

        if (userDouble === false) {
            if (landingSpacesHTML.length || moveableSpaces.length) {
                moveableSpaces.forEach(function (element, index) {
                    element.addEventListener('click', makeMove);
                });
                landingSpacesHTML.forEach(function (element, index) {
                    element.addEventListener('click', makeMove);
                });
            } else {
                console.log('THIS PIECE HAS NO MOVES');
                clickedSpaceHTML.classList.remove('clicked');
                 clickedSpaceHTML = undefined;
                clickedSpacePiece = undefined;
                moveToSpaceHTML = undefined;
                landingSpacesHTML = [];
                 moveableSpaces = [];
                transitionPiece = undefined;
                nonMoveableSpacesHTML = undefined;
                allSpacesActive.forEach(function (element, index) {
                    element.addEventListener('click', selectPiece); 
                })
            }
      }
        
    } else {
        console.log('YOU HAVE TO CHOOSE A SPACE WITH A PIECE');
        allSpacesActive.forEach(function (element, index) {
            element.addEventListener('click', selectPiece); 
        })
    }
    if (userDouble === true) {
        userDouble = false;
    }
};

for (let space of allSpaces) {
    //Create Space Object per Space in DOM
    let newSpace = undefined;
    let x = space.id[0];
    let y = space.id[1];
    let coord = { x: x, y: y };
    let whiteFront = [
        [(parseInt(coord.x) + 1).toString() + (parseInt(coord.y) + 1).toString(),
            'white'
        ],
        [(parseInt(coord.x) - 1).toString() + (parseInt(coord.y) + 1).toString(),
            'white'
        ],
        [(parseInt(coord.x) + 1).toString() + (parseInt(coord.y) - 1).toString(),
            'white'
        ],
        [(parseInt(coord.x) - 1).toString() + (parseInt(coord.y) - 1).toString(),
            'white'
        ]
    ].filter(x => (parseInt(x[0][0]) >= 1 && parseInt(x[0][0]) <= 8)
        && (parseInt(x[0][1]) <= 8 && parseInt(x[0][1]) < 4));
    let redFront = [
        [(parseInt(coord.x) + 1).toString() + (parseInt(coord.y) - 1).toString(),
            'red'
        ],
        [(parseInt(coord.x) - 1).toString() + (parseInt(coord.y) - 1).toString(),
            'red'
        ],
        [(parseInt(coord.x) + 1).toString() + (parseInt(coord.y) + 1).toString(),
            'red'
        ],
        [(parseInt(coord.x) - 1).toString() + (parseInt(coord.y) + 1).toString(),
            'red'
        ]
    ].filter(x => (parseInt(x[0][0]) >= 1 && parseInt(x[0][0]) <= 8)
        && (parseInt(x[0][1]) > 5 && parseInt(x[0][1]) >= 1));
    if (space.classList.contains('white') === true) {
        newSpace = new Space(coord, 'white', false, whiteFront);
        space.innerText = 'X';
    } else if (space.classList.contains('red') === true) {
        newSpace = new Space(coord, 'red', false, redFront);
        space.innerText = 'O';
    } else {
        newSpace = new Space(coord, 'blank', false);
    };
    allSpacesObj.push(newSpace);
   
    ///Create Event for Clicking Space to update Space Object
};
allSpacesActive.forEach(function (element, index) {
    element.addEventListener('click', selectPiece);
});


///start on AI;
///Could easily randomly scan from front to back for pieces that can move and randomly move them.
///set skippableSpaces in allSpaceObj Object


//////AI Programming
let testFunc = function () {
    if (quick === true) {
        quickSkip();
    };
    if (playerUp === playerColors[userColor]) {
        console.log('AI LOGIC STARTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT')
        let skippableAiHTML = [];
        piecesToCheck = [];
        cpuPieces = allSpacesObj.filter(function (element, index) {
            if (element.piece === playerColors[userColor]) {
                return element
            } 
        });
        console.log('CPU FRONTS WITH OPPONENT PRESENT')
        ///All CPU pieces with opponent in front
        cpuPieces.forEach(function (element, index) {
            if (element.front.length > 0
                && element.front.filter(x => x[1] === userColor).length > 0) {
                piecesToCheck.push(element)
            }
            if (userColor === 'white') {
                piecesToMove.unshift(element)
            } else {piecesToMove.push(element)}
        });
        console.log(piecesToCheck)
        
        if (piecesToCheck.length) {
            
            for (let piece of piecesToCheck) {
                console.log(moveToSpaceHTML)
                console.log('PIECE');
                console.log(piece)
                let pieceNum = piece.space.x + piece.space.y;
                let pieceColor = piece.piece
                let pieceFront = piece.front;
                if (pieceColor === 'white') {
                    if (piece.king === false) {
                        landingDir = [-1, -1]
                    } else {
                        landingDir = [-1, 1];
                    };
                } else {
                    if (piece.king === false) {
                        landingDir = [1, 1]
                    } else {
                        landingDir = [1, -1];
                    };
                };
                if (turnOver === true) {
                    break;
                };
                for (let front of pieceFront) {
                    console.log(playerUp)
                    console.log(landingDir)
                    if (front[1] === userColor
                        && ((parseInt(pieceNum[1]) - parseInt(front[0][1]) === landingDir[0])
                        || (parseInt(pieceNum[1]) - parseInt(front[0][1]) === landingDir[1]))
                        && (parseInt(front[0][0]) > 1) && (parseInt(front[0][1]) < 8)) {
                        let elementObj = allSpacesObj.filter(x => (x.space.x + x.space.y) === front[0])[0];
                        console.log('EMENEBTOBJ')
                        console.log(elementObj)
                            let xDir = undefined;
                            let yDir = undefined;
                            if (parseInt(elementObj.space.y) < parseInt(pieceNum[1])) {
                                yDir = -2
                            } else { yDir = 2 };
                            if (parseInt(elementObj.space.x) > parseInt(pieceNum[0])) {
                                xDir = 20
                            } else { xDir = -20 };
                            let landingSpot = (parseInt(pieceNum) + xDir + yDir).toString();
                            console.log(landingSpot)
                            console.log('WACKY')
                            let elFronts = elementObj.front.map(x => x[0]);
                            console.log(elFronts);
                            let fromSpace = undefined;
                            let toSpace = undefined;
                        if (elFronts.indexOf(landingSpot) === -1
                            && (parseInt(landingSpot[0]) <= 8 && parseInt(landingSpot[0]) >= 1)
                                && (parseInt(landingSpot[1]) <= 8 && parseInt(landingSpot[1]) >= 1)) {
                                allSpacesActive.forEach(function (element, index) {
                                    if (landingSpot === element.id) {
                                        moveToSpaceHTML = element;
                                        moveToSpaceHTML.addEventListener('click', makeMove);
                                    } else if (piece.space.x + piece.space.y === element.id) {
                                        fromSpace = element;
                                        fromSpace.addEventListener('click', selectPiece);
                                    }
                                });
                            fromSpace.click();
                            turnOver = true
                            moveToSpaceHTML.click();
                                break;
                            } else {
                                console.log('SPOT TAKEN');
                            console.log(landingSpot[0]);
                            console.log(landingSpot[1]);
                            console.log(typeof landingSpot)
                            }
                            
                    } else {
                        console.log('This front is either not userColor or' +
                            'skipping will take it to a nonexistent space');
                        console.log(front)
                       
                    }
                }
                
            }
            console.log('IF YOURE GETTING HERE IT MEANS YOU HAVE NO GOOD SKIPS');
            if (turnOver !== true) {
                getClosestToMiddle(piecesToMove);
            } else {
                console.log('WHOS TURN IS IT?');
                console.log(playerUp)
                turnOver = false;
                if (landingSpacesHTML.length) {
                    quick = true;
                    quickSkip();
                };
                finishTurn.click()
            };
        } else {
            console.log('PIECE TO CHECK = 0')
            getClosestToMiddle(piecesToMove);
        }


    };
    
    piecesToMove = [];
    nonMoveableSpacesHTML = [];
};

finishTurn.addEventListener('click', (event) => {
    console.log('finish turn happening')
    let newMove = document.createElement('li');
    newMove.innerText = `${playerUp} moves from ${clickedSpacePiece.space.x + clickedSpacePiece.space.y} to ${moveToSpaceHTML.id}`
    history.prepend(newMove);
    playerUp = assignPlayerUp(playerUp);
    announcement.innerText = `${playerUp}'s turn...`
    skipped = false;
    nonMoveableSpacesHTML = undefined;
    skippableSpacesObj = undefined;
    skippableSpacesHTML = [];
    moveToSpaceHTML = undefined;
    if (playerUp === userColor) {
        allSpacesActive.forEach(function (element, index) {
            element.addEventListener('click', selectPiece);
        });
    } else {
        testFunc()
    }
})



