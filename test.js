const checkForFork = (tokenID) => {
    let sides = {
        top: {
            cells: ["0,0", "1,0", "2,0"],
            viable: false,
            mid: false,
        },
        bottom: {
            cells: ["0,2", "1,2", "2,2"],
            viable: false,
            mid: false,
        },
        left: {
            cells: ["0,0", "0,1", "0,2"],
            viable: false,
            mid: false,
        },
        right: {
            cells: ["2,0", "2,1", "2,2"],
            viable: false,
            mid: false,
        },
    };
    let forkSides = [];
    let movePlayed = ["0,0", "1,2"];
    let moveOpponentPlayed = ["1,1"];

    //get available sides
    for (const direction in sides) {
        for (const cell of sides[direction].cells) {
            if (movePlayed.includes(cell)) {
                sides[direction].viable = true;
                if (cell.includes("1")) sides[direction].mid = true;
            }
            if (moveOpponentPlayed.includes(cell)) {
                sides[direction].unviable = true;
            }
        }
        if (!sides[direction].viable || sides[direction].unviable) delete sides[direction];
    }
    console.log(sides);
    //if bottom and top OR left and right are not viable then quit
    if ((!sides.top && !sides.bottom) || (!sides.right && !sides.left)) return false;

    //get the first side
    if (sides.top || sides.bottom) forkSides[0] = sides.top ? sides.top : sides.bottom;
    if (sides.top && sides.bottom) {
        if (sides.top.mid) forkSides[0] = sides.top;
        if (sides.bottom.mid) forkSides[0] = sides.bottom;
        console.log(forkSides[0]);
    }
    //get the second side
    if (sides.left || sides.right) forkSides[1] = sides.left ? sides.left : sides.right;
    if (sides.left && sides.right) {
        if (sides.left.mid) forkSides[1] = sides.left;
        if (sides.right.mid) forkSides[1] = sides.right;
    }

    console.log(forkSides);
    //get the current position of the played moves
    let posibleMove = forkSides[0].cells.concat(forkSides[1].cells);
    let head = forkSides[0].cells.filter((element) => forkSides[1].cells.includes(element));

    let mid = posibleMove.filter((element) => element.includes("1"));
    //return the fork move
    if (!forkSides[0].mid && !forkSides[1].mid) {
        return mid[0];
    } else if (forkSides[0].mid || forkSides[1].mid) {
        return head;
    }
    return false;
};
console.log(checkForFork());
