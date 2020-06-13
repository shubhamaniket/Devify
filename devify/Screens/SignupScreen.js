import React from 'react';
import {View,StyleSheet,Text,Dimensions,Image,TextInput,SafeAreaView,ActivityIndicator,AsyncStorage} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
const {width,height} = Dimensions.get('window');


export default class LoginScreen extends React.Component{
    state = {
        showPassword : false,
        photo : null,
        name : '',
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
    showPhoto = () => {
        if(this.state.photo === null){
            return(
                <Text style={{color:'#fff'}}>Click Here to Upload</Text>
            );
        }
        else{
            if(this.state.loading){
                return(
                    <ActivityIndicator size="large" color="#000"/>
                );
            }
            else{
                return(
                    <Image
                        source={{ uri: this.state.photo }}
                        style={{ width: 173, height: 165, borderRadius:100 }}
                    />
                );
            }
        }
    }
    pickfromgallery = async () => {
        const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(granted){
            let data = await ImagePicker.launchImageLibraryAsync({
                mediaTypes : ImagePicker.MediaTypeOptions.Images,
                allowsEditing : true,
                aspect : [1,1],
                quality : 0.5
            })
            this.setState({
                loading : true
            })
            if(!data.cancelled){
                let newfile = {
                    uri : data.uri,
                    type : `test/${data.uri.split(".")[1]}`,
                    name : `test.${data.uri.split(".")[1]}`
                }
                this.uploadImage(newfile)
            }
        }
        else{
            alert("You need to give Permission to upload Photo")
        }
    }
    uploadImage = (image) => {
        const data = new FormData()
        data.append('file',image)
        data.append('upload_preset','devify')
        data.append('cloud_name','dknknjpjq')

        fetch('https://api.cloudinary.com/v1_1/dknknjpjq/image/upload',{
            method : 'POST',
            body : data
        })
        .then((res)=>res.json())
        .then((response)=>{
            console.log(response)
        })
        .catch((err)=>console.log(err))
    }
    handleSignUp = async () => {
        this.setState({
            loading : true
        })
        fetch('https://devifyapp.herokuapp.com/createUser',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                name : this.state.name,
                email : this.state.email,
                password : this.state.password,
                photo : this.state.photo
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
                <Text style={styles.loginText}>Sign Up</Text>
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
                    <TouchableOpacity style={styles.profilePic} onPress={this.pickfromgallery}>
                        {this.showPhoto()}
                    </TouchableOpacity>
                    <View style={styles.showCamera}>
                        <Image source={require('../assets/ar-camera.png')} style={{width:22,height:22}}/>
                    </View>
                </View>
                <View style={styles.loginBox}>
                    <Text style={styles.loginHeader}>Register</Text>
                    <View style={[styles.inputBox,{   marginTop : 30}]}>
                        <TextInput placeholder="Name"
                        style={{width:'100%',height:'100%',fontSize:16,color:'#fff',padding:5,fontWeight:'bold'}} 
                        placeholderTextColor="#fff"
                        onChangeText={(text)=>{
                            this.setState({
                                name : text
                            })
                        }}/>
                    </View>
                    <View style={[styles.inputBox,{   marginTop : 30}]}>
                        <TextInput 
                        style={{width:'100%',height:'100%',fontSize:16,color:'#fff',padding:5,fontWeight:'bold'}} 
                        placeholderTextColor="#fff"
                        placeholder="Email" onChangeText={(text)=>{
                            this.setState({
                                email : text
                            })
                        }}/>
                    </View>
                    <View style={[styles.inputBox,{   marginTop : 30}]}>
                        <View style={styles.passwordbox}>
                            <TextInput 
                            style={{width:'100%',height:'100%',fontSize:16,color:'#fff',padding:5,fontWeight:'bold'}} 
                            placeholderTextColor="#fff"
                            placeholder="Password" secureTextEntry={this.state.showPassword} onChangeText={(text)=>{
                            this.setState({
                                password : text
                            })
                        }}/>
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
                    <TouchableOpacity style={styles.loginBtn} onPress={()=>this.handleSignUp()}>
                        {this.afterLogin()}
                    </TouchableOpacity>
                    <Text style={{color:'#fff',alignSelf:'center',marginTop:15}}>Already Registered ?? <Text style={{color:'#7B55DF',fontWeight:'bold'}} onPress={()=>this.props.navigation.navigate('LoginScreen')}>Login</Text></Text>
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
    },
    loginBox : {
        flex:2,
        width : width-50,
        height : height/2,
        padding : 15
    },
    loginHeader : {
        fontWeight : 'bold',
        fontSize : 30,
        fontFamily : 'Roboto',
        letterSpacing : -0.,
        color : '#fff'
    },
    inputBox : {
        width : '100%',
        height : 50,
        borderWidth : 1,
        borderColor : '#fff',
        flexDirection : 'row'
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
    },
    profilePic : {
        width : 173,
        height : 165,
        borderWidth:1,
        borderColor:'#fff',
        borderRadius : 100,
        alignItems : 'center',
        justifyContent : 'center',
    },
    showCamera : {
        width : 30,
        height : 30,
        backgroundColor : '#fff',
        position : 'absolute',
        right : 105,
        bottom : 55,
        alignItems:'center',
        justifyContent:'center',
        borderRadius : 100,
        borderWidth : 1,
        borderColor : '#000'
    },
    textonly : {
        alignSelf : 'center',
        color : '#fff'
    }
})
