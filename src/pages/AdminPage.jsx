import React, { useState, useEffect } from "react";
import { firebase, firestore } from "../firebase";

const db = firestore; //store 사용 

export default function Admin() {
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState('로딩중이에요');
    const [userDoc, setUserDoc] = useState();

    async function removeDuplicate(db) {

        // [parameter]
        // db: firestore

        console.log("removeDuplicate() called");

        const userRef = db.collection('users');
        const snapshot = await userRef.where('soulFood', 'array-contains', '로딩중이에요').get();

        if (snapshot.empty) {
            console.log('\nremoveDuplicate(): 지울 문서가 없어요')
            setIsLoading(true);
            return;
        }

        setIsLoading(false);
        snapshot.forEach(doc => {
            setStatus('중복 문서를 지우는 중이에요')
            console.log('중복 문서를 지우는 중이에요')
            if (doc.data()) {
                console.log('문서 번호:', doc.id, '이 삭제됐어요!')
                userRef.doc(doc.id).delete();
            }
            setIsLoading(true);
        });
    };

    async function getQuestionAndChoice(db, n) {

        // [parameter]
        // db: firestore
        // n: int, 1 <= n <= 16
        // [return]
        // res: tuple of arrays, (body, choiceFirst, choiceSecond)

        const questionRef = db.collection('questions').doc(String(n));

        const doc = await questionRef.get();

        if (!doc.exists) {
            console.log('getQuestion(): No such document!');
        } else {
            let body = doc.data().body
            let choiceFirst = doc.data().example.choiceFirst
            let choiceSecond = doc.data().example.choiceSecond
            let res = (body, choiceFirst, choiceSecond)
            return res
        }
    }

    async function setPresetDocument(db) {

        const preset = {
            count: 0,
            editedAt: firebase.firestore.Timestamp.fromDate(new Date()),
            body: '',
            choiceFirst: {
                body: '',
                count: 0,
                analysis: {
                    age: {
                        teen: 0,
                        earlyTwenties: 0,
                        lateTwenties: 0,
                        thirties: 0,
                        forties: 0,
                        fifties: 0,
                        sixtiesAbove: 0
                    },
                    sex: {
                        male: 0,
                        female: 0,
                        other: 0
                    },
                    occupation: {
                        student: 0,
                        officeWorker: 0,
                        stayAtHome: 0,
                        selfEmployed: 0,
                        other: 0
                    }
                }
            },
            choiceSecond: {
                body: '',
                count: 0,
                analysis: {
                    age: {
                        teen: 0,
                        earlyTwenties: 0,
                        lateTwenties: 0,
                        thirties: 0,
                        forties: 0,
                        fifties: 0,
                        sixtiesAbove: 0
                    },
                    sex: {
                        male: 0,
                        female: 0,
                        other: 0
                    },
                    occupation: {
                        student: 0,
                        officeWorker: 0,
                        stayAtHome: 0,
                        selfEmployed: 0,
                        other: 0
                    }
                }
            }
        }

        const analRef = db.collection('analysis');

        for (let n = 1; n < 17; n++) {
            await analRef.doc(String(n)).set(preset);
        }
    }

    async function setUserList(db) {

        // [parameter]
        // db: firestore
        // [return]
        // userList: list of Object 'User'

        console.log("setUserList() called");

        const userRef = db.collection('users');

        const snapshot = await userRef.get();

        if (snapshot.empty) {
            console.log('setUserList(): 읽어올 문서가 없어요')
            setIsLoading(true);
            return;
        }

        setIsLoading(false);

        let count = 0;
        let userList = [];

        snapshot.forEach(doc => {
            if (doc.data()) {

                let User = new Object();
                User.response = doc.data().response
                User.age = doc.data().age
                User.occupation = doc.data().occupation
                User.sex = doc.data().sex
                userList.push(User)
                count += 1;
            }
        })

        console.log('\n총 ', count, '건의 통계를 만들었어요!')
        setIsLoading(true);
        setUserDoc(userList);
        setUserAnalysis(db, userList);
    }

    async function setUserAnalysis(db, userList) {

        const analRef = db.collection('analysis');

        for (const userDoc in userList) {
            let response = userDoc.response;
            let age = userDoc.age;
            let occupation = userDoc.occupation;
            let sex = userDoc.sex;

            for (let i = 0; i < 16; i++) {
                let n = i + 1;

                if (response[i] == '0') {
                    analRef.doc(String(n)).update({
                        count: firebase.firestore.FieldValue.increment(1),
                        'choiceFirst.count': firebase.firestore.FieldValue.increment(1)
                    });
                } else {
                    analRef.doc(String(n)).update({
                        count: firebase.firestore.FieldValue.increment(1),
                        'choiceSecond.count': firebase.firestore.FieldValue.increment(1)
                    });
                }
            }
        }
    }


return (
    <>
        <h1>soul_food <br />관리자 페이지</h1>
        <br />
        <div className="box">
            <button className="round-btn" onClick={() => { removeDuplicate(db) }}> 중복 문서 삭제하기</button>
            <br />
            <button className="round-btn" onClick={() => { setPresetDocument(db); setUserList(db);}}> 응답 통계 만들기</button>
            <br />
            <p>현재 상태</p>
            {!isLoading
                ? status.split('\n').map(line => {
                    return (<span>{line}<br /></span>)
                })
                : '로딩중이에요'}
        </div>
    </>
);
}