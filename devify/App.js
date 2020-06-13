import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './Screens/splashscreen';
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import Dashboard from './Screens/Dashboard';

const Stack = createStackNavigator();

export default class App extends React.Component{
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerTransparent:true,title:'',headerTintColor:'#fff'}}/>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerTransparent:true,title:'',headerTintColor:'#fff'}}/>
          <Stack.Screen name="SignupScreen" component={SignupScreen} options={{headerTransparent:true,title:'',headerTintColor:'#fff'}}/>
          <Stack.Screen name="Dashboard" component={Dashboard} options={{headerTransparent:true,title:'',headerTintColor:'#fff'}}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}