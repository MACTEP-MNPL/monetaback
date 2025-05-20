import { getRapiraBuyDollar, getRapiraSellDollar } from './Rapira.js'
import { getGrinexBuyDollar } from './Grinex.js'
import { getInvestingDollar } from './Investing.js'
import { getXeRates } from './XE.js'
import cron from 'node-cron'

export class createApi {
    constructor() {
        this.GrinexBuyUsdt = 0
        this.InvestingUsd = 0
        this.XeEuro = 0

        this.timestamp = 0

        // Run update every 20 seconds
        cron.schedule('*/20 * * * * *', async () => {
            console.log("Rapira rates update " + new Date().toLocaleString())
            await this.update()
        })

        // Initial update
        this.update()
    }

    async update() {
        try {
            this.RapiraBuyUSDT = await getRapiraBuyDollar()
            this.RapiraSellUSDT = await getRapiraSellDollar()

            //this.GrinexBuyUsdt = await getGrinexBuyDollar() //81.62
            //this.GrinexSellUsdt = await getGrinexSellDollar() //81.62
            //this.InvestingUsd = await getInvestingDollar() //81.012900
            //this.XeEuro = (await getXeRates()).XEDollar //1.126734
            
            const date = new Date()
            date.setHours(date.getHours() + 3)
            
            this.timestamp = date.toLocaleString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'UTC'
            }).replace(',', ' |')
        } catch (error) {
            console.error('Error updating Rapira rates:', error)
        }
    }

    getRates() {
        return {
            buy: this.RapiraBuyUSDT,
            sell: this.RapiraSellUSDT,
            timestamp: this.timestamp
        }
    }
}
