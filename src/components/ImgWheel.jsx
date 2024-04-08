import React, { useState } from "react";

let images = [
    '176.jpg',
    'dilbert.gif',
    'monkeys.jpg',
    'simpsons.gif',
    'sonnets.jpeg',
    'tarantino.jpg',
    'typewriter.jpg',
];

function ImgWheel(props) {
    const [randomIndex, setRandomIndex] = useState(Math.floor(Math.random() * images.length));

    const handleClick = () => {
        setRandomIndex(Math.floor(Math.random() * images.length));
    };

    return (
        <div className={props.width + " card text-center m-5"} onClick={handleClick}>
            <img className="card-img-top" 
            src={`/img/${images[randomIndex]}`} 
             />
            <p>(pssst... click to randomize)</p>
        </div>
    );
}

export default ImgWheel;
// let images = [
//     '176.jpg',
//     'dilbert.gif',
//     'monkeys.jpg',
//     'simpsons.gif',
//     'sonnets.jpeg',
//     'tarantino.jpg',
//     'typewriter.jpg',
// ]

// function ImgWheel() {
//     let i = Math.floor(Math.random()*7);
//     return (
//         <img className="comic" src={`/img/${images[i]}`}></img>
//     );
// }

// export default ImgWheel;