const database = firebase.database().ref();
let bcrypt = dcodeIO.bcrypt;

let username = document.getElementById("username");
let password = document.getElementById("password");
let signInButton= document.getElementById("submit_button");

signInButton.addEventListener('click', login);

async function login(e){
  e.preventDefault();
  const user = username.value;
  const userInfo = await database.child(`users/${user}`).once('value');
  const userPass = userInfo.val().password;
  console.log(userInfo.val());
  if(bcrypt.compareSync(password.value, userPass)){
    alert(`Logged In as ${userInfo.val().username}`)
    console.log(userInfo.val().username);
    sessionStorage.setItem("user", userInfo.val().username);
  } else {
    alert('Wrong Password or Username');
  }
}

  // function renderButton() {
  //   gapi.signin2.render('my-signin2', {
  //     'scope': 'profile email',
  //     'width': 240,
  //     'height': 50,
  //     'longtitle': true,
  //     'theme': 'dark',
  //     'onsuccess': onSuccess,
  //     'onfailure': onFailure
  //   });
  // }

  // function onSuccess(googleUser) {

  //   let profile = {
  //     email: googleUser.getBasicProfile().getEmail(),
  //     username: googleUser.getBasicProfile().getName(),
  //     image: googleUser.getBasicProfile().getImageUrl(),
  //     password: ""
  //   }

  //   database.child('users').push(profile);
  //   console.log(googleUser);
  //   window.location.href="../Overview/overview.html";
  // }

  // function onFailure(error) {
  //   console.log(error);
  // }