import React, { useEffect, useState, useContext } from 'react';
import { withRouter } from "react-router-dom";
import bulbOnSimple from "../assets/pictures/bulbOnSimple.png";
import halfSign from "../assets/pictures/halfSign.png";
import gazeZero from "../assets/pictures/gazeZero.png";
import gazeOne from "../assets/pictures/gazeOne.png";
import gazeTwo from "../assets/pictures/gazeTwo.png";
import gazeThree from "../assets/pictures/gazeThree.png";
import gazeFour from "../assets/pictures/gazeFour.png";
import gazeFive from "../assets/pictures/gazeFive.png";
import gazeSix from "../assets/pictures/gazeSix.png";
import gazeSeven from "../assets/pictures/gazeSeven.png";
import gazeFull from "../assets/pictures/gazeFull.png";
import firestore from '../firebase';
import "./Qna.css";
import {UserContext} from '../user-context';

// firebase의 firestore 인스턴스를 변수에 저장
const db = firestore;

async function getQuestionDoc(db, number) {

    const questionRef = db.collection('questions').doc(number);
    const doc = await questionRef.get();
    if (!doc.exists) {
        console.log('getQuestionDoc(): No such document!');
    } else {
        let data = doc.data();
        return data;
    }
}


const updateProgressBar = (number) => {
    if (number < 2) {
        return <img id="proress-img" src={gazeZero} alt="질문 16개 중 2개 완료" />
    }
    if (number < 4) {
        return <img id="proress-img" src={gazeOne} alt="질문 16개 중 2개 완료" />
    }
    if (number < 6) {
        return <img id="proress-img" src={gazeTwo} alt="질문 16개 중 4개 완료" />
    }
    if (number < 8) {
        return <img id="proress-img" src={gazeThree} alt="질문 16개 중 6개 완료" />
    }
    if (number < 10) {
        return <img id="proress-img" src={gazeFour} alt="질문 16개 중 8개 완료" />
    }
    if (number < 12) {
        return <img id="proress-img" src={gazeFive} alt="질문 16개 중 10개 완료" />
    }
    if (number < 14) {
        return <img id="proress-img" src={gazeSix} alt="질문 16개 중 12개 완료" />
    }
    if (number < 16) {
        return <img id="proress-img" src={gazeSeven} alt="질문 16개 중 14개 완료" />
    }
    if (number > 15) {
        return <img id="proress-img" src={gazeFull} alt="질문 16개 중 16개 완료" />
    }
}

function Qna({ history }) {
    const [isLoading, setIsLoading] = useState(true);

    // User Context 
    const userContext = useContext(UserContext);
    const user = userContext.user;
    const updateValue = userContext.updateValue;

    // Question and Choices
    const [question, setQuestion] = useState({ id: '0', question: [''] });
    const [choiceFirst, setChoiceFirst] = useState({ id: '0', choiceFirst: [''] });
    const [choiceSecond, setChoiceSecond] = useState({ id: '0', choiceSecond: [''] });
   
   // Question number count, selected choices
    const [number, setNumber] = useState('1');
    const [choice, setChoice] = useState('');

    // Update Question and Choices Function
    const updateQuestionAndChoice = () => {
        // if not last question, then get questinaire data from server
        if (choice.length < 16) {
            getQuestionDoc(db, number).then((data) => {

                // get/set question
                var newQuestion = new Object();
                newQuestion.id = number;
                newQuestion.question = [];

                for (let i in data.body) {
                    newQuestion.question.push(data.body[i]);
                }
                setQuestion(newQuestion);

                // get/set first choice
                var newChoiceFirst = new Object();
                newChoiceFirst.id = number;
                newChoiceFirst.choiceFirst = [];

                for (let i in data.examples.choiceFirst) {
                    newChoiceFirst.choiceFirst.push(data.examples.choiceFirst[i]);
                }
                setChoiceFirst(newChoiceFirst);

                // get/set second choice
                var newChoiceSecond = new Object();
                newChoiceSecond.id = number;
                newChoiceSecond.choiceSecond = [];

                for (let i in data.examples.choiceSecond) {
                    newChoiceSecond.choiceSecond.push(data.examples.choiceSecond[i]);
                }
                setChoiceSecond(newChoiceSecond);
            })
        }
    }

    // When loaded for the first time
    useEffect(() => {
        updateQuestionAndChoice();
        setIsLoading(false);
    }, []);

    // When question number is updated
    useEffect(() => {
        updateQuestionAndChoice();
        updateProgressBar(number);
        
        // If End of Question, Go to Result Page
        if (number==17) {
            updateValue('response', choice);
            history.push("/result");
        }
    }, [number]);

    // increment question count & update choice value
        const handleChange = (newVal) => {
            setNumber(parseInt(number) + 1 + "");
            setChoice(choice + newVal);
    }

    return (
        <>
            <div className="box">
                <img id="bulb-simple-img" src={bulbOnSimple} alt="불 켜진 전구" />
                {updateProgressBar(number)}
                <h1 id="progress-text">{number}/16</h1>
            </div>
            <div id="half-img-box">
                {number == 8 && <img src={halfSign} alt="질문 절반 완료" />}
            </div>
            <div className="box purple-border-box" id="question-box">
                <br />
                {!isLoading
                    ? question.question.map((item) => {
                        return <p key={item.id} className="locus" id="question-text">{item}</p>
                    })
                    : ''
                }
                <br />
            </div>
            <div className="box locus yellow-box" id="choice-box" onClick={() => { handleChange("0") }}>
                {!isLoading
                    ? choiceFirst.choiceFirst.map((item) => {
                        return <p key={item.id} id="question-text">{item}</p>;
                    })
                    : ''
                }
            </div>
            <div className="box locus yellow-box" id="choice-box" onClick={() => { handleChange("1") }}>
                {!isLoading
                    ? choiceSecond.choiceSecond.map((item) => {
                        return <p key={item.id} id="question-text">{item}</p>;
                    })
                    : ''
                }
            </div>

        </>
    )
}

export default withRouter(Qna);