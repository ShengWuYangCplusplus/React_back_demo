export const getAlarmType=(type)=>{
    switch(type){
        case 1:
            return '火灾报警'
        case 2:
            return '交通事故'
        case 3:
            return '群众性事件'
        case 4:
            return '刑事突发事件'
        default:
            return '普通报警'
    }
}

export const getAlarmStatus=(status)=>{
    switch(status){
        case 1:
            return '未处理'
        case 2:
            return '处理中'
        case 3:
            return '已解决'
        default:
            return '未处理'
    }
}
export const getAlarmLevel=(status)=>{
    switch(status){
        case 1:
            return '红色告警'
        case 2:
            return '橙色告警'
        case 3:
            return '蓝色告警'
        default:
            return '普通报警'
    }
}