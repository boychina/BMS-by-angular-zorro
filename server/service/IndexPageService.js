var IndexPageDAO = require('../DAO/IndexPageDAO');

//获取页面折线图部分数据
exports.getTopLineData = function(func) {
    IndexPageDAO.findTopLineData(function(data){
        let xAxis = [], amounts = [], parm = {};
        data.map((val) => {
            xAxis.push(val.time);
            amounts.push(val.amount);
        });
        parm = {
            "xAxis": xAxis,
            "amounts": amounts
        };
        func(parm);
    });
}

//获取VIP用户模块的数据
exports.getVipUserData = function(parm, func) {
    IndexPageDAO.findVipUserData(parm, function(data){
        let criticalAlarm = [],
            warningAlarm = [],
            criticalEventAlarm = [],
            warningEventAlarm = [],
            alarmParm = {},
            criticalAlarmTrend = 0,
            warningAlarmTrend = 0,
            criticalEventAlarmTrend = 0,
            warningEventAlarmTrdnd = 0,
            prevWarningNum = 0,
            prevCriticalNum = 0,
            prevWarningEventNum = 0,
            prevCriticalEventNum = 0;
        data.map((val) => {
            if(val.alarmTime > parm.midTime && val.alarmTime <= parm.endTime){
                if (val.alarmType === "critical") {
                    criticalAlarm.push(val.alarmType);
                } else if (val.alarmType === 'warning') {
                    warningAlarm.push(val.alarmType);                    
                } else {}

                if(val.alarmEventType === 'critical') {
                    criticalEventAlarm.push(val.alarmEventType);
                } else if(val.alarmEventType === 'warning') {
                    warningEventAlarm.push(val.alarmEventType);
                } else {}
            } else {
                if (val.alarmType === "critical") {
                    prevCriticalNum++;
                } else if (val.alarmType === 'warning') {
                    prevWarningNum++;
                } else {}

                if(val.alarmEventType === 'critical') {
                    prevCriticalEventNum++;
                } else if(val.alarmEventType === 'warning') {
                    prevWarningEventNum++;
                } else {}
            }
        });

        criticalAlarmTrend = criticalAlarm.length !== prevCriticalNum ? (criticalAlarm.length > prevCriticalNum ? 1 : -1) : 0;
        warningAlarmTrend = warningAlarm.length !== prevWarningNum ? (warningAlarm.length > prevWarningNum ? 1 : -1) : 0;
        criticalEventAlarmTrend = criticalEventAlarm.length !== prevCriticalEventNum ? (criticalEventAlarm.length > prevCriticalEventNum ? 1 : -1) : 0;
        warningEventAlarmTrdnd = warningEventAlarm.length !== prevWarningEventNum ? (warningEventAlarm.length > prevWarningEventNum ? 1 : -1) : 0;
        alarmParm = {
            "criticalAlarm": criticalAlarm.length,
            "warningAlarm": warningAlarm.length,
            "criticalEventAlarm": criticalEventAlarm.length,
            "warningEventAlarm": warningEventAlarm.length,
            "criticalAlarmTrend": criticalAlarmTrend,
            "warningAlarmTrend": warningAlarmTrend,
            "criticalEventAlarmTrend": criticalEventAlarmTrend,
            "warningEventAlarmTrend": warningEventAlarmTrdnd
        }
        func(alarmParm);
    });
}