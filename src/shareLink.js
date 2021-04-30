import React, { useState } from "react";
import { RWebShare } from "react-web-share";

const shareLink = (url, title, soulFood) => {
    return (
        <div>
            <RWebShare
                data={{
                    text: '🍀나만의 소울푸드 심리테스트🍀 : ' + soulFood + '! [나만의 소울푸드가 궁금하다면?]',
                    url: url,
                    title: title,
                }}
                onClick={() => console.log("shared successfully!")}
            >
                <button>공유하기 🔗</button>
            </RWebShare>
        </div>
    );
};

export default shareLink