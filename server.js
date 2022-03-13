'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');

const mysql = require('mysql2');
const e = require('express');

const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "rdanjole",
    password: "H00270233",
    database: "rdanjole_epic"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/epicLogin.html'));
});
app.post('/login/', function (req, res) {
    var femail = req.body.facultyemail;
    var fpw = req.body.facultypw;

    var sqlsel = 'select * from epicusers where useremail = ?';

    var inserts = [femail];

    var sql = mysql.format(sqlsel, inserts);
    console.log("SQL: " + sql);
    con.query(sql, function (err, data) {
        if (data.length > 0) {
            console.log("User Name Correct:");
            console.log(data[0].userpassword);
            bcrypt.compare(fpw, data[0].userpassword, function (err, passwordCorrect) {
                if (err) {
                    throw err
                } else if (!passwordCorrect) {
                    console.log("Password incorrect")
                } else {
                    console.log("Password correct")
                    res.send({ redirect: '/admin/emailCourses.html' })
                }
            })
        } else {
            console.log("Incorrect user name or password");
        }
    });
});

app.get('/getfacname', function (req, res){

    var sqlsel = "SELECT `userid` , `username` FROM epicusers";
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/getcourname', function (req, res){

    var sqlsel = "SELECT `courseid` , `courseprefix` , `coursenumber` , `coursesection` , `coursesemester` , `courseyear` FROM epiccourses";
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/email/', function (req, res){
    var cprefix = req.query.courseprefix;
    var cnumber = req.query.coursenumber;
    var csection = req.query.coursesection;
    var csemester = req.query.coursesemester;
    var cyear = req.query.courseyear;
    var fname = req.query.facultyname;

    var sqlsel = 'SELECT epiccourses.*, epicusers.username, epicusers.useremail from epiccourses ' +
    'inner join epicusers on epicusers.userid = epiccourses.facid ' +
    'where courseprefix LIKE ? and '
    + 'coursenumber LIKE ? and coursesection LIKE ? and coursesemester LIKE '
    + '? and courseyear LIKE ? and username LIKE ?';
    var inserts = ['%' + cprefix + '%', '%' + cnumber + '%', '%' + csection + '%', '%' + csemester + '%', '%' + cyear + '%', '%' + fname + '%'];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/view/', function (req, res){
    var cprefix = req.query.courseprefix;
    var cnumber = req.query.coursenumber;
    var csection = req.query.coursesection;
    var csemester = req.query.coursesemester;
    var cyear = req.query.courseyear;

    var sqlsel = 'SELECT epiccourses.*, epicresults.resultslo, epicresults.resultindicator, epicresults.resultthree, epicresults.resulttwo, epicresults.resultone from epiccourses ' +
    'inner join epicresults on epicresults.courid = epiccourses.courseid ' +
    'where courseprefix LIKE ? and '
    + 'coursenumber LIKE ? and coursesection LIKE ? and coursesemester LIKE '
    + '? and courseyear LIKE ?';
    var inserts = ['%' + cprefix + '%', '%' + cnumber + '%', '%' + csection + '%', '%' + csemester + '%', '%' + cyear + '%'];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/search/', function (req, res){
    var cprefix = req.query.courseprefix;
    var cnumber = req.query.coursenumber;
    var csection = req.query.coursesection;
    var csemester = req.query.coursesemester;
    var cyear = req.query.courseyear;
    var ccomplete = req.query.coursecompleted;
    var fname = req.query.facultyname;

    if (ccomplete == 1 || ccomplete == 0) {
        var completeaddon = ' and coursecompleted = ?';
        var completeaddonvar = ccomplete;
    } else {
        var completeaddon = ' and coursecompleted LIKE ?';
        var completeaddonvar = '%%';
    }

    var sqlsel = 'SELECT epiccourses.*, epicusers.username from epiccourses ' +
    'inner join epicusers on epicusers.userid = epiccourses.facid ' +
    'where courseprefix LIKE ? and '
    + 'coursenumber LIKE ? and coursesection LIKE ? and coursesemester LIKE '
    + '? and courseyear LIKE ? and username LIKE ?' + completeaddon;
    var inserts = ['%' + cprefix + '%', '%' + cnumber + '%', '%' + csection + '%', '%' + csemester + '%', '%' + cyear + '%', '%' + fname + '%', completeaddonvar];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.post('/faculty', function (req, res) {
    var fname = req.body.facultyname;
    var femail = req.body.facultyemail;
    var fpw = req.body.facultypw;
    console.log(fpw);

    var saltRounds = 10;
    var theHashedPW = '';
    bcrypt.hash(fpw, saltRounds, function (err, hashedPassword) {
        if (err) {
            console.log("Bad");
            return
        } else {
            theHashedPW = hashedPassword;

            var sqlins = "INSERT INTO epicusers (username, useremail, userpassword) VALUES (?, ?, ?)";

            var inserts = [fname, femail, theHashedPW];

            var sql = mysql.format(sqlins, inserts);

            con.execute(sql, function(err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.redirect('insertFaculty.html');
                res.end();
            });
        }
    });
});

app.post('/course', function (req, res) {
    var fname = req.body.facultyname;
    var csemester = req.body.coursesemester;
    var cyear = req.body.courseyear;
    var cprefix = req.body.courseprefix;
    var cnumber = req.body.coursenumber;
    var csection = req.body.coursesection;

    var sqlins = "INSERT INTO epiccourses (userid, courseprefix, coursenumber, coursesection, coursesemester, courseyear) VALUES (?, ?, ?, ?, ?, ?)";

    var inserts = [fname, cprefix, cnumber, csection, csemester, cyear];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('insertCourse.html');
        res.end();
    });

});

app.post('/slo', function (req, res) {
    var cname = req.body.coursename;
    var cslo = req.body.courseslo;
    var sindicator = req.body.sloindicator;
    var sthree = req.body.slothree;
    var stwo = req.body.slotwo;
    var sone = req.body.sloone;

    var sqlins = "INSERT INTO epicresults (courid, resultslo, resultindicator, resultthree, resulttwo, resultone) VALUES (?, ?, ?, ?, ?, ?)";

    var inserts = [cname, cslo, sindicator, sthree, stwo, sone];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('insertCourse.html');
        res.end();
    });

});

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
