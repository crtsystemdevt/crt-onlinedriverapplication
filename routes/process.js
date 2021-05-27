const { render } = require("ejs");
const request = require("request")
const nodemailer = require("nodemailer")
const sendinBlue = require('nodemailer-sendinblue-transport');

//HOME PAGE GET
exports.home = function(req, res){
  message = "Welcome to the homepage!";
  res.render('home', {message: message});
  gdb.query('SELECT * FROM app_personaldata ORDER BY applicationID DESC', (err, result) => {
    if(!err){
      if(result == 0){
        let appid = 1;
        //console.log(appid)
      }else{
        let appid = result[0].applicationID + 1;
        //console.log(appid)
      }
    }      
  })
}

//SMTP SERVICE PROVIDER SENDINBLUE
let transport = nodemailer.createTransport(sendinBlue({
      apiKey:'8YGAUORP6xcjw4Fv'
}))

exports.existing_application = function(req, res){
  res.render('existing_application')
}


exports.successful_application = function(req, res){
  res.render('successful_application')
}

exports.sucessful_information_sheet = function(req,res){
  res.render('successful_information')
}

//GET VERIFY EMAIL PAGE
exports.verify_email = function (req, res){
  let message =""
  res.render("verify-email",{message:message})
}

//POST VERIFY EMAIL
exports.email_verification = function(req,res){
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }
  
  var secretKey = "6Ld8KJMaAAAAAHmsBbWvVLbRKmGkKPMLRpLo1WCZ";
  
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    
    //USER DIDN'T CHECK OR CONFIRM CAPTCHA
    if(body.success !== undefined && !body.success) {
      let popMesssage = "please confirm captcha"
    }
    if(req.method == "POST"){
      let post = req.body;
      let email = post.email;
    
        gdb.connect(function(err){
          if(err){console.log(err)}
    
          gdb.query("SELECT * FROM app_request WHERE email=?",[email], function(err,result1){
            //IF NO EXISTING APPLICATION REQUEST 
            if(result1[0] == null){
              //IF ALREADY A APPLIED
              gdb.query("SELECT * FROM app_personaldata WHERE emailAddress=?",[email],function(err,ress1){
                //console.log(ress1[0]);
                if(ress1[0] == null){
                  gdb.query("SELECT * FROM app_request ORDER BY id DESC", (err,res1)=>{
                    //SAME ALGO FOR APPID ALGO
                    let requestID = Math.floor(Math.random() * 1000000000);
                    for(i=0;i<=res1.length;i++){
                      if(res1.length == 0){
                        requestID = Math.floor(Math.random() * 1000000000);
                      }else if(res1[0].id == requestID){
                        requestID = Math.floor(Math.random() * 1000000000);
                        continue;
                      }else{
                        //retain id
                      }
                    }
                    //console.log(parseInt(requestID));
        
                    gdb.query("INSERT INTO app_request (id,email,app_expiration) VALUES (?,?,CURRENT_TIMESTAMP+INTERVAL 1 DAY)",[requestID,email], function(err){
                      if(err){console.log(err)}
                        const message = {
                          from: 'crtsystemdevt@gmail.com', //the official email for the system
                          to: email,
                          subject: 'Application Request',
                          text: 'Greetings!\n\nWe have received your request to apply in our company.\nPlease click the link to start your application.\n\nlocalhost:4000/application/'+requestID + '\n\nThank you.',
                          html:' <h2> Greetings! </h2> ' 
                          + '<br/> '
                          + '<p> We have received your request to apply in our company. </p> '
                          + '<p> Please click the link to start your application. </p>'
                          + '<br/>'
                          + '<p> <a href="https://crt-onlinedriverapplication.herokuapp.com/application/' +requestID + '"> https://crt-onlinedriverapplication.herokuapp.com/application/' + requestID +'</a> </p>'
                          + '<br/>'
                          + '<p> Thank you. </p>'
                        };
                          
                        //SEND EMAIL
                        transport.sendMail(message, function (err, info) {
                        if(err) {console.log(err)}
                        else{console.log(info);}
                        res.redirect('/email-sent')
                      })
                    })
                  }) 
                }
                else if(ress1[0].emailAddress == email){
                  //console.log("You are already a driver");
                  let message = "You already applied to be a  driver of Continental Rental & Tours, Inc. Please wait for the response regarding your application"
                  return res.render('verify-email', {message:message})
                }
              })
            }else{
              //console.log("Already submitted application")
              return res.redirect('/existing_application')
            }
          })
          
        })
      }
  })
}

exports.email_sent = function (req, res){
  res.render("email-sent")
}


