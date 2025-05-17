export const getRussianApplicatoinType = (type) => {
    switch (type) {
        case 'fea':
            return 'ВЭД'
        case 'swift':
            return 'Swift/Sepa'
        case 'cash_exchange':
            return 'Наличные обмен'
        case 'cash_withdrawal':
            return 'Выдача наличных'
    }
}

