import React, { useEffect } from 'react'
import kakaoTalk from './assets/pictures/kakao.png'
import preview from './assets/pictures/preview.jpeg'

const KakaoShareButton = (result) => {
    useEffect(() => {
        createKakaoButton()
    }, [])

    const createKakaoButton = () => {
        // kakao sdk script이 정상적으로 불러와졌으면 window.Kakao로 접근이 가능합니다
        if (window.Kakao) {
            const kakao = window.Kakao

            // 중복 initialization 방지
            if (!kakao.isInitialized()) {
                // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
                kakao.init(process.env.REACT_APP_KAKAO_KEY)
            }

            kakao.Link.createDefaultButton({
                // Render 부분 id=kakao-link-btn 을 찾아 그부분에 렌더링을 합니다
                container: '#kakao-link-btn',
                objectType: 'feed',
                content: {
                    title: '소울푸드 심리테스트',
                    description: result.text,
                    imageUrl: preview, // i.e. process.env.FETCH_URL + '/logo.png'
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
                social: {
                    likeCount: 77,
                    commentCount: 55,
                    sharedCount: 333,
                },
                buttons: [
                    {
                        title: '웹으로 보기',
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href,
                        },
                    },
                ],
            })
        }
    }
    return (
        <div className="link-container" id="right-link-container">
            {/* Kakao share button */}
            <button className="link-btn" id="kakao-link-btn">
                <img className="link-img" src={kakaoTalk} alt="kakao-share-icon" />
            </button>
            <label for="kakao-link-btn" className="link-label">카톡 공유</label>
        </div>
    )
}
export default KakaoShareButton