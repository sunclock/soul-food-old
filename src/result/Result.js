import React, { useState, useEffect } from "react";
import { Popover } from '@varld/popover'
import bulbDetail from "../assets/pictures/bulbDetail.png";
import TextShareButton from "../TextShareButton";
import firestore from '../firebase';
import firebase from "firebase";
import "./Result.css";


const db = firestore; //store 사용 

async function setUserDocument (db, age, sex, occupation, timestamp, response, soulFood, keyword) {

    // [parameters]
    // db: firestore
    // age, sex, occupation, soulFood: string
    // response: list of number 0 and 1, length of 16.
    // keyword: list of string
    // date: firebase timestamp object

    console.log("setUserDocument() called");

    const user = await db.collection('users').add({
        age: age,
        sex: sex,
        occupation: occupation,
        date: timestamp,
        response: response,
        soulFood: soulFood,
        keyword: keyword
    });
    console.log('setUserDocument() Added document with ID: ', user.id);
}

async function getKeyword(db, response) {

    // [parameters]
    // db: firestore
    // response: list of number 0 and 1, length of 16.

    // [return] 
    // keyword: list of string

    console.log("getKeyword() called");

    var count = 1;
    var keyword = [];

    const questionRef = db.collection('questions');
    const snapshot = await questionRef.where('category', '==', 'food').get();
    if (snapshot.empty) {
        console.log('getKeyword() No matching documents.');
        return;
    }
    snapshot.forEach(doc => {
        if (doc.data().keyword[response[parseInt(doc.id) - 1]]) {
            var newKeyword = new Object();
            newKeyword.keyword = doc.data().keyword[response[parseInt(doc.id) - 1]];
            newKeyword.id = count;
            keyword.push(newKeyword);
            count += 1;
        }
    });

    return keyword;
}

async function getRule(db, response) {

    // [parameters]
    // db: firestore
    // response: list of number 0 and 1, length of 16.

    // [return] 
    // rule: list of object newRule(id, rule). 
        // newRule.id : number starting from 1
        // newRule.rule : list of string

    console.log("getRule() called");

    var count = 1;
    var rule = [];

    const questionRef = db.collection('questions');
    const snapshot = await questionRef.where('category', '==', 'hygiene').get();

    if (snapshot.empty) {
        console.log('getRule() No matching documents.');
        return;
    }

    snapshot.forEach(doc => {
        var newRule = new Object();
        newRule.id = count;
        var index = parseInt(doc.id) - 1;

        if (parseInt(response[index]) === 0) {
            newRule.rule = doc.data().rules.choiceFirst;
        } else {
            newRule.rule = doc.data().rules.choiceSecond;
        }
            rule.push(newRule);
            count += 1;
    })

    return rule;
}


async function getSoulFood(db, tempFood) {

    // [parameters]
    // db: firestore
    // tempFood: string

    //[return]
    // soulFood: string

    console.log('getSoulFood() called');

    var soulFood = ''

    const resultRef = db.collection('results').doc(tempFood);
    const doc = await resultRef.get();
    if (!doc.exists) {
        console.log('getSoulFood() No such document!');
    } else {
        soulFood = doc.data().name;
    }

    return soulFood;
}

async function testSoulFood(db, response) {

    // [parameters]
    // db: firestore
    // response: list of number 0 and 1, length of 16.

    // [return] 
    // tempFood: string

    console.log("testSoulFood() called");
    let foodQuestion = []; 
    let foodResponse = '';
    let tempFood = '';

    const questionRef = db.collection('questions');
    const snapshot = await questionRef.where('category', '==', 'food').get();
    if (snapshot.empty) {
        console.log('testSoulFood() No matching documents.');
        return;
    }
    snapshot.forEach(doc => {
        foodQuestion.push(doc.id);
    });

    var foodQuestionInt = foodQuestion.map(str => parseInt(str))
    foodQuestionInt.sort(function (a, b) { return a - b; });

    console.log('foodQuestionstr', foodQuestion)
    console.log('foodQuestionInt', foodQuestionInt)

    for (let i in foodQuestionInt) {
        let index = foodQuestionInt[i]-1;
        foodResponse += response[index];
    }

    if (foodResponse === '0000') {
        tempFood = 'whiskey';
    }
    if (foodResponse === '1001') {
        tempFood = 'sweetPotato';
    }
    if (foodResponse === '0001') {
        tempFood = 'beer';
    }
    if (foodResponse === '1000') {
        tempFood = 'monaka';
    }
    if (foodResponse === '0100') {
        tempFood = 'wine';
    }
    if (foodResponse === '1101') {
        tempFood = 'tea';
    }
    if (foodResponse === '0101') {
        tempFood = 'kozel';
    }
    if (foodResponse === '1100') {
        tempFood = 'bread';
    }
    if (foodResponse === '0011') {
        tempFood = 'cocktail';
    }
    if (foodResponse === '1011') {
        tempFood = 'toast';
    }
    if (foodResponse === '0010') {
        tempFood = 'koreanWine';
    }
    if (foodResponse === '1010') {
        tempFood = 'potato';
    }
    if (foodResponse === '0111') {
        tempFood = 'beef';
    }
    if (foodResponse === '1111') {
        tempFood = 'ice';
    }
    if (foodResponse === '0110') {
        tempFood = 'soju';
    }
    if (foodResponse === '1110') {
        tempFood = 'riceCake';
    }

    return tempFood;
}

