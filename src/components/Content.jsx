import React, {useState, useEffect} from "react";
import ImgWheel from "./ImgWheel";
import TextBox from "./TextBox";
import useTypewriter from "./useTypewriter";
import getHamlet from "../assets/js/hamlet"; //hamlet text

// Takes two strings and compares them for similarity
function scoreStrings(generatedStr, targetStr) {
    let matchCount = 0;
    for (let i=0; i < targetStr.length; i++) {
        if (targetStr.charAt(i) === generatedStr.charAt(i)) {
            matchCount += 1;
        }
    }
    return ((matchCount / targetStr.length) * 100).toFixed(2);
}

// Generates a random block of text matching the length of another piece of text
function generateText(matchText)
{
    const inputLen = matchText.length;
    const asciiChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz.':;?,";
    const len = asciiChars.length;
    let res = "";
    for (let i=0; i<inputLen; i++) {
        res += asciiChars.charAt(Math.floor(Math.random() * len));
    }
    return res;
}

// Main React content display
function Content() {
    let hamlet = getHamlet();

    const [text, setText] = useState(generateText(hamlet));
    const [bestScore, setBestScore] = useState(0);

    function rerun()
    {
        setBestScore((prev) => {
            return score > prev ? score : prev;
        });
        setText(generateText(hamlet));
    }

    let displayText = useTypewriter(text, 1);

    let score = scoreStrings(hamlet, displayText);

    return (
        <main className="container-fluid rounded">

                <div className="card pt-2 pb-2 ps-5 pe-5 m-5 mb-0 bg-light">
                    <h3>Similarity Score: {score}% | Best Score: {bestScore}%</h3>
                    <button className="btn btn-primary" onClick={rerun}>Go Again</button>
                </div>
            <div className="row m-auto">
                <TextBox 
                    width="col-5" 
                    title="Target Text: Hamlet"
                    text={hamlet}
                    />
                <TextBox 
                    width="col-5"
                    title="Generated Text: Monkeys"
                    text={displayText}
                    />
            </div>
            <ImgWheel width="col-5"/>
        </main>
    );
}

export default Content;