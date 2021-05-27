var currentTab = 0; 
showTab(currentTab);

let counterSubmit = 0;

function updateCheck(){
  if(document.getElementById("checkform1").checked == true && document.getElementById("checkform2").checked == true){
    document.getElementById("nextBtn").disabled = false;
  } else{
    document.getElementById("nextBtn").disabled = true;
  }
}

function showTab(n) {
  
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "flex";
  

  //HEADER TITLE
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
    document.getElementById("part_type").innerHTML = "PERSONAL INFORMATION";
  } else if(n == 1){
    document.getElementById("part_type").innerHTML = "EDUCATIONAL BACKGROUND AND SKILLS";
    document.getElementById("prevBtn").style.display = "inline";
  } else if(n == 2){
    document.getElementById("part_type").innerHTML = "WORK EXPERIENCE";
    document.getElementById("prevBtn").style.display = "inline";
  } else if(n == 3){
    document.getElementById("part_type").innerHTML = "FAMILY BACKGROUND";
    document.getElementById("prevBtn").style.display = "inline";
  } else if(n == 4){
    document.getElementById("part_type").innerHTML = "LICENSE";
    document.getElementById("prevBtn").style.display = "inline";
  } else if(n == 5){
    document.getElementById("part_type").innerHTML = "ATTACHMENTS AND IDENTIFICATIONS";
    document.getElementById("prevBtn").style.display = "inline";
    document.getElementById("checkform1").checked = false;
    document.getElementById("checkform2").checked = false;
  }

  //BUTTONS
  if (n == (x.length - 1)) {

    document.getElementById("nextBtn").disabled = true;
    document.getElementById("nextBtn").innerHTML = "SUBMIT";

  } else {
    document.getElementById("nextBtn").innerHTML = "NEXT &rarr;";
    document.getElementById("nextBtn").disabled = false;
  }

  fixStepIndicator(n)
}

function nextPrev(n) {
  var x = document.getElementsByClassName("tab");

  if (n == 1 && !validateForm()) return false;
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;

  if (currentTab >= x.length) {
    if (confirm("Your information sheet will be sent to Continental Rental and Tours, Inc. You will be notified by our Human Resource Personnel upon the approval of your information sheet. Thank you and have a nice day!")) {
      document.getElementById("form").submit();
    } else {
      currentTab = currentTab - n;
      counterSubmit++;
      console.log(counterSubmit)
    }
  }
  showTab(currentTab);
}

function enableBtn(){
  document.getElementById('nextBtn').disabled = false;
}

function validateForm() { 
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByClassName("requiredInput");
  for (i = 0; i < y.length; i++) {
    if (y[i].value == "") {
      y[i].className += " invalid";
      valid = false;
    }
  }
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  
  return valid;
}

var mybutton = document.getElementById("prevBtn");

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    
    reader.onload = function(e) {
      $('#blah').attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}

$("#profile_photo").change(function() {
  readURL(this);
});

function fixStepIndicator(n) {
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";
}

//ADDED VALIDATIONS ON NAMES, HEIGHT, YEAR AND BIRTHDATE
function isFloat(evt, id){
  try{
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if(charCode==46){
        var txt=document.getElementById(id).value;
        if(!(txt.indexOf(".") > -1)){
            return true;
        }
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57) ) return false;

    return true;
    }catch(w){
  }
}

function isName(e){
  try {
    if (window.event) {
        var charCode = window.event.keyCode;
    }
    else if (e) {
        var charCode = e.which;
    }
    else { return true; }
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 32)
        return true;
    else
        return false;
    }
    catch (err) {
        alert(err.Description);
    }
}

var today = new Date();
var todaydd = today.getDate();
var todaymm = today.getMonth()+1; //January is 0!
var todayyyyy = today.getFullYear();
if(todaydd < 10){
  todaydd = '0' + todaydd
} 
if(todaymm < 10){
  todaymm = '0' + todaymm
} 
today = todayyyyy + '-' + todaymm + '-' + todaydd;

document.getElementById("sibling_birthdate1").setAttribute("max", today);
document.getElementById("sibling_birthdate2").setAttribute("max", today);
document.getElementById("children_birthdate1").setAttribute("max", today);
document.getElementById("children_birthdate2").setAttribute("max", today);

//YEARS
//EDUCATIONAL BACKGROUND YEARS
function checkYear(){
  if(document.getElementById("m_to").value < document.getElementById("m_from").value){
    document.getElementById("m_to").value = document.getElementById("m_from").value;
  }
  if(document.getElementById("c_to").value < document.getElementById("c_from").value){
    document.getElementById("c_to").value = document.getElementById("c_from").value;
  }
  if(document.getElementById("s_to").value < document.getElementById("s_from").value){
    document.getElementById("s_to").value = document.getElementById("s_from").value;
  }
  if(document.getElementById("e_to").value < document.getElementById("e_from").value){
    document.getElementById("e_to").value = document.getElementById("e_from").value;
  }
  if(document.getElementById("o_to").value < document.getElementById("o_from").value){
    document.getElementById("o_to").value = document.getElementById("o_from").value;
  }
  if(document.getElementById("workTo1").value < document.getElementById("workFrom1").value){
    document.getElementById("workTo1").value = document.getElementById("workFrom1").value;
  }
  if(document.getElementById("workTo2").value < document.getElementById("workFrom2").value){
    document.getElementById("workTo2").value = document.getElementById("workFrom2").value;
  }
  if(document.getElementById("workTo3").value < document.getElementById("workFrom3").value){
    document.getElementById("workTo3").value = document.getElementById("workFrom3").value;
  }
}

//LICENSE 1 VALIDATION

$('#license_file1').on('change', function() {
  const size = (this.files[0].size / 1024 / 1024).toFixed(2);

  filePath = document.getElementById("license_file1").value;

  if (size > 5) {
      alert("File size must not be greater than 10mb");
      document.getElementById("license_file1").value = "";
  } else {
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
              
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        document.getElementById("license_file1").value = "";
        return false;
    }
  }
});


//PROFILE PHOTO VALIDATION
$('#profile_photo').on('change', function() {
  const size = (this.files[0].size / 1024 / 1024).toFixed(2);

  filePath = document.getElementById("profile_photo").value;

  if (size > 5) {
      alert("File size must not be greater than 10mb");
      document.getElementById("profile_photo").value = "";
  } else {
    var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
              
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        document.getElementById("profile_photo").value = "";
        return false;
    }
  }
});

//SSS FILE
$('#sss_file').on('change', function() {
  const size = (this.files[0].size / 1024 / 1024).toFixed(2);

  filePath = document.getElementById("sss_file").value;

  if (size > 5) {
      alert("File size must not be greater than 10mb");
      document.getElementById("sss_file").value = "";
  } else {
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
              
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        document.getElementById("sss_file").value = "";
        return false;
    }
  }
});

//PAGIBIG FILE
$('#pagibig_file').on('change', function() {
  const size = (this.files[0].size / 1024 / 1024).toFixed(2);

  filePath = document.getElementById("pagibig_file").value;

  if (size > 5) {
      alert("File size must not be greater than 10mb");
      document.getElementById("pagibig_file").value = "";
  } else {
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
              
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        document.getElementById("pagibig_file").value = "";
        return false;
    }
  }
});

//TIN FILE
$('#tin_file').on('change', function() {
  const size = (this.files[0].size / 1024 / 1024).toFixed(2);

  filePath = document.getElementById("tin_file").value;

  if (size > 5) {
      alert("File size must not be greater than 10mb");
      document.getElementById("tin_file").value = "";
  } else {
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
              
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        document.getElementById("tin_file").value = "";
        return false;
    }
  }
});

//PHILHEALTH FILE
$('#philhealth_file').on('change', function() {
  const size = (this.files[0].size / 1024 / 1024).toFixed(2);

  filePath = document.getElementById("philhealth_file").value;

  if (size > 5) {
      alert("File size must not be greater than 10mb");
      document.getElementById("philhealth_file").value = "";
  } else {
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
              
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        document.getElementById("philhealth_file").value = "";
        return false;
    }
  }
});

//MDR FILE
$('#mdr_file').on('change', function() {
  const size = (this.files[0].size / 1024 / 1024).toFixed(2);

  filePath = document.getElementById("mdr_file").value;

  if (size > 5) {
      alert("File size must not be greater than 10mb");
      document.getElementById("mdr_file").value = "";
  } else {
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
              
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        document.getElementById("mdr_file").value = "";
        return false;
    }
  }
});

//NBI FILE
$('#nbi_file').on('change', function() {
  const size = (this.files[0].size / 1024 / 1024).toFixed(2);

  filePath = document.getElementById("nbi_file").value;

  if (size > 5) {
      alert("File size must not be greater than 10mb");
      document.getElementById("nbi_file").value = "";
  } else {
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
              
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        document.getElementById("nbi_file").value = "";
        return false;
    }
  }
});

//BRGY CLEARANCE FILE
$('#brgyclearance_file').on('change', function() {
  const size = (this.files[0].size / 1024 / 1024).toFixed(2);

  filePath = document.getElementById("brgyclearance_file").value;

  if (size > 5) {
      alert("File size must not be greater than 10mb");
      document.getElementById("brgyclearance_file").value = "";
  } else {
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
              
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        document.getElementById("brgyclearance_file").value = "";
        return false;
    }
  }
});

//END OF NEW VALIDATIONS
function isNumber(evt){
  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
  }
  return true;
}

function isLicense(evt){
  var ch = String.fromCharCode(evt.keyCode);
  var filter = /[0-9]/;
  if(!filter.test(ch)){
      evt.returnValue = false;
  }
}

//MAXIMUM FOR BIRTHDAY
var birthdate = new Date();
var dd = birthdate.getDate();
var mm = birthdate.getMonth()+1; //January is 0!
var yyyy = birthdate.getFullYear()-18;
if(dd < 10){
  dd = '0' + dd
} 
if(mm < 10){
  mm = '0' + mm
} 
birthdate = yyyy + '-' + mm + '-' + dd;

//MINIMUM FOR BIRTHDAY
var mindate = new Date();
var mindd = mindate.getDate();
var minmm = mindate.getMonth()+1;
var minyyyy = mindate.getFullYear()-60;

if(mindd < 10){
  mindd = '0' + mindd
}

if(minmm < 10){
  minmm = '0' + minmm;
}
mindate = minyyyy + '-' + minmm + '-' + mindd;

document.getElementById("birthdate").setAttribute("max", birthdate);
document.getElementById("birthdate").setAttribute("min", mindate);
document.getElementById("father_birthdate").setAttribute("max", birthdate);
document.getElementById("father_birthdate").setAttribute("min", mindate);
document.getElementById("mother_birthdate").setAttribute("max", birthdate);
document.getElementById("mother_birthdate").setAttribute("min", mindate);


var licensedate = new Date();
var licensedd = licensedate.getDate();
var licensemm = licensedate.getMonth()+2;
var licenseyyyy = licensedate.getFullYear();

if(licensedd < 10){
  licensedd = '0' + licensedd
}

if(licensemm < 10){
  licensemm = '0' + licensemm;
}
licensedate = licenseyyyy + '-' + licensemm + '-' + licensedd;
console.log(licensedate)
document.getElementById("licenseExpiry1").setAttribute("min", licensedate);