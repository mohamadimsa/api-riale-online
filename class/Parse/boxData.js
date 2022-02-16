const dayjs = require('dayjs')

class Parser {
    constructor(elements) {
        this.elements = elements
        this.results = []
    }

    parse() {
        for (let i in this.elements) {
            this.foo(this.elements[i])
        }
        this.results['time'] = dayjs().format('YYYY-MM-DD HH:mm:ss');
        return this.results;
    }

    foo(element){
        switch (element.id){
            case 239:
                this.results['isOnline'] = element.valueHuman === 'Yes'
                break;
            case 240:
                this.results['isOnMovement'] = element.valueHuman === 'Yes'
                break;
            case 21:
                this.results['signalStrength'] = element.value
                break;
            case 200:
                this.results['sleepingMode'] = element.valueHuman
                break;
            case 113:
                this.results['batteryLevel'] = element.value
                break;
            case 66:
                this.results['external_voltage'] = element.value
                break;
            case 24:
                this.results['speed'] = element.value
                break;
            case 67:
                this.results['battery_voltage'] = element.value
                break;
            case 68:
                this.results['battery_current_ampere'] = element.value
                break;
            case 17:
                this.results['axe_x'] = element.value
                break;
            case 18:
                this.results['axe_y'] = element.value
                break;
            case 19:
                this.results['axe_z'] = element.value
                break;
            case 15:
                this.results['ecoScore'] = element.value
                break;
            case 241:
                this.results['gsm_operator'] = element.valueHuman
                break;
            case 199:
                this.results['trip_odometer'] = element.value
                break;
            case 16:
                this.results['total_odometer'] = element.value
                break;
            case 14:
                this.results['deviceId'] = element.value
                break;
            case 13:
                this.results['avgFuel'] = element.value
                break;
        }
    }
}

module.exports = Parser;