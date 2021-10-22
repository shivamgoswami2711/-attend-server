const router = require('express').Router();
const bcrypt = require('bcrypt');
const db = require('../../sql/sql')

router.post('/ragistration', async (req, res) => {
    console.log("hejsdkf")
    try {
        const { name, email, password } = req.body
        const salt = await bcrypt.genSalt()
        const heshedPassword = await bcrypt.hash(password, salt)
        db.query(` SELECT email FROM users where email =  '${email}'`, (err, result) => {
            if (err) throw err

            if (result.length === 0) {
                db.query(`INSERT INTO users(name, email, password) VALUES ('${name}','${email}','${heshedPassword}')`, function (err, result) {
                    if (err) throw err;
                });
                res.status(201).send()
            } else {
                res.status(409).send("email already exists")
            }
        })

    } catch {
        res.status(500).send()
    }
})

router.post('/login', async (req, res) => {
    console.log("hello")
    const { email, password } = req.body
    console.log(email)
    console.log(password)
    db.query(` SELECT * FROM users where email =  '${email}'`, (err, result) => {
        if (result.length !== 0) {
            try {
                bcrypt.compare(password, result[0].password).then(function (PassResult) {
                    console.log("Compareing")
                    if (PassResult) {
                        console.log("successfully")
                        const {id,name,email,authority,userWorkList,cost}=result[0]
                        res.status(201).json({id,name,email,authority,userWorkList,cost})
                    } else {
                        res.status(401).send("login failed")
                        console.log("gai bhas pani me ")
                    }})
            } catch {
                res.status(500).send()
            }
        }
        else {
            res.status(400).send("email not already exists")
        }
    })
})



module.exports = router;