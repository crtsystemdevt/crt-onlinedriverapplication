const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

const routes = require('./routes/process');

const app = express();

//LOCAL
 const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port:3306,
    database: 'rchexpor_sedev',
    multipleStatements: true
}); 

db.connect((err) =>{
    if(err){
        console.log(err);
    }else console.log('Connected to the Database!');
});

global.gdb = db;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './css')));
app.use(express.static(path.join(__dirname, "./js")));
app.use(fileUpload());

//USING ROUTES FOLDER
/* app.get('/addProduct', routes.addProducts);
app.post('/addProduct', routes.addProducts); */

app.get('/', routes.home);
app.get('/verify-email', routes.verify_email);
app.post('/email-verification', routes.email_verification)
app.get('/email-sent', routes.email_sent);
app.get('/existing_application', routes.existing_application)

app.get('/application/:id', routes.application);
app.get('/driver-information/:id', routes.driver_information);

app.post('/applicationPost/:id', routes.applicationPost)
app.post('/driver/addnewdriver/:id',routes.driver_addnewdriverpost)

app.get('/896a9b903ecd904a54d8a151b3c0ba6c2aa6342fa0e99a5d676e633f8db59e2ce2d0b7c5c15d97b6d536083725ce6f697421dab89074eb20b97b878d8860b4d3', routes.successful_application)
app.get('/896a9b903ecd904a54d8a151b3c0ba6c2aa6342fa0e99a5d676e633f8db59e2ce2d0b7c5c15d97b6d536083725ce6f697421dab89074eb20b97b878d8860b4d4', routes.sucessful_information_sheet)
app.get('*', routes.errorpage);

var port = process.env.PORT || 4000;
app.listen(port, function(){
    console.log('Listening on port '+ port);
});