exports.applicationPost =  function(req, res){
  //PERSONAL DATA
  let post = req.body;
  let firstName = post.firstName;
  let middleName = post.middleName;
  let lastName = post.lastName;
  let nickname = post.nickname;
  let sex = post.sex;
  let homeAddress = post.homeAddress;
  let birthdate = post.birthdate;
  if(birthdate == ''){
    birthdate = '1111-11-11';
  }

  let location = post.location

  let personalNumber = post.personalNumber;
  if(personalNumber == ''){
    personalNumber = 0;
  }

  //let emailAddress = post.emailAddress;
  let contactPerson_Name = post.contactPerson_Name;
  let contactPerson_Number = post.contactPerson_Number;
  if(contactPerson_Number == ''){
    contactPerson_Number = 0;
  }
  let contactPerson_Relationship = post.contactPerson_Relationship;
  let bloodType = post.bloodType;
  let religion = post.religion;
  let civilStatus = post.civilStatus;
  let height = post.height;
  let weight = post.weight;
  let app_status = "For Checking";
  let application_expiration = '1111-11-11';

  //EDUCATIONAL BACKGROUND
  let m_schoolName = post.m_schoolName;
  let m_from = post.m_from;
  if(m_from == ''){
    m_from = 0;
  }//
  let m_to = post.m_to;
  if(m_to == ''){
    m_to = 0;
  }//
  let m_awards = post.m_awards;

  let c_schoolName = post.c_schoolName;
  let c_from = post.c_from;
  if(c_from == ''){
    c_from = 0;
  }//
  let c_to = post.c_to;
  if(c_to == ''){
    c_to = 0;
  }//
  let c_awards = post.c_awards;

  let s_schoolName = post.s_schoolName;
  let s_from = post.s_from;
  if(s_from == ''){
    s_from = 0;
  }//
  let s_to = post.s_to;
  if(s_to == ''){
    s_to = 0;
  }//
  let s_awards = post.s_awards;

  let e_schoolName = post.e_schoolName;
  let e_from = post.e_from;
  if(e_from == ''){
    e_from = 0;
  }//
  let e_to = post.e_to;
  if(e_to == ''){
    e_to = 0;
  }//
  let e_awards = post.e_awards;

  let o_schoolName = post.o_schoolName;
  let o_from = post.o_from;
  if(o_from == ''){
    o_from = 0;
  }//
  let o_to = post.o_to;
  if(o_to == ''){
    o_to = 0;
  }//
  let o_awards = post.o_awards;

  let specialSkills = post.specialSkills;

  //WORK EXPERIENCE
  let workEmployer1 = post.workEmployer1;
  let workNumber1 = post.workNumber1;
  if(workNumber1 == ''){
    workNumber1 = 0;
  }//
  let workFrom1 = post.workFrom1;
  if(workFrom1 == ''){
    workFrom1 = 0;
  }//
  let workTo1 = post.workTo1;
  if(workTo1 == ''){
    workTo1 = 0;
  }//
  let workPosition1 = post.workPosition1;
  let workReasonForLeaving1 =  post.workReasonForLeaving1;

  let workEmployer2 = post.workEmployer2;
  let workNumber2 = post.workNumber2;
  if(workNumber2 == ''){
    workNumber2 = 0;
  }//
  let workFrom2 = post.workFrom2;
  if(workFrom2 == ''){
    workFrom2 = 0;
  }//
  let workTo2 = post.workTo2;
  if(workTo2 == ''){
    workTo2 = 0;
  }//
  let workPosition2 = post.workPosition2;
  let workReasonForLeaving2 =  post.workReasonForLeaving2;

  let workEmployer3 = post.workEmployer3;
  let workNumber3 = post.workNumber3;
  if(workNumber3 == ''){
    workNumber3 = 0;
  }//
  let workFrom3 = post.workFrom3;
  if(workFrom3 == ''){
    workFrom3 = 0;
  }//
  let workTo3 = post.workTo3;
  if(workTo3 == ''){
    workTo3 = 0;
  }//
  let workPosition3 = post.workPosition3;
  let workReasonForLeaving3 =  post.workReasonForLeaving3;

  //LICENSES
  let licenseNumber1 = post.licenseNumber1;
  let licenseExpiry1 = post.licenseExpiry1;
  let licenseRating1 = post.licenseRating1;
  let licenseRemarks1 = post.licenseRemarks1;
  let licenseType1 = post.licenseType1;
  let licenseRestrictions1 = post.restriction1;
  let licenseRestrictionStringed1 = JSON.stringify(licenseRestrictions1);

  //FAMILY BACKGROUND
  let father_name = post.father_name;
  let father_companyNumber = post.father_companyNumber;
  if(father_companyNumber == ''){
    father_companyNumber = 0;
  }//
  let father_birthdate = post.father_birthdate;
  if(father_birthdate == ''){
    father_birthdate = '1111-11-11';
  }//
  let father_occupation = post.father_occupation;

  let mother_name = post.mother_name;
  let mother_companyNumber = post.mother_companyNumber;
  if(mother_companyNumber == ''){
    mother_companyNumber = 0;
  }//
  let mother_birthdate = post.mother_birthdate;
  if(mother_birthdate == ''){
    mother_birthdate = '1111-11-11';
  }//
  let mother_occupation = post.mother_occupation;

  let sibling_name1 = post.sibling_name1;
  let sibling_companyNumber1 = post.sibling_companyNumber1;
  if(sibling_companyNumber1 == ''){
    sibling_companyNumber1 = 0;
  }//
  let sibling_birthdate1 = post.sibling_birthdate1;
  if(sibling_birthdate1 == ''){
    sibling_birthdate1 = '1111-11-11';
  }//
  let sibling_occupation1 = post.sibling_occupation1;

  let sibling_name2 = post.sibling_name2;
  let sibling_companyNumber2 = post.sibling_companyNumber2;
  if(sibling_companyNumber2 == ''){
    sibling_companyNumber2 = 0;
  }//
  let sibling_birthdate2 = post.sibling_birthdate2;
  if(sibling_birthdate2 == ''){
    sibling_birthdate2 = '1111-11-11';
  }//
  let sibling_occupation2 = post.sibling_occupation2;

  let children_name1 = post.children_name1;
  let children_birthdate1 = post.children_birthdate1;
  if(children_birthdate1 == ''){
    children_birthdate1 = '1111-11-11';
  }//
  let children_name2 = post.children_name2;
  let children_birthdate2 = post.children_birthdate2;
  if(children_birthdate2 == ''){
    children_birthdate2 = '1111-11-11';
  }//

  let personcrt_name1 = post.personcrt_name1;
  let personcrt_relationship1 = post.personcrt_relationship1;
  let personcrt_name2 = post.personcrt_name2;
  let personcrt_relationship2 = post.personcrt_relationship2;
      
  //ESSAY
  let englishAnswer1 = post.englishAnswer1;
  let englishAnswer2 = post.englishAnswer2;
  let englishAnswer3 = post.englishAnswer3;
  let englishAnswer4 = post.englishAnswer4;
  let englishAnswer5 = post.englishAnswer5;
  let englishAnswer6 = post.englishAnswer6;
  let englishAnswer7 = post.englishAnswer7;
  let englishAnswer8 = post.englishAnswer8;
  let englishAnswer9 = post.englishAnswer9;
  let englishAnswer10 = post.englishAnswer10;
  let englishAnswer11 = post.englishAnswer11;
  let englishAnswer12 = post.englishAnswer12;
  let englishAnswer13 = post.englishAnswer13;
  let englishAnswer14 = post.englishAnswer14;
  let englishAnswer15 = post.englishAnswer15;

  let filipinoAnswer1 = post.filipinoAnswer1;
  let filipinoAnswer2 = post.filipinoAnswer2;
  let filipinoAnswer3 = post.filipinoAnswer3;
  let filipinoAnswer4 = post.filipinoAnswer4;
  let filipinoAnswer5 = post.filipinoAnswer5;
  let filipinoAnswer6 = post.filipinoAnswer6;
  let filipinoAnswer7 = post.filipinoAnswer7;
  let filipinoAnswer8 = post.filipinoAnswer8;
  let filipinoAnswer9 = post.filipinoAnswer9;
  let filipinoAnswer10 = post.filipinoAnswer10;
  let filipinoAnswer11 = post.filipinoAnswer11;
  let filipinoAnswer12 = post.filipinoAnswer12;
  let filipinoAnswer13 = post.filipinoAnswer13;

  //ATTACHMENTS
  let sss_number = post.sss_number;
  if(sss_number == ''){
    sss_number = 0;
  }//

  let pagibig_number = post.pagibig_number;
  if(pagibig_number == ''){
    pagibig_number = 0;
  }//

  let tin_number = post.tin_number;
  if(tin_number == ''){
    tin_number = 0;
  }//

  let philhealth_number = post.philhealth_number;
  if(philhealth_number == ''){
    philhealth_number = 0;
  }//

  let facebook = post.facebook;
  let viber = post.viber;

  let id = req.params.id;

  //DATE OF APPLICATION
  var application_date = new Date();
  var dd = application_date.getDate();
  var mm = application_date.getMonth()+1;
  var yyyy = application_date.getFullYear();
  if(dd < 10){
    dd = '0' + dd
  } 
  if(mm < 10){
    mm = '0' + mm
  } 
  application_date = yyyy + '-' + mm + '-' + dd;
  //console.log(application_date)

  gdb.query("SELECT * FROM app_request WHERE id=?",[id],function(err,result3){
    if(err){console.log(err)}
    let emailAddress = result3[0].email;

    let profile_photo ="";
      if(!req.files.profile_photo) {
        profile_photo = "";
      }
      else {        
        raw_profile_photo = req.files.profile_photo.data;
        let buff_raw_profile_photo = new Buffer.from(raw_profile_photo);
        profile_photo = buff_raw_profile_photo.toString('base64');
        console.log('profile photo uploaded');
      }

      let sss_file = "";
      if(!req.files.sss_file) {
        sss_file = "";
      }
      else {
        raw_sss_file = req.files.sss_file.data;
        let buff_raw_sss_file = new Buffer.from(raw_sss_file);
        sss_file = buff_raw_sss_file.toString('base64');
        console.log('profile photo uploaded');
      }

      let pagibig_file = "";
      if(!req.files.pagibig_file) {
        pagibig_file = "";
      }
      else {
        raw_pagibig_file = req.files.pagibig_file.data;
        let buff_raw_pagibig_file = new Buffer.from(raw_pagibig_file);
        pagibig_file = buff_raw_pagibig_file.toString('base64');
        console.log('pagibig file uploaded');
      }

      let tin_file = "";
      if(!req.files.tin_file) {
        tin_file = "";
      }
      else {
        raw_tin_file = req.files.tin_file.data;
        let buff_raw_tin_file = new Buffer.from(raw_tin_file);
        tin_file = buff_raw_tin_file.toString('base64');
        console.log('tin file uploaded');
      }

      let license_file1 = "";
      if(!req.files.license_file1) {
        license_file1 = "";
      }
      else {
        raw_license_file1 = req.files.license_file1.data;
        let buff_raw_license_file1 = new Buffer.from(raw_license_file1);
        license_file1 = buff_raw_license_file1.toString('base64');
        console.log('driver license 1 file uploaded');
      }

      let philhealth_file = "";
      if(!req.files.philhealth_file) {
        philhealth_file = "";
      }
      else {
        raw_philhealth_file = req.files.philhealth_file.data;
        let buff_raw_philhealth_file = new Buffer.from(raw_philhealth_file);
        philhealth_file = buff_raw_philhealth_file.toString('base64');
        console.log('philhealth file uploaded');
      }

      let mdr_file = "";
      if(!req.files.mdr_file) {
        mdr_file = "";
      }
      else {
        raw_mdr_file = req.files.mdr_file.data;
        let buff_raw_mdr_file = new Buffer.from(raw_mdr_file);
        mdr_file = buff_raw_mdr_file.toString('base64');
        console.log('mdr file uploaded');
      }

      let nbi_file = "";
      if(!req.files.nbi_file) {
        nbi_file = "";
      }
      else {
        raw_nbi_file = req.files.nbi_file.data;
        let buff_raw_nbi_file = new Buffer.from(raw_nbi_file);
        nbi_file = buff_raw_nbi_file.toString('base64');
        console.log('nbi file uploaded');
      }

      let brgyclearance_file = ""; 
      if(!req.files.brgyclearance_file) {
        brgyclearance_file = "";
      }
      else {
        raw_brgyclearance_file = req.files.brgyclearance_file.data;
        let buff_raw_brgyclearance_file = new Buffer.from(raw_brgyclearance_file);
        brgyclearance_file = buff_raw_brgyclearance_file.toString('base64');
        console.log('brgy clearance file uploaded');
      }

      gdb.query('SELECT * FROM app_personaldata ORDER BY applicationID DESC', (err, result) => {
        if (err) {
            console.log(err);
        } else {
          let appid = 1;
          if(!err){
            if(result == 0){
              appid = 1;
              //console.log(appid)
            }else{
              appid = result[0].applicationID + 1;
              //console.log(appid)
            }
          }
          //console.log(parseInt(appid));
          gdb.query("INSERT INTO app_personaldata (applicationID, firstName, middleName, lastName, nickname, sex, homeAddress, birthdate, location, personalNumber, emailAddress, contactPerson_Name, contactPerson_Number, contactPerson_Relationship, bloodType, religion, civilStatus, height, weight, app_status, application_date, application_expiration) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, firstName, middleName, lastName, nickname, sex, homeAddress, birthdate, location, 
            personalNumber, emailAddress, contactPerson_Name, contactPerson_Number, contactPerson_Relationship, bloodType, religion, civilStatus, height, weight, app_status, application_date, application_expiration], (err, result) => {
              if(err) {
                console.log(err)
                let message = 'Please only include alphanumeric characters';
                res.render('/', {message: message});
              }
              else if(!err){
                gdb.query("INSERT INTO app_educationalbg (educationalbg_ID, m_schoolName, m_from, m_to, m_awards, c_schoolName, c_from, c_to, c_awards, s_schoolName, s_from, s_to, s_awards, e_schoolName, e_from, e_to, e_awards, o_schoolName, o_from, o_to, o_awards, specialSkills) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, m_schoolName, m_from, m_to, m_awards, c_schoolName, c_from, c_to, 
                  c_awards, s_schoolName, s_from, s_to, s_awards, e_schoolName, e_from, e_to, e_awards, o_schoolName, o_from, o_to, o_awards, specialSkills], (err, result) => {
                    if(err) {
                      console.log(err)
                      let message = 'Please only include alphanumeric characters';
                      res.render('home', {message: message});
                    }
                    else if(!err){
                      gdb.query("INSERT INTO app_workexperience (workexperience_ID, workEmployer1, workNumber1, workFrom1, workTo1, workPosition1, workReasonForLeaving1, workEmployer2, workNumber2, workFrom2, workTo2, workPosition2, workReasonForLeaving2, workEmployer3, workNumber3, workFrom3, workTo3, workPosition3, workReasonForLeaving3) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, workEmployer1, workNumber1, workFrom1, workTo1, workPosition1, workReasonForLeaving1, workEmployer2, 
                        workNumber2, workFrom2, workTo2, workPosition2, workReasonForLeaving2, workEmployer3, workNumber3, workFrom3, workTo3, workPosition3, workReasonForLeaving3], (err, result) => {
                          if(err) {
                            console.log(err)
                            let message = 'Please only include alphanumeric characters';
                            res.render('home', {message: message});
                          }
                          else if(!err){
                            /* console.log("New Applicant: " + firstName + " Application ID: " + appid);
                            res.redirect('/'); */
                            gdb.query("INSERT INTO app_licenses (license_ID, licenseNumber1, licenseExpiry1, licenseRating1, licenseRemarks1, licenseType1, licenseRestrictions1, license_file1) VALUES(?,?,?,?,?,?,?,?)", [appid, licenseNumber1, licenseExpiry1, licenseRating1, licenseRemarks1, licenseType1, licenseRestrictionStringed1, license_file1], (err, result) => {
                              if(err) {
                                console.log(err)
                                let message = 'Please only include alphanumeric characters';
                                res.render('home', {message: message});
                              }
                              else if(!err){
                                gdb.query("INSERT INTO app_familybg (familybg_ID, father_name, father_companyNumber, father_birthdate, father_occupation, mother_name, mother_companyNumber, mother_birthdate, mother_occupation, sibling_name1, sibling_companyNumber1, sibling_birthdate1, sibling_occupation1, sibling_name2, sibling_companyNumber2, sibling_birthdate2, sibling_occupation2, children_name1, children_birthdate1, children_name2, children_birthdate2, personcrt_name1, personcrt_relationship1, personcrt_name2, personcrt_relationship2) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, father_name, father_companyNumber, father_birthdate, father_occupation, mother_name, mother_companyNumber, mother_birthdate, mother_occupation, sibling_name1, sibling_companyNumber1, sibling_birthdate1, sibling_occupation1, sibling_name2, sibling_companyNumber2, sibling_birthdate2, sibling_occupation2, children_name1, children_birthdate1, children_name2, children_birthdate2, personcrt_name1, personcrt_relationship1, personcrt_name2, personcrt_relationship2], (err, result) => {
                                  if(err) {
                                    console.log(err)
                                    let message = 'Please only include alphanumeric characters';
                                    res.render('home', {message: message});
                                  }
                                  else if(!err){
                                    gdb.query("INSERT INTO app_qna (qna_ID, englishAnswer1, englishAnswer2, englishAnswer3, englishAnswer4, englishAnswer5, englishAnswer6, englishAnswer7, englishAnswer8, englishAnswer9, englishAnswer10, englishAnswer11, englishAnswer12, englishAnswer13, englishAnswer14, englishAnswer15, filipinoAnswer1, filipinoAnswer2, filipinoAnswer3, filipinoAnswer4, filipinoAnswer5, filipinoAnswer6, filipinoAnswer7, filipinoAnswer8, filipinoAnswer9, filipinoAnswer10, filipinoAnswer11, filipinoAnswer12, filipinoAnswer13) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, englishAnswer1, englishAnswer2, englishAnswer3, englishAnswer4, englishAnswer5, englishAnswer6, englishAnswer7, englishAnswer8, englishAnswer9, englishAnswer10, englishAnswer11, englishAnswer12, englishAnswer13, englishAnswer14, englishAnswer15, filipinoAnswer1, filipinoAnswer2, filipinoAnswer3, filipinoAnswer4, filipinoAnswer5, filipinoAnswer6, filipinoAnswer7, filipinoAnswer8, filipinoAnswer9, filipinoAnswer10, filipinoAnswer11, filipinoAnswer12, filipinoAnswer13], (err, result) => {
                                      if(err) {
                                        console.log(err)
                                        let message = 'Please only include alphanumeric characters';
                                        res.render('home', {message: message});
                                      }
                                      else if(!err){
                                        gdb.query("INSERT INTO app_documents (documents_ID, profile_photo, sss_number, sss_file, pagibig_number, pagibig_file, tin_number, tin_file, philhealth_number, philhealth_file, mdr_file, nbi_file, brgyclearance_file, facebook, viber) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, profile_photo, sss_number, sss_file, pagibig_number, pagibig_file, tin_number, tin_file, philhealth_number,philhealth_file, mdr_file, nbi_file, brgyclearance_file, facebook, viber], (err, result) => {
                                          if(err) {
                                            console.log(err)
                                            let message = 'Please only include alphanumeric characters';
                                            res.render('home', {message: message});
                                          }
                                          else if(!err){
                                            console.log("New Applicant: " + firstName + " Application ID: " + appid);
                                            gdb.query("SELECT * FROM app_request WHERE email=?",[emailAddress],function(err,result){
                                              if(err){console.log(err)}
                                              let reqID = result[0].id;

                                              gdb.query("DELETE FROM app_request WHERE id=?",[reqID],function(err){
                                                if(err){console.log(err)}
                                              })
                                              res.redirect('/896a9b903ecd904a54d8a151b3c0ba6c2aa6342fa0e99a5d676e633f8db59e2ce2d0b7c5c15d97b6d536083725ce6f697421dab89074eb20b97b878d8860b4d3');

                                            })
                                          }
                                        });
                                      }
                                    });
                                  }
                                });
                              }
                            });
                          }
                        });
                    }
                  });
              }
            });
        };
      });   
    });
}

