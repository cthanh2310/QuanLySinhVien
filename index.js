var express = require('express');
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views','./views');
app.listen(3000);
var pg = require('pg');

var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var config = {
    user: 'postgres',
    database: 'students',
    password: 'admin',
    host: 'localhost',
    post : '5432',
    max: 10,
    idleTimeoutMillis:  30000,
};
const pool = new pg.Pool(config);


app.get('/sinhvien/list',function(req, res){
    pool.connect(function(err, client, done){
        if(err){
            return console.log('Error : ', err);
        }
        client.query('SELECT * FROM sinhvien order by id asc', function(err, result){
// Done() to release the client back to the pool
            done();
            
            if(err){
                res.end();
                return console.log('Error running query', err);
            }
            // console.log(result.rows[2].email);
            res.render("sinhvien_list.ejs",{
                danhsach:result
            });
        });
    }); // Lay database
})
app.get('/sinhvien/them',function(req, res){
    res.render('sinhvien_insert.ejs');
})

app.post('/sinhvien/them' , urlencodedParser,function(req, res){
    pool.connect(function( err, client, done){
        if(err){
            return console.log('Error : ', err);
        }
        var email = req.body.txtEmail;
        var hoten = req.body.txtHoTen;
        client.query(`INSERT INTO sinhvien(hoten, email) VALUES('${hoten}','${email}')`, function(err, result){
// Done() to release the client back to the pool
            done();
            
            if(err){
                res.end();
                return console.log('Error running query', err);
            }
            // console.log(result.rows[2].email);
            res.send('Done!')
        });
    }); // Lay database
})
app.get('/sinhvien/sua/:id',function(req, res){
    pool.connect(function(err, client, done){
        if(err){
            return console.log('Error : ', err);
        }
        var id = req.params.id;
        client.query(`SELECT * FROM sinhvien WHERE id = ${id} `, function(err, result){
// Done() to release the client back to the pool
            done();
            
            if(err){
                res.end();
                return console.log('Error running query', err);
            }
            // console.log(result.rows[2].email);
            res.render("sinhvien_edit.ejs",{

                sinhvien:result.rows[0]
            });
        });
    }); // Lay database
})
app.post('/sinhvien/sua' , urlencodedParser,function(req, res){
    pool.connect(function( err, client, done){
        if(err){
            return console.log('Error : ', err);
        }
        var email = req.body.txtEmail;
        var hoten = req.body.txtHoTen;
        var id = req.body.txtId;
        client.query(`UPDATE sinhvien SET hoten='${hoten}', email = '${email}' WHERE id = '${id}'`, function(err, result){
// Done() to release the client back to the pool
            done();
            
            if(err){
                res.end();
                return console.log('Error running query', err);
            }
            // console.log(result.rows[2].email);
            res.redirect("/sinhvien/list");
        });
    }); // Lay database
})

app.get('/sinhvien/xoa/:id',function(req, res){
    pool.connect(function(err, client, done){
        if(err){
            return console.log('Error : ', err);
        }
        var id = req.params.id;
        client.query(`DELETE FROM sinhvien WHERE id = ${id} `, function(err, result){
// Done() to release the client back to the pool
            done();
            
            if(err){
                res.end();
                return console.log('Error running query', err);
            }
            // console.log(result.rows[2].email);
            res.redirect('/sinhvien/list');
        });
    }); // Lay database
})


app.get('/', function(req, res){
    res.render('main.ejs');
})