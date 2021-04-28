import React, { useEffect, useState } from 'react';
import updateChoice from "../actions/updateChoice";
import { withRouter } from "react-router-dom";
import { useStateMachine } from "little-state-machine";
import { firestore } from "../firebase";
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

const db = firestore; //store 사용 

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

function QuestionPage({ location, history }) {
    const [isLoading, setIsLoading] = useState(true);
    const [question, setQuestion] = useState({ id: '0', question: [''] });
    const [choiceFirst, setChoiceFirst] = useState({ id: '0', choiceFirst: [''] });
    const [choiceSecond, setChoiceSecond] = useState({ id: '0', choiceSecond: [''] });
    const [number, setNumber] = useState('1');
    const [choice, setChoice] = useState('');
    const { actions } = useStateMachine({ updateChoice });

    const updateQuestionAndChoice = () => {
        console.log('updateQuestionAndChoice() called');
        if (choice.length < 16) {
            getQuestionDoc(db, number).then((data) => {

                var newQuestion = new Object();
                newQuestion.id = number;
                newQuestion.question = [];

                for (let i in data.body) {
                    newQuestion.question.push(data.body[i]);
                }
                setQuestion(newQuestion);

                var newChoiceFirst = new Object();
                newChoiceFirst.id = number;
                newChoiceFirst.choiceFirst = [];

                for (let i in data.examples.choiceFirst) {
                    newChoiceFirst.choiceFirst.push(data.examples.choiceFirst[i]);
                }
                setChoiceFirst(newChoiceFirst);

                var newChoiceSecond = new Object();
                newChoiceSecond.id = number;
                newChoiceSecond.choiceSecond = [];

                for (let i in data.examples.choiceSecond) {
                    newChoiceSecond.choiceSecond.push(data.examples.choiceSecond[i]);
                }
                setChoiceSecond(newChoiceSecond);

                console.log("question", newQuestion, question, "choiceFirst", choiceFirst, "choiceSecond", choiceSecond);
            })
        } else {
            console.log("updateQuestionAndChoice(): End of Question");
        }
    }

    useEffect(() => {
        // 컴포넌트가 마운트되고 함수를 한번 실행합니다
        console.log('use Effect called');
        updateQuestionAndChoice();
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // number가 업데이트 될 때마다 실행합니다
        updateQuestionAndChoice();
        updateProgressBar(number);
    }, [number]);

    const handleChange = (newVal) => {
        console.log('handle change called');
        if (number < 17) {
            setNumber(parseInt(number) + 1 + "");
            setChoice(choice + newVal);

        } else {
            actions.updateChoice(choice);
            console.log(choice);
            history.push("/result");
        }
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

export default withRouter(QuestionPage);