const router = require('express').Router();
const db = require('../sql')


router.post('/attendance', function (req, res) {
    let presentDay = []
    const timeArr = []
    let totle = 0
    let totletime
    const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN
    const id = req.body.id
    const date = new Date(req.body.date)
    const month = date.getMonth();
    const year = date.getFullYear();
    const totalDay = new Date(year, month + 1, 0).toLocaleDateString()
    const first_Day = new Date(year, month + 1, 1).toLocaleDateString()
    db.query(`SELECT * FROM attendance WHERE id = "${id}" && date BETWEEN "${first_Day}" AND "${totalDay}" `, (err, result) => {
        if (err) throw err
        result.map(day => timeArr.push(day))
        if (timeArr.length >= 1) {
            timeArr.map(day => {
                presentDay.push({
                    day: typeof day.date == undefined ? "0" : day.date.split("/")[1],
                    month: typeof day.date == undefined ? "0" : day.date.split("/")[0],
                    year: typeof day.date == undefined ? "0" : day.date.split("/")[2],
                    entry: typeof day.start == undefined ? "0" : day.start,
                    exit: typeof day.end == undefined ? "0" : day.end,
                })
                if (day.start != null && day.end != null) {
                    const exit = new Date("1/1/1970 " + day.end);
                    const entry = new Date("1/1/1970 " + day.start)
                    const diff = Math.max(entry, exit) - Math.min(entry, exit)
                    totle += diff
                }else{
                    totle += 0
                }
            })
            const hrs = Math.floor(totle / HRS)
            const min = Math.floor((totle % HRS) / MIN).toLocaleString('en-US', { minimumIntegerDigits: 2 })
            totletime = hrs + ":" + min
        }
        presentDay.push(totletime)
        res.json(presentDay)
    })

})

router.post('/attendance/entry', (req, res) => {
    const { id, date, entry } = req.body
    console.log(id + date + entry)
    db.query(`SELECT start FROM attendance WHERE date = '${date}' && id ='${id}'`, (err, result) => {
        if (err) throw err
        if (result.length === 0) {
            db.query(`INSERT INTO attendance(id,date,start) VALUES ("${id}","${date}","${entry}")`, (err, result) => {
                if (err) throw err
                res.status(200).send('add time')
            })
        }
        db.query(`UPDATE attendance SET start = "${entry}" WHERE date = "${date}" && id ='${id}'`, (err, result) => {
            if (err) throw err
            res.status(200).send('add time')
        })
    })
})
router.post('/attendance/exit', (req, res) => {
    const { id, date, exit } = req.body
    db.query(`SELECT start,end FROM attendance WHERE date = "${date}" && id ='${id}'`, (err, result) => {
        if (err) throw err
        if (result.length !== 0) {
            if (!result[0].start) {
                res.status(400).send('please add first start time')
            }
            db.query(`UPDATE attendance SET end = "${exit}" WHERE date = "${date}" && id ='${id}'`, (err, result) => {
                if (err) throw err
                res.status(200).send('add exit time')
            })
        } else {
            res.status(400).send('please add first start time')
        }
    })
})

module.exports = router;