//ERROR! PAGE NOT FOUND
exports.errorpage = function(req, res){
    message = "This page doesn't exists!";
    res.render('errorpage', {message: message});
}

exports.application = function(req, res){
/*     message = "You are applying";
    res.render('application_form',{message: message}); */
  let id = req.params.id;

  gdb.connect(function(err){
    if(err) {console.log(err)}
    gdb.query("SELECT * FROM app_request WHERE id=?",[id], function(err,result1){
      //IF APPLYING
      if(err){console.log(err)}

      if(result1[0] == null){
        res.redirect('/*')
      }else{
        //let email = result1[0].email;
        let data = result1[0]
        res.render('application_form', {data:data})
      }
    })
  })
    //Automatically delete applicants over 30 days in DB
    gdb.query("DELETE FROM app_request WHERE DATE_FORMAT(CURRENT_TIMESTAMP,'%Y-%m-%d-%H-%i-%s') > app_expiration", function(err){
      if(err){console.log(err)}
      //console.log("Deleted expired applications")
    })
}

exports.driver_information = function(req, res){
/*   message = "You are applying";
  res.render('driver-information',{message: message}); */

  let id = req.params.id;

  gdb.connect(function(err){
    if(err) {console.log(err)}
    gdb.query("SELECT * FROM driver_sent WHERE id=?",[id], function(err,result1){
      //IF APPLYING
      if(err){console.log(err)}

      if(result1[0] == null){
        res.redirect('/*')
      }else{
        //let email = result1[0].email;
        let data = result1[0]
        res.render('driver-information', {data:data})
      }
    })
  })

}


