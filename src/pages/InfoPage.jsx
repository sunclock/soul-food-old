import React from 'react';
import { useForm } from "react-hook-form";
import { withRouter } from "react-router-dom";
import { useStateMachine } from "little-state-machine";
import updateInfo from "../actions/updateInfo";
function InfoPage({ location, history }) {

    // console.log(location);
    // console.log(history);
    const { handleSubmit, register } = useForm();
    const { actions } = useStateMachine({ updateInfo });
    const onSubmit = data => {
        actions.updateInfo({
            sex: data.sex,
            age: data.age,
            occupation: data.occupation
        });
        history.push("/question");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="yellow-outline-bold" id="info-title">주문받겠습니다</h1>
            <div class="box purple-border-box">
                <label className="info-label">성별</label>
                <select defaultValue="선택" name="sex" ref={register}>
                    <option value="선택" disabled hidden>선택</option>
                    <option value="female">여자</option>
                    <option value="male">남자</option>
                    <option value="other">그 외</option>
                </select>
                <label className="info-label">나이</label>
                <select defaultValue="선택" name="age" ref={register}>
                    <option value="선택" disabled hidden>선택</option>
                    <option value="teen">20대 이하</option>
                    <option value="earlyTwenties">20~24세</option>
                    <option value="lateTwenties">25~29세</option>
                    <option value="thirties">30대</option>
                    <option value="forties">40대</option>
                    <option value="fifties">50대</option>
                    <option value="sixtiesAbove">60대 이상</option>
                </select>
                <label className="info-label">직업</label>
                <select defaultValue="선택" name="occupation" ref={register}>
                    <option value="선택" disabled hidden>선택</option>
                    <option value="student">학생</option>
                    <option value="officeWorker">직장인</option>
                    <option value="stayAtHome">전업주부</option>
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
// TODO("Start cook icon image need to be fixed")
export default withRouter(InfoPage);