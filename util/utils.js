var utilsFunc = {}

/**
 * 月份处理
 * @return Boolean
 */


utilsFunc.transMonth = function (month) {
    var monthEnglish = "May"
    switch (month) {
        case "1":
            monthEnglish = "January";
            break;
        case "2":
            monthEnglish = "February";
            break;
        case "3":
            monthEnglish = "March";
            break;
        case "4":
            monthEnglish = "April";
            break;
        case "5":
            monthEnglish = "May";
            break;
        case "6":
            monthEnglish = "June";
            break;
        case "7":
            monthEnglish = "July";
            break;
        case "8":
            monthEnglish = "August";;
            break;
        case "9":
            monthEnglish = "September";;
            break;
        case "10":
            monthEnglish = "October";;
            break;
        case "11":
            monthEnglish = "November";;
            break;
        case "12":
            monthEnglish = "December";;
            break;
    }
    return monthEnglish;
}

module.exports = utilsFunc