//DRIVER INFORMATION POST
exports.driver_addnewdriverpost =  function(req, res){
  //PERSONAL DATA
  let post = req.body;
  let firstName = post.firstName;
  let middleName = post.middleName;
  let lastName = post.lastName;
  let nickname = post.nickname;
  let sex = post.sex;
  let homeAddress = post.homeAddress;
  let birthdate = post.birthdate;
  if(birthdate == ''){
    birthdate = '1111-11-11';
  }

  let location = post.location

  let personalNumber = post.personalNumber;
  if(personalNumber == ''){
    personalNumber = 0;
  }

  //let emailAddress = post.emailAddress;
  let contactPerson_Name = post.contactPerson_Name;
  let contactPerson_Number = post.contactPerson_Number;
  if(contactPerson_Number == ''){
    contactPerson_Number = 0;
  }
  let contactPerson_Relationship = post.contactPerson_Relationship;
  let bloodType = post.bloodType;
  let religion = post.religion;
  let civilStatus = post.civilStatus;
  let height = post.height;
  let weight = post.weight;
  let app_status = "For Updating";
  let application_expiration = '1111-11-11';

  //EDUCATIONAL BACKGROUND
  let m_schoolName = post.m_schoolName;
  let m_from = post.m_from;
  if(m_from == ''){
    m_from = 0;
  }//
  let m_to = post.m_to;
  if(m_to == ''){
    m_to = 0;
  }//
  let m_awards = post.m_awards;

  let c_schoolName = post.c_schoolName;
  let c_from = post.c_from;
  if(c_from == ''){
    c_from = 0;
  }//
  let c_to = post.c_to;
  if(c_to == ''){
    c_to = 0;
  }//
  let c_awards = post.c_awards;

  let s_schoolName = post.s_schoolName;
  let s_from = post.s_from;
  if(s_from == ''){
    s_from = 0;
  }//
  let s_to = post.s_to;
  if(s_to == ''){
    s_to = 0;
  }//
  let s_awards = post.s_awards;

  let e_schoolName = post.e_schoolName;
  let e_from = post.e_from;
  if(e_from == ''){
    e_from = 0;
  }//
  let e_to = post.e_to;
  if(e_to == ''){
    e_to = 0;
  }//
  let e_awards = post.e_awards;

  let o_schoolName = post.o_schoolName;
  let o_from = post.o_from;
  if(o_from == ''){
    o_from = 0;
  }//
  let o_to = post.o_to;
  if(o_to == ''){
    o_to = 0;
  }//
  let o_awards = post.o_awards;

  let specialSkills = post.specialSkills;

  //WORK EXPERIENCE
  let workEmployer1 = post.workEmployer1;
  let workNumber1 = post.workNumber1;
  if(workNumber1 == ''){
    workNumber1 = 0;
  }//
  let workFrom1 = post.workFrom1;
  if(workFrom1 == ''){
    workFrom1 = 0;
  }//
  let workTo1 = post.workTo1;
  if(workTo1 == ''){
    workTo1 = 0;
  }//
  let workPosition1 = post.workPosition1;
  let workReasonForLeaving1 =  post.workReasonForLeaving1;

  let workEmployer2 = post.workEmployer2;
  let workNumber2 = post.workNumber2;
  if(workNumber2 == ''){
    workNumber2 = 0;
  }//
  let workFrom2 = post.workFrom2;
  if(workFrom2 == ''){
    workFrom2 = 0;
  }//
  let workTo2 = post.workTo2;
  if(workTo2 == ''){
    workTo2 = 0;
  }//
  let workPosition2 = post.workPosition2;
  let workReasonForLeaving2 =  post.workReasonForLeaving2;

  let workEmployer3 = post.workEmployer3;
  let workNumber3 = post.workNumber3;
  if(workNumber3 == ''){
    workNumber3 = 0;
  }//
  let workFrom3 = post.workFrom3;
  if(workFrom3 == ''){
    workFrom3 = 0;
  }//
  let workTo3 = post.workTo3;
  if(workTo3 == ''){
    workTo3 = 0;
  }//
  let workPosition3 = post.workPosition3;
  let workReasonForLeaving3 =  post.workReasonForLeaving3;

  //LICENSES
  let licenseNumber1 = post.licenseNumber1;
  let licenseExpiry1 = post.licenseExpiry1;
  let licenseRating1 = post.licenseRating1;
  let licenseRemarks1 = post.licenseRemarks1;
  let licenseType1 = post.licenseType1;
  let licenseRestrictions1 = post.restriction1;
  let licenseRestrictionStringed1 = JSON.stringify(licenseRestrictions1);

  //FAMILY BACKGROUND
  let father_name = post.father_name;
  let father_companyNumber = post.father_companyNumber;
  if(father_companyNumber == ''){
    father_companyNumber = 0;
  }//
  let father_birthdate = post.father_birthdate;
  if(father_birthdate == ''){
    father_birthdate = '1111-11-11';
  }//
  let father_occupation = post.father_occupation;

  let mother_name = post.mother_name;
  let mother_companyNumber = post.mother_companyNumber;
  if(mother_companyNumber == ''){
    mother_companyNumber = 0;
  }//
  let mother_birthdate = post.mother_birthdate;
  if(mother_birthdate == ''){
    mother_birthdate = '1111-11-11';
  }//
  let mother_occupation = post.mother_occupation;

  let sibling_name1 = post.sibling_name1;
  let sibling_companyNumber1 = post.sibling_companyNumber1;
  if(sibling_companyNumber1 == ''){
    sibling_companyNumber1 = 0;
  }//
  let sibling_birthdate1 = post.sibling_birthdate1;
  if(sibling_birthdate1 == ''){
    sibling_birthdate1 = '1111-11-11';
  }//
  let sibling_occupation1 = post.sibling_occupation1;

  let sibling_name2 = post.sibling_name2;
  let sibling_companyNumber2 = post.sibling_companyNumber2;
  if(sibling_companyNumber2 == ''){
    sibling_companyNumber2 = 0;
  }//
  let sibling_birthdate2 = post.sibling_birthdate2;
  if(sibling_birthdate2 == ''){
    sibling_birthdate2 = '1111-11-11';
  }//
  let sibling_occupation2 = post.sibling_occupation2;

  let children_name1 = post.children_name1;
  let children_birthdate1 = post.children_birthdate1;
  if(children_birthdate1 == ''){
    children_birthdate1 = '1111-11-11';
  }//
  let children_name2 = post.children_name2;
  let children_birthdate2 = post.children_birthdate2;
  if(children_birthdate2 == ''){
    children_birthdate2 = '1111-11-11';
  }//

  let personcrt_name1 = post.personcrt_name1;
  let personcrt_relationship1 = post.personcrt_relationship1;
  let personcrt_name2 = post.personcrt_name2;
  let personcrt_relationship2 = post.personcrt_relationship2;

  //ATTACHMENTS
  let sss_number = post.sss_number;
  if(sss_number == ''){
    sss_number = 0;
  }//

  let pagibig_number = post.pagibig_number;
  if(pagibig_number == ''){
    pagibig_number = 0;
  }//

  let tin_number = post.tin_number;
  if(tin_number == ''){
    tin_number = 0;
  }//

  let philhealth_number = post.philhealth_number;
  if(philhealth_number == ''){
    philhealth_number = 0;
  }//

  let facebook = post.facebook;
  let viber = post.viber;

  let id = req.params.id;

  //DATE OF APPLICATION
  var application_date = new Date();
  var dd = application_date.getDate();
  var mm = application_date.getMonth()+1;
  var yyyy = application_date.getFullYear();
  if(dd < 10){
    dd = '0' + dd
  } 
  if(mm < 10){
    mm = '0' + mm
  } 
  application_date = yyyy + '-' + mm + '-' + dd;
  //console.log(application_date)

  gdb.query("SELECT * FROM driver_sent WHERE id=?",[id],function(err,result3){
    if(err){console.log(err)}
    let emailAddress = result3[0].email;

  if(!req.files){     
    gdb.query('SELECT * FROM app_personaldata ORDER BY applicationID DESC', (err, result) => {
      if (err) {
          console.log(err);
      } else {
        let appid = req.params.id;
        /* if(!err){
          if(result == 0){
            appid = 1;
            console.log(appid)
          }else{
            appid = result[0].applicationID + 1;
            console.log(appid)
          }
        } */
        //console.log(parseInt(appid));
        gdb.query("INSERT INTO app_personaldata (applicationID, firstName, middleName, lastName, nickname, sex, homeAddress, birthdate, location, personalNumber, emailAddress, contactPerson_Name, contactPerson_Number, contactPerson_Relationship, bloodType, religion, civilStatus, height, weight, app_status, application_date, application_expiration) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, firstName, middleName, lastName, nickname, sex, location, homeAddress, birthdate, 
          personalNumber, emailAddress, contactPerson_Name, contactPerson_Number, contactPerson_Relationship, bloodType, religion, civilStatus, height, weight, app_status, application_date, application_expiration], (err, result) => {
            if(err) {
              console.log(err)
            }
            else if(!err){
              gdb.query("INSERT INTO app_educationalbg (educationalbg_ID, m_schoolName, m_from, m_to, m_awards, c_schoolName, c_from, c_to, c_awards, s_schoolName, s_from, s_to, s_awards, e_schoolName, e_from, e_to, e_awards, o_schoolName, o_from, o_to, o_awards, specialSkills) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, m_schoolName, m_from, m_to, m_awards, c_schoolName, c_from, c_to, 
                c_awards, s_schoolName, s_from, s_to, s_awards, e_schoolName, e_from, e_to, e_awards, o_schoolName, o_from, o_to, o_awards, specialSkills], (err, result) => {
                  if(err) {
                    console.log(err)
                  }
                  else if(!err){
                    gdb.query("INSERT INTO app_workexperience (workexperience_ID, workEmployer1, workNumber1, workFrom1, workTo1, workPosition1, workReasonForLeaving1, workEmployer2, workNumber2, workFrom2, workTo2, workPosition2, workReasonForLeaving2, workEmployer3, workNumber3, workFrom3, workTo3, workPosition3, workReasonForLeaving3) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, workEmployer1, workNumber1, workFrom1, workTo1, workPosition1, workReasonForLeaving1, workEmployer2, 
                      workNumber2, workFrom2, workTo2, workPosition2, workReasonForLeaving2, workEmployer3, workNumber3, workFrom3, workTo3, workPosition3, workReasonForLeaving3], (err, result) => {
                        if(err) {
                          console.log(err)
                        }
                        else if(!err){
                          gdb.query("INSERT INTO app_licenses (license_ID, licenseNumber1, licenseExpiry1, licenseRating1, licenseRemarks1, licenseType1, licenseRestrictions1) VALUES(?,?,?,?,?,?,?)", [appid, licenseNumber1, licenseExpiry1, licenseRating1, licenseRemarks1, licenseType1, licenseRestrictionStringed1], (err, result) => {
                            if(err) {
                              console.log(err)
                            }
                            else if(!err){
                              gdb.query("INSERT INTO app_familybg (familybg_ID, father_name, father_companyNumber, father_birthdate, father_occupation, mother_name, mother_companyNumber, mother_birthdate, mother_occupation, sibling_name1, sibling_companyNumber1, sibling_birthdate1, sibling_occupation1, sibling_name2, sibling_companyNumber2, sibling_birthdate2, sibling_occupation2, children_name1, children_birthdate1, children_name2, children_birthdate2, personcrt_name1, personcrt_relationship1, personcrt_name2, personcrt_relationship2) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, father_name, father_companyNumber, father_birthdate, father_occupation, mother_name, mother_companyNumber, mother_birthdate, mother_occupation, sibling_name1, sibling_companyNumber1, sibling_birthdate1, sibling_occupation1, sibling_name2, sibling_companyNumber2, sibling_birthdate2, sibling_occupation2, children_name1, children_birthdate1, children_name2, children_birthdate2, personcrt_name1, personcrt_relationship1, personcrt_name2, personcrt_relationship2], (err, result) => {
                                if(err) {
                                  console.log(err)
                                }
                                    else if(!err){
                                      gdb.query("INSERT INTO app_documents (documents_ID, sss_number, pagibig_number, tin_number, philhealth_number, facebook, viber) VALUES(?,?,?,?,?,?,?)", [appid, sss_number, pagibig_number, tin_number, philhealth_number, facebook, viber], (err, result) => {
                                        if(err) {
                                          console.log(err)
                                        }
                                        else if(!err){
                                          console.log("New Applicant: " + firstName + " Application ID: " + appid);
                                          gdb.query("SELECT * FROM driver_sent WHERE email=?",[emailAddress],function(err,result){
                                            if(err){console.log(err)}
                                            let reqID = result[0].id;

                                            gdb.query("DELETE FROM driver_sent WHERE id=?",[reqID],function(err){
                                              if(err){console.log(err)}

                                            })
                                            res.redirect('/896a9b903ecd904a54d8a151b3c0ba6c2aa6342fa0e99a5d676e633f8db59e2ce2d0b7c5c15d97b6d536083725ce6f697421dab89074eb20b97b878d8860b4d4');
                                          })
                                        }
                                      });
                                    }
                              });
                            }
                          });
                        }
                      });
                  }
                });
            }
          });
      };
    })
  } 
  else{
    let profile_photo ="";
    if(!req.files.profile_photo) {
      profile_photo = "";
    }
    else {        
      raw_profile_photo = req.files.profile_photo.data;
      let buff_raw_profile_photo = new Buffer.from(raw_profile_photo);
      profile_photo = buff_raw_profile_photo.toString('base64');
      console.log('profile photo uploaded');
    }

    let sss_file = "";
    if(!req.files.sss_file) {
      sss_file = "";
    }
    else {
      raw_sss_file = req.files.sss_file.data;
      let buff_raw_sss_file = new Buffer.from(raw_sss_file);
      sss_file = buff_raw_sss_file.toString('base64');
      console.log('profile photo uploaded');
    }

    let pagibig_file = "";
    if(!req.files.pagibig_file) {
      pagibig_file = "";
    }
    else {
      raw_pagibig_file = req.files.pagibig_file.data;
      let buff_raw_pagibig_file = new Buffer.from(raw_pagibig_file);
      pagibig_file = buff_raw_pagibig_file.toString('base64');
      console.log('pagibig file uploaded');
    }

    let tin_file = "";
    if(!req.files.tin_file) {
      tin_file = "";
    }
    else {
      raw_tin_file = req.files.tin_file.data;
      let buff_raw_tin_file = new Buffer.from(raw_tin_file);
      tin_file = buff_raw_tin_file.toString('base64');
      console.log('tin file uploaded');
    }

    let license_file1 = "";
    if(!req.files.license_file1) {
      license_file1 = "";
    }
    else {
      raw_license_file1 = req.files.license_file1.data;
      let buff_raw_license_file1 = new Buffer.from(raw_license_file1);
      license_file1 = buff_raw_license_file1.toString('base64');
      console.log('driver license 1 file uploaded');
    }

    /* let license_file2 = "";
    if(!req.files.license_file2) {
      license_file2 = "";
    }
    else {
      raw_license_file2 = req.files.license_file2.data;
      let buff_raw_license_file2 = new Buffer.from(raw_license_file2);
      license_file2 = buff_raw_license_file2.toString('base64');
      console.log('driver license 2 file uploaded');
    } */

    let philhealth_file = "";
    if(!req.files.philhealth_file) {
      philhealth_file = "";
    }
    else {
      raw_philhealth_file = req.files.philhealth_file.data;
      let buff_raw_philhealth_file = new Buffer.from(raw_philhealth_file);
      philhealth_file = buff_raw_philhealth_file.toString('base64');
      console.log('philhealth file uploaded');
    }

    let mdr_file = "";
    if(!req.files.mdr_file) {
      mdr_file = "";
    }
    else {
      raw_mdr_file = req.files.mdr_file.data;
      let buff_raw_mdr_file = new Buffer.from(raw_mdr_file);
      mdr_file = buff_raw_mdr_file.toString('base64');
      console.log('mdr file uploaded');
    }

    let nbi_file = "";
    if(!req.files.nbi_file) {
      nbi_file = "";
    }
    else {
      raw_nbi_file = req.files.nbi_file.data;
      let buff_raw_nbi_file = new Buffer.from(raw_nbi_file);
      nbi_file = buff_raw_nbi_file.toString('base64');
      console.log('nbi file uploaded');
    }

    let brgyclearance_file = ""; 
    if(!req.files.brgyclearance_file) {
      brgyclearance_file = "";
    }
    else {
      raw_brgyclearance_file = req.files.brgyclearance_file.data;
      let buff_raw_brgyclearance_file = new Buffer.from(raw_brgyclearance_file);
      brgyclearance_file = buff_raw_brgyclearance_file.toString('base64');
      console.log('brgy clearance file uploaded');
    }

    gdb.query('SELECT * FROM app_personaldata ORDER BY applicationID DESC', (err, result) => {
      if (err) {
          console.log(err);
      } else {
        let appid = req.params.id;
        
        //console.log(parseInt(appid));
        gdb.query("INSERT INTO app_personaldata (applicationID, firstName, middleName, lastName, nickname, sex, homeAddress, birthdate, location, personalNumber, emailAddress, contactPerson_Name, contactPerson_Number, contactPerson_Relationship, bloodType, religion, civilStatus, height, weight, app_status, application_date, application_expiration) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, firstName, middleName, lastName, nickname, sex, homeAddress, birthdate, location, 
          personalNumber, emailAddress, contactPerson_Name, contactPerson_Number, contactPerson_Relationship, bloodType, religion, civilStatus, height, weight, app_status, application_date, application_expiration], (err, result) => {
            if(err) {
              console.log(err)
              let message = 'Please only include alphanumeric characters';
              res.render('/', {message: message});
            }
            else if(!err){
              gdb.query("INSERT INTO app_educationalbg (educationalbg_ID, m_schoolName, m_from, m_to, m_awards, c_schoolName, c_from, c_to, c_awards, s_schoolName, s_from, s_to, s_awards, e_schoolName, e_from, e_to, e_awards, o_schoolName, o_from, o_to, o_awards, specialSkills) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, m_schoolName, m_from, m_to, m_awards, c_schoolName, c_from, c_to, 
                c_awards, s_schoolName, s_from, s_to, s_awards, e_schoolName, e_from, e_to, e_awards, o_schoolName, o_from, o_to, o_awards, specialSkills], (err, result) => {
                  if(err) {
                    console.log(err)
                    let message = 'Please only include alphanumeric characters';
                    res.render('home', {message: message});
                  }
                  else if(!err){
                    gdb.query("INSERT INTO app_workexperience (workexperience_ID, workEmployer1, workNumber1, workFrom1, workTo1, workPosition1, workReasonForLeaving1, workEmployer2, workNumber2, workFrom2, workTo2, workPosition2, workReasonForLeaving2, workEmployer3, workNumber3, workFrom3, workTo3, workPosition3, workReasonForLeaving3) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, workEmployer1, workNumber1, workFrom1, workTo1, workPosition1, workReasonForLeaving1, workEmployer2, 
                      workNumber2, workFrom2, workTo2, workPosition2, workReasonForLeaving2, workEmployer3, workNumber3, workFrom3, workTo3, workPosition3, workReasonForLeaving3], (err, result) => {
                        if(err) {
                          console.log(err)
                          let message = 'Please only include alphanumeric characters';
                          res.render('home', {message: message});
                        }
                        else if(!err){
                          /* console.log("New Applicant: " + firstName + " Application ID: " + appid);
                          res.redirect('/'); */
                          gdb.query("INSERT INTO app_licenses (license_ID, licenseNumber1, licenseExpiry1, licenseRating1, licenseRemarks1, licenseType1, licenseRestrictions1, license_file1) VALUES(?,?,?,?,?,?,?,?)", [appid, licenseNumber1, licenseExpiry1, licenseRating1, licenseRemarks1, licenseType1, licenseRestrictionStringed1, license_file1], (err, result) => {
                            if(err) {
                              console.log(err)
                              let message = 'Please only include alphanumeric characters';
                              res.render('home', {message: message});
                            }
                            else if(!err){
                              gdb.query("INSERT INTO app_familybg (familybg_ID, father_name, father_companyNumber, father_birthdate, father_occupation, mother_name, mother_companyNumber, mother_birthdate, mother_occupation, sibling_name1, sibling_companyNumber1, sibling_birthdate1, sibling_occupation1, sibling_name2, sibling_companyNumber2, sibling_birthdate2, sibling_occupation2, children_name1, children_birthdate1, children_name2, children_birthdate2, personcrt_name1, personcrt_relationship1, personcrt_name2, personcrt_relationship2) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, father_name, father_companyNumber, father_birthdate, father_occupation, mother_name, mother_companyNumber, mother_birthdate, mother_occupation, sibling_name1, sibling_companyNumber1, sibling_birthdate1, sibling_occupation1, sibling_name2, sibling_companyNumber2, sibling_birthdate2, sibling_occupation2, children_name1, children_birthdate1, children_name2, children_birthdate2, personcrt_name1, personcrt_relationship1, personcrt_name2, personcrt_relationship2], (err, result) => {
                                if(err) {
                                  console.log(err)
                                  let message = 'Please only include alphanumeric characters';
                                  res.render('home', {message: message});
                                }
                                    else if(!err){
                                      gdb.query("INSERT INTO app_documents (documents_ID, profile_photo, sss_number, sss_file, pagibig_number, pagibig_file, tin_number, tin_file, philhealth_number, philhealth_file, mdr_file, nbi_file, brgyclearance_file, facebook, viber) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [appid, profile_photo, sss_number, sss_file, pagibig_number, pagibig_file, tin_number, tin_file, philhealth_number,philhealth_file, mdr_file, nbi_file, brgyclearance_file, facebook, viber], (err, result) => {
                                        if(err) {
                                          console.log(err)
                                          let message = 'Please only include alphanumeric characters';
                                          res.render('home', {message: message});
                                        }
                                        else if(!err){
                                          console.log("New Applicant: " + firstName + " Application ID: " + appid);
                                          gdb.query("SELECT * FROM driver_sent WHERE id=?",[appid],function(err,result){
                                            if(err){console.log(err)}
                                            let reqID = result[0].id;

                                            gdb.query("DELETE FROM driver_sent WHERE id=?",[reqID],function(err){
                                              if(err){console.log(err)}
                                            })
                                            res.redirect('/896a9b903ecd904a54d8a151b3c0ba6c2aa6342fa0e99a5d676e633f8db59e2ce2d0b7c5c15d97b6d536083725ce6f697421dab89074eb20b97b878d8860b4d4');

                                          })
                                        }
                                      });
                                    }
                              });
                            }
                          });
                        }
                      });
                  }
                });
            }
          });
      };
    });    
  }
});
}