export default function ResultPage({ location, history }) { 
    const [ isLoading, setIsLoading ] = useState(true);
    const [ info, setInfo ] = useState();
    const response = '';
    const [ soulFood, setSoulFood ] = useState(['로딩중이에요']);
    const [ rule, setRule ] = useState([{id: 0, rule: '로딩중이에요'}]);
    const [ keyword, setKeyword ] = useState([{ id: 0, keyword: '로딩중이에요' }]);
    const [ imageName, setImageName ] = useState('');
    const [result, setResult] = useState('결과를 받는 중이에요');
    const [ isFinished, setIsFinished ] = useState(false);

    const url = 'http://ec2-13-124-188-130.ap-northeast-2.compute.amazonaws.com/main';

    useEffect(() => {

        async function orderController() {
            let tempFood = await testSoulFood(db, response);
            let soulFoodName = await getSoulFood(db, tempFood);
            setImageName(tempFood);
            setSoulFood(soulFoodName);
            setKeyword(await getKeyword(db, response));
            setRule(await getRule(db, response));
            setIsLoading(false);
        }
        orderController();
    }, []);

    useEffect(() => {
        setResult('🍀나만의 소울푸드 심리테스트🍀 : ' + soulFood + '! [나만의 소울푸드가 궁금하다면?]  ' + url);
        setIsFinished(true);
    }, [isLoading]);

    useEffect(() => {
        const timestamp = firebase.firestore.Timestamp.fromDate(new Date());
        setUserDocument(db, info.age, info.sex, info.occupation, timestamp, response, soulFood, keyword);
    }, [isFinished])

    return (
    <div>
        <Popover
            popover={({ visible, close }) => {
          return (
            <div className="locus-purple-box" id="pop-up-container">
                <p>안심한끼 팀 소개</p><br/>
                <p>정부에서는 '안심식당'지정을 통해서 건강한 외식문화 조성을 위해 노력하고 있는데요,</p>
                <p>저희는 안심식당 데이터를 활용한 앱서비스 <span id="app-theme-color">안심한끼</span>를 제작 중인 대학생들이랍니다:)</p>
                <button id="pop-up-btn" onClick={close}>닫기</button>
            </div>
          );
        }}
      >
          <div id="pop-up-box">
                    <div className="left-float">
                        <p id="img-btn-text">안심한끼 프로젝트에 대해 <br />보다 자세히 알고 싶다면?</p>
                    </div>
                    <div className="right-float">
                        <img id="pop-up-img" src={bulbDetail} alt="설명 보기" />
                    </div>
          </div>
        </Popover>
        <h1 className="yellow-outline-bold" id="result-title">당신의 소울푸드!</h1>
        <div className="box">
            {!isLoading
            ? <img id="food-img" src={require('../assets/food/' + imageName + '.jpg').default} alt="소울푸드" />
            : '로딩중이에요'}
        </div>
        <div id="food-name-box">
            <p id="food-text">
                {!isLoading
                ? soulFood
                : '로딩중이에요'}
            </p>
        </div>
        <div className="box">
            <ul id="keyword-ul">
                {!isLoading
                ? keyword.map((item) => {
                    return <li key={item.id} id="keyword-li">{item.keyword}</li>
                })
                : '로딩중이에요'}
            </ul>
        </div>
        <div id="rule-box" className="box">
            <h2 className="yellow-outline-light">당신은 이런 곳에서 식사하면<br />훨씬 행복한 사람이에요!</h2>
                <div className="locus-purple-box">
                    {!isLoading
                    ? rule.map((item) => {
                        if (item.rule.length > 1) {
                            return <><p key={item.id}>- {item.rule}</p><br/></>
                        }})
                    : '로딩중이에요'}
                    
                </div>
        </div>
        <h2 className="yellow-outline-light">여러분의 설문 결과는!</h2>
        <div className="box locus-purple-box">
            <p>안녕하세요. <br />
                저희는 공공앱 <span id="app-theme-color">안심한끼</span>를 개발 중인 대학생들입니다.
                여러분들의 응답결과는 보다 유용한 서비스 제공을 위해
                활용될 계획이에요!
                밥 한끼를 먹더라도 안전하고 만족스럽게 먹기 위한
                발걸음에 함께 해주셔서 감사합니다 :)
            </p>
        </div>
        <TextShareButton text={result} />
        <div id="reference">
                <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" 
                    title="Smashicons">Smashicons</a> 
                    from <a href="https://www.flaticon.com/" 
                    title="Flaticon">www.flaticon.com</a>
                </div>
                <div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect"
                    title="Pixel perfect">Pixel perfect</a> 
                    from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                </div>
                <div>Icons made by <a href="https://www.freepik.com" 
                    title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" 
                    title="Flaticon">www.flaticon.com</a>
                </div>
        </div>
    </div>
    );
} 