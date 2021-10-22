export const timeHourCalculate = (start,end) =>{
  
    const diff = Math.max(new Date("1/1/1970 " + end),new Date("1/1/1970 " + start)) - Math.min(new Date("1/1/1970 " + end),new Date("1/1/1970 " + start)) 
    const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN
    
    const hrs = Math.floor(diff/HRS)
    const min = Math.floor((diff%HRS)/MIN).toLocaleString('en-US', {minimumIntegerDigits: 2})
    
    return `${hrs}:${min}`
  }