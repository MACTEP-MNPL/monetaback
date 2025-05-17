export const getEmojiByAppStatus = (status) => {
    switch (status) {
        case 'new':
            return '🟢'
        case 'viewed':
            return '🔥'
        case 'in_progress':
            return '🔄'
        case 'completed':
            return '🤝'
        default:
            return ''
    }
}

