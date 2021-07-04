import React from 'react';
import clover from '../assets/pictures/clover.png';
import moonAndStar from '../assets/pictures/moonAndStar.png';
import "./Main.css";


export default function Main({ history }) {


    return (
        <>
            <div className="box">
                <img className="img-blinking" id="moon-star-img" src={moonAndStar} alt="달과 별" />
                <div>
                    <h1 className="main-title">
                        당신의 <span className="color-blinking outline-text">소울푸드</span>를<br />
                        찾아드려요!
                    </h1>
                </div>
                <img id="clover-img" src={clover} alt="클로버" />
                <button className="round-btn" id="main-start-btn" onClick={() => history.push('/register')}>시작하기</button>
            </div>
        </>
    );
}