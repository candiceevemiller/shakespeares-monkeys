import React from 'react';

function TextBox(props) {

    return (
    <div className={props.width + " card bg-light p-5 m-5"}>
        <h2>{props.title}</h2>
        <hr />
        <p className="display-linebreak">{props.text}</p>
    </div>
    );
}

export default TextBox;