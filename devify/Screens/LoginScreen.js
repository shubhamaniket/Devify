import React from 'react';
import {View,StyleSheet,Text,Dimensions,Image,TextInput,AsyncStorage,ActivityIndicator, SafeAreaView} from 'react-native';
//import styles from '../STYLES/loginstyles.js';
import { TouchableOpacity } from 'react-native-gesture-handler';
const {width,height} = Dimensions.get('window');

export default class LoginScreen extends React.Component{
    state = {
        showPassword : false,
        email : '',
        password : '',
        loading : false
    }
    showimage = () => {
        if(this.state.showPassword){
            return (
                <Image source={require('../assets/showpassword.png')}/>
            );
        }
        else{
            return(
                <Image source={require('../assets/notshowpassword.png')}/>
            );  
        }
    }
    handlelogin = async () => {
        this.setState({
            loading : true
        })
        fetch('https://devifyapp.herokuapp.com/login',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                email : this.state.email,
                password : this.state.password
            })
        })
        .then((res)=>res.json())
        .then(async (response)=>{
            if(response.success === false){
                alert(response.message)
                this.setState({
                    loading : false
                })
            }
            else{
                console.log(response)
                try {
                    this.setState({
                        loading : false
                    })
                    await AsyncStorage.setItem('token', response.token);
                    this.props.navigation.replace('Dashboard')
                  } catch (error) {
                     console.log(error)
                  }
            } 
        })
    }
    afterLogin = () => {
        if(this.state.loading){
            return(
                <ActivityIndicator
                    size="small"
                    color="#fff"
                />
            );
        }
        else{
            return(
                <Text style={styles.loginText}>Login</Text>
            );
        }
    }
    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                <Image source={{uri:'https://wallpapershome.com/images/pages/pic_h/21456.jpg'}}
                style={StyleSheet.absoluteFill}
                />
                <View style={styles.topbox}>
                    <Image source={require('../assets/logo.png')} style={{width:300,height:300}}/>
                </View>
                <View style={styles.loginBox}>
                    <Text style={styles.loginHeader}>Login</Text>
                    <View style={[styles.inputBox,{   marginTop : 50}]}>
                        <TextInput placeholder="Email"
                        style={{width:'100%',height:'100%',fontWeight:'bold',color:'#fff',fontSize:16}} 
                        placeholderTextColor="#fff"
                        onChangeText={(text)=>this.setState({
                            email : text
                        })}
                        />
                    </View>
                    <View style={[styles.inputBox,{   marginTop : 30}]}>
                        <View style={styles.passwordbox}>
                            <TextInput placeholder="Password" 
                            style={{width:'100%',height:'100%',fontWeight:'bold',color:'#fff',fontSize:16}} 
                            placeholderTextColor="#fff"
                            secureTextEntry={this.state.showPassword}
                            onChangeText={(text)=>this.setState({
                                password : text
                            })}
                            />
                        </View>
                        <View style={styles.iconbox}>
                            <TouchableOpacity onPress={()=>this.setState({
                                showPassword : !this.state.showPassword,
                                uri : require('../assets/showpassword.png')
                            })}>
                                {this.showimage()}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.loginBtn} onPress={()=>this.handlelogin()}>
                        {this.afterLogin()}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signUp} onPress={()=>this.props.navigation.navigate('SignupScreen')}>
                        <Text style={{color:'#fff'}}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#fff',
        alignItems:'center'
    },
    topbox : {
        flex:1,
        width : width,
        height : 250,
        alignItems : 'center',
        justifyContent :'center',
        borderBottomRightRadius : 300
    },
    loginBox : {
        flex:2,
        width : width-50,
        padding : 15
    },
    loginHeader : {
        fontWeight : 'bold',
        fontSize : 30,
        fontFamily : 'Roboto',
        letterSpacing : -0.5,
        color:'#fff'
    },
    inputBox : {
        width : '100%',
        height : 50,
        borderWidth : 2,
        borderColor : '#fff',
        flexDirection : 'row',
        padding : 5
    },
    loginBtn : {
        marginTop : 50,
        width : '100%',
        height : 50,
        borderRadius : 100,
        backgroundColor : '#7B55DF',
        alignItems : 'center',
        justifyContent : 'center'
    },
    loginText : {
        color : '#fff'
    },
    signUp : {
        height:50,
        width : 100,
        alignSelf : 'flex-end',
        marginTop : 25,
        left : 40,
        alignItems:'center',
        justifyContent:'center',
        borderBottomLeftRadius : 100,
        borderTopLeftRadius : 100,
        backgroundColor : '#000',
    },
    passwordbox : {
        flex:5
    },
    iconbox : {
        flex:1,
        alignItems : 'center',
        justifyContent : 'center',
    }
})