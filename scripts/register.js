var username;
var password;
var personalName;
var poolData;

function registerButton() {
    event.preventDefault();
    personalName = document.getElementById("nameRegister").value;
    username = document.getElementById("emailRegister").value;
    
    if(document.getElementById("passwordRegister").value !== document.getElementById("confirmPasswordRegister").value) {
        alert("Passwords DO NOT MATCH!");
        throw "Passwords DO NOT MATCH!"
    }
    else {
        password = document.getElementById("passwordRegister").value;
    }
    
    poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.clientId
    };
    
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    
    var attributeList = [];
    
    var dataEmail = {
        Name: 'email',
        Value: username,
    };
    
    var dataPersonalName = {
        Name: 'name',
        Value: personalName,
    };
    
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    var attributePersonalName = new AmazonCognitoIdentity.CognitoUserAttribute(dataPersonalName);
    
    attributeList.push(attributeEmail);
    attributeList.push(attributePersonalName);
    
    userPool.signUp(username, password, attributeList, null, function(err, result) {
        if(err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        
        cognitoUser = result.user;
        console.log('user name is: ' + cognitoUser.getUsername());
        localStorage.setItem("registeredEmail", cognitoUser.getUsername());
        
        var checkEmail = document.getElementById("checkEmail");
        checkEmail.innerHTML = "Check your email for a verification link";
        checkEmail.style.textAlign = 'center';
    });
}














