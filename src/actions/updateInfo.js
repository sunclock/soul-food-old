export default function updateInfo(state, payload) {
    return {
        ...state,
        data: {
            ...payload,
        },
    };
}