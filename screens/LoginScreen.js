import React,{Component} from 'react';
import {Button, Text,View} from 'react-native';

export default class LoginScreen extends Component{

  
        isUserEqual = (googleUser, firebaseUser) => {
          if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
              if (
                providerData[i].providerId ===
                  firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()
              ) {

                return true;
              }
            }
          }
          return false;
        };
      
        onSignIn = googleUser => {
        
          var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
            unsubscribe();
            
            if (!this.isUserEqual(googleUser, firebaseUser)) {
              
              var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
              );

              firebase
                .auth()
                .signInWithCredential(credential)
                .then(function(result) {
                  if (result.additionalUserInfo.isNewUser) {
                    firebase
                      .database()
                      .ref("/users/" + result.user.uid)
                      .set({
                        gmail: result.user.email,
                        profile_picture: result.additionalUserInfo.profile.picture,
                        locale: result.additionalUserInfo.profile.locale,
                        first_name: result.additionalUserInfo.profile.given_name,
                        last_name: result.additionalUserInfo.profile.family_name,
                        current_theme: "dark"
                      })
                      .then(function(snapshot) {});
                  }
                })
                .catch(error => {
                  
                  var errorCode = error.code;
                  var errorMessage = error.message;
        
                  var email = error.email;

                  var credential = error.credential;
              
                });
            } else {
              console.log("User already signed-in Firebase.");
            }
          });
        };
    signInWithGoogleAsync = async() => {
        try {
            const result = await this.Google.logInAsync({
                behaviour:"web",
                androidClientId:
                "817479962532-0h4spataf1at24nqdgdp793dru77dkgb.apps.googleusercontent.com",
                iosClientId:
                "817479962532-8rfm0uhm116jtv7mljomm928ofbfnovc.apps.googleusercontent.com",
                scopes:['profile','email']
            });
            if (result.type === "success") {
                this.onSignIn(result);
                return result.accessToken;
              } else {
                return { cancelled: true };
              }
            } catch (e) {
              console.log(e.message);
              return { error: true };
            }
          };
        }
    
    render(){
        return(
            <View
                style={{flex:1,
                justifyContent:"center",
                alignItems:"center"
            }}>
                <Button title='sign in with google' onPress={()=> this.signInWithGoogleAsync()}></Button>
                <Text>Loading</Text>
            </View>
        )
    }
}