import React, { useState } from "react";
import { RWebShare } from "react-web-share";

const shareLink = (url, title, soulFood) => {
    return (
        <div>
            <RWebShare
                data={{
                    text: 'πλλ§μ μμΈνΈλ μ¬λ¦¬νμ€νΈπ : ' + soulFood + '! [λλ§μ μμΈνΈλκ° κΆκΈνλ€λ©΄?]',
                    url: url,
                    title: title,
                }}
                onClick={() => console.log("shared successfully!")}
            >
                <button>κ³΅μ νκΈ° π</button>
            </RWebShare>
        </div>
    );
};

export default shareLink