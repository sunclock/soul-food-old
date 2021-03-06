import React, { useState, useEffect, useContext } from "react";
import { Popover } from '@varld/popover'
import bulbDetail from "../assets/pictures/bulbDetail.png";
import TextShareButton from "../TextShareButton";
import firestore from '../firebase';
import firebase from "firebase";
import "./Result.css";
import { UserContext } from '../user-context';


const db = firestore;

// send user data to server
async function setUserDocument(db, _user, timestamp, response, soulFood, keyword) {
    // [parameters]
    // db: firestore
    // age, sex, job, soulFood: string
    // response: list of number 0 and 1, length of 16.
    // keyword: list of string
    // date: firebase timestamp object
    const user = await db.collection('users').add({
        age: _user.age,
        sex: _user.sex,
        job: _user.job,
        date: timestamp,
        response: response,
        soulFood: soulFood,
        keyword: keyword
    });
}


// determine matching keyword &
// get keyword data from the server
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

// get matching hygiene rule from server
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


// get matching soul food data from server
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


// determine matching soul food based on user's response
// set imageName
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

    for (let i in foodQuestionInt) {
        let index = foodQuestionInt[i] - 1;
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


export default function ResultPage() {

    // flow control
    const [isLoading, setIsLoading] = useState(true);

    // User Context 
    const userContext = useContext(UserContext);
    const user = userContext.user;
    const updateValue = userContext.updateValue;
    const url = 'http://ec2-13-124-188-130.ap-northeast-2.compute.amazonaws.com/main';
    const response = user.response;

    // state
    const [ soulFood, setSoulFood ] = useState(['??????????????????']);
    const [ rule, setRule ] = useState([{id: 0, rule: '??????????????????'}]);
    const [ keyword, setKeyword ] = useState([{ id: 0, keyword: '??????????????????' }]);
    const [ imageName, setImageName ] = useState('');
    const [ copyText, setCopyText ] = useState('????????? ?????? ????????????');

    useEffect(() => {
        async function setSoulFoodData() {
            let tempFood = await testSoulFood(db, response);
            setImageName(tempFood);
            let soulFoodName = await getSoulFood(db, tempFood);
            setSoulFood(soulFoodName);
            setKeyword(await getKeyword(db, response));
            setRule(await getRule(db, response));
            setCopyText ('????????????? ???????????? ??????????????????? : ' + soulFood + '! [????????? ??????????????? ????????????????]  ' + url);
            setIsLoading(false);
        }
        setSoulFoodData();
    }, []);

    useEffect(() => {
        let timestamp = firebase.firestore.Timestamp.fromDate(new Date());
        setUserDocument(db, user, timestamp, response, soulFood, keyword);
    }, [isLoading])

    return (
        <div>
            <Popover
                popover={({ visible, close }) => {
                    return (
                        <div className="locus-purple-box" id="pop-up-container">
                            <p>???????????? ??? ??????</p><br />
                            <p>??????????????? '????????????'????????? ????????? ????????? ???????????? ????????? ?????? ???????????? ????????????,</p>
                            <p>????????? ???????????? ???????????? ????????? ???????????? <span id="app-theme-color">????????????</span>??? ?????? ?????? ????????????????????????:)</p>
                            <button id="pop-up-btn" onClick={close}>??????</button>
                        </div>
                    );
                }}
            >
                <div id="pop-up-box">
                    <div className="left-float">
                        <p id="img-btn-text">???????????? ??????????????? ?????? <br />?????? ????????? ?????? ??????????</p>
                    </div>
                    <div className="right-float">
                        <img id="pop-up-img" src={bulbDetail} alt="?????? ??????" />
                    </div>
                </div>
            </Popover>
            <h1 className="yellow-outline-bold" id="result-title">????????? ????????????!</h1>
            <div className="box">
                {!isLoading
                    ? <img id="food-img" src={require('../assets/food/' + imageName + '.jpg').default} alt="????????????" />
                    : '??????????????????'}
            </div>
            <div id="food-name-box">
                <p id="food-text">
                    {!isLoading
                        ? soulFood
                        : '??????????????????'}
                </p>
            </div>
            <div className="box">
                <ul id="keyword-ul">
                    {!isLoading
                        ? keyword.map((item) => {
                            return <li key={item.id} id="keyword-li">{item.keyword}</li>
                        })
                        : '??????????????????'}
                </ul>
            </div>
            <div id="rule-box" className="box">
                <h2 className="yellow-outline-light">????????? ?????? ????????? ????????????<br />?????? ????????? ???????????????!</h2>
                <div className="locus-purple-box">
                    {!isLoading
                        ? rule.map((item) => {
                            if (item.rule.length > 1) {
                                return <><p key={item.id}>- {item.rule}</p><br /></>
                            }
                        })
                        : '??????????????????'}

                </div>
            </div>
            <h2 className="yellow-outline-light">???????????? ?????? ?????????!</h2>
            <div className="box locus-purple-box">
                <p>???????????????. <br />
                    ????????? ????????? <span id="app-theme-color">????????????</span>??? ?????? ?????? ?????????????????????.
                    ??????????????? ??????????????? ?????? ????????? ????????? ????????? ??????
                    ????????? ???????????????!
                    ??? ????????? ???????????? ???????????? ??????????????? ?????? ??????
                    ???????????? ?????? ???????????? ??????????????? :)
                </p>
            </div>
            <TextShareButton text={copyText} />
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