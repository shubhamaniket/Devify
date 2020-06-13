import React from 'react';
import {View,StyleSheet,Image, Dimensions,Text,Button,ActivityIndicator,AsyncStorage} from 'react-native';
import {DotIndicator} from 'react-native-indicators';
const {width,height} = Dimensions.get('window');

export default class SplashScreen extends React.Component {
  detectLogin = async () => {
    const token = await AsyncStorage.getItem('token')
    if(token){
        setTimeout(
          ()=>{
            this.props.navigation.replace('Dashboard')
          },2000
        )
    }
    else{
      setTimeout(
        ()=>{
          this.props.navigation.replace('LoginScreen')
        },2000
      )
    }
  }
  componentDidMount(){
      this.detectLogin();
  }  
  render() {
    return (
      <View style={styles.container}>
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
          <Image source={require('../assets/logo.png')} style={{width:300,height:300}}/>
        </View>
        <DotIndicator size={10} color="#fff"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    backgroundColor : '#7B55DF',
  }
})