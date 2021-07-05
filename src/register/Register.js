import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import "./Register.css";

const initialInfo = {
    age: '선택',
    sex: '선택',
    job: '선택',
};


function Register({ history }) {
    const [info, setInfo] = useState(initialInfo);

    const handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        setInfo({ ...info, [name]:value});
    }

    const handleSubmit = (e) => {
        if (info.sex === initialInfo.sex | 
            info.age === initialInfo.age | 
            info.job === initialInfo.job) 
            {
                alert("성별, 나이, 직업을 모두 선택해주세요!");
                return 0;
             }
        history.push("/qna");
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="yellow-outline-bold" id="info-title">주문받겠습니다</h1>
            <div class="box purple-border-box" id="info-box">
                <label className="info-label">성별</label>
                <select value={info.sex} name="sex" onChange={handleChange}>
                    <option value="선택">선택</option>
                    <option value="female">여자</option>
                    <option value="male">남자</option>
                    <option value="other">그 외</option>
                </select>
                <label className="info-label">나이</label>
                <select value={info.age} name="age" onChange={handleChange}>
                    <option value="선택">선택</option>
                    <option value="teen">20대 이하</option>
                    <option value="earlyTwenties">20~24세</option>
                    <option value="lateTwenties">25~29세</option>
                    <option value="thirties">30대</option>
                    <option value="forties">40대</option>
                    <option value="fifties">50대</option>
                    <option value="sixtiesAbove">60대 이상</option>
                </select>
                <label className="info-label">직업</label>
                <select value={info.job} name="job" onChange={handleChange}>
                    <option value="선택">선택</option>
                    <option value="student">학생</option>
                    <option value="officeWorker">직장인</option>
                    <option value="stayAtHome">전업주부</option>
                    <option value="selfEmployed">개인 사업 / 프리랜서 </option>
                    <option value="other">그 외</option>
                </select>
            </div>
            <div className="box" id="info-start-box">
                <input id="info-submit-btn" type="submit" /><br />
                <label for="infoButton" className="locus">요리 시작하기</label>
            </div>
        </form>
    );
}

export default withRouter(Register);