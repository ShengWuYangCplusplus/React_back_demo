import moment from 'moment'

export const getDayTime=()=>{
    return moment().format('YYYY-MM-DD HH:mm:ss')
}