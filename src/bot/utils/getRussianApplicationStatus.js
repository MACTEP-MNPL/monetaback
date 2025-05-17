export const getRussianApplicationStatus = (status) => {
    switch(status) {
        case 'new':
            return 'Только создана'
        case 'viewed':
            return 'Новая'
        case 'in_progress':
            return 'В работе'
        case 'completed':
            return 'Выполнена'
    }
}

