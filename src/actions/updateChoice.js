export default function updateChoice(state, response) {
    return {
        ...state,
        response,
    };
}