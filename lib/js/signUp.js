const database = firebase.database().ref();
let bcrypt = dcodeIO.bcrypt;

let username = document.getElementById("username");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirmPassword");

let signUpButton = document.getElementById("submit_button");

let passwordCheck = /\w{6}/;
//Google Sign Up
function renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSuccess,
      'onfailure': onFailure
    });
  }

  function onSuccess(googleUser) {

    let profile = {
      email: googleUser.getBasicProfile().getEmail(),
      username: googleUser.getBasicProfile().getName(),
      image: googleUser.getBasicProfile().getImageUrl(),
      password: ""
    }

    database.child('users').push(profile);
    console.log(googleUser);
    window.location.href="../Overview/overview.html";
  }

  function onFailure(error) {
    console.log(error);
  }
  //End of Google Sign Up


async function signUp(event) {
    event.preventDefault();
    
    let passwordPass1 = true;
    let passwordPass2 = true;
    let usernamePass = false;

    function usernameCheck(){
      const user = username.value;
      const userInfo = await database.child(`users/${user}`).once('value');
      if (!userInfo){
        usernamePass = true;
      }else{
        alert('Username is already in use!')
      }

    if (!passwordCheck.test(password.value)) {
        alert("Password needs to be 6 characters or longer");
        passwordPass1 = false;
    }

    if (password.value != confirmPassword.value) {
        alert("Password's aren't the same");
        passwordPass2 = false;
    }

    let hashedPassword = bcrypt.hashSync(password.value, 10);

    const value = {
        username: username.value,
        password: hashedPassword
    }

    console.log(value);

    //Update database here
    if (usernamePass == true && passwordPass1 == true && passwordPass2 == true) {
        let usernameCheck = await database.child('users').orderByChild('username').equalTo(value.username).once("value");
        usernameCheck = usernameCheck.val();
        const userExists = await database.child(`user/${value.username}`).once('value');
        if(userExists.exists()) {
            alert('User alrady exists');
            return; 
        }
        console.log("Valid inputs");
        database.child(`users/${value.username}`).set(value);
    }
}

signUpButton.addEventListener('click', signUp);


