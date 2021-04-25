import { CopyToClipboard } from 'react-copy-to-clipboard';
import link from './assets/pictures/link.png';

export default function TextShareButton(result) {
    console.log(result);
    return (
        <div className="link-container" id="left-link-container">
            <CopyToClipboard text={result.text}>
            <button className="link-btn" id="text-link-btn">
                <img className="link-img" src={link} alt="링크 공유하기" />
            </button>
            </CopyToClipboard>
            <label id="link-label" for="text-link-btn">링크 공유</label>
        </div>
    )
    
}