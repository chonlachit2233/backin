var express = require('express');
var cors = require('cors');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mydb'
});

var app = express();
app.use(cors());
app.use(express.json());

app.listen(5000, function () {
    console.log('CORS-enabled web server on port 5000');
});

// ดึงข้อมูลผู้ใช้ทั้งหมด
app.get('/users', function(req, res, next) {
    connection.query('SELECT * FROM users', function(err, results, fields) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// ดึงข้อมูลผู้ใช้ตาม ID
app.get('/users/:id', function(req, res, next) {
    const id = req.params.id;
    connection.query(
        'SELECT * FROM users WHERE id = ?',
        [id],
        function(err, results, fields) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(results);
        }
    );
});

// เพิ่มข้อมูลผู้ใช้ใหม่
app.post('/users/create', function(req, res, next) {
    const { fname, lname, username, password, avater } = req.body;
    connection.query(
        'INSERT INTO users (fname, lname, username, password, avater) VALUES (?, ?, ?, ?, ?)',
        [fname, lname, username, password, avater],
        function(err, results, fields) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: "User created successfully", results });
        }
    );
});

// อัปเดตข้อมูลผู้ใช้
app.put('/users/update', function(req, res, next) {
    const { fname, lname, username, password, avater, id } = req.body;
    connection.query(
        'UPDATE users SET fname=?, lname=?, username=?, password=?, avater=? WHERE id=?',
        [fname, lname, username, password, avater, id],
        function(err, results, fields) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: "User updated successfully", results });
        }
    );
});
app.delete('/users/delete', function(req,res,next){
    const id = req.body.id;
    connection.query(
        'DELETE FROM  users WHERE id=?',
        [id],
        function(err, results, fields){
            res.status(200).json(results);
        }
    );
}
);
