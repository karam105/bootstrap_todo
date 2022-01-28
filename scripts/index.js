function signInButton() {
    event.preventDefault();
    var authenticationData = {
        Username: document.getElementById("inputEmail").value,
        Password: document.getElementById("inputPassword").value,
    };

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.clientId,
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: document.getElementById("inputEmail").value,
        Pool: userPool,
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
            var identityToken = result.getIdToken().getJwtToken();
            localStorage.setItem("loggedInUserEmail", parseJwt(identityToken).email);
            localStorage.setItem("loggedInUsername", parseJwt(identityToken).name);
            location.href = './app.html';
        },

        onFailure: function (err) {
            alert(err.message || JSON.stringify(err));
        },
    });
}

function getUserAttributes(cognitoUser) {
    cognitoUser.getUserAttributes(function(err, result) {
        if(err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        for(i = 0; i < result.length; i++) {
            console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        };
    });
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};