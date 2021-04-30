import { CopyToClipboard } from 'react-copy-to-clipboard';
import link from './assets/pictures/link.png';

export default function TextShareButton(result) {
    console.log(result);
    const handleClick = () => {
        alert("결과를 복사했어요! 원하는 곳에 붙여넣기를 해보세요.")
    }
    return (<div className="box">
                <CopyToClipboard text={result.text}>
                    <button onClick={handleClick} className="link-btn" id="text-link-btn">
                        <img className="link-img" src={link} alt="링크 공유하기" />
                    </button>
                </CopyToClipboard>
                <label id="link-label" for="text-link-btn">링크 복사</label>
            </div>
    )

}