import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function AccountCreatedScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Replace with your own image */}
      {/* <Image source={require('../../assets/Images/account_created.png')} style={styles.image} /> */}
      {/* <Text style={styles.header}>Account Created</Text> */}
      <TouchableOpacity style={styles.button} onPress={() => {/* navigate home */}}>
        <Text style={styles.buttonText}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#FBFAF7', padding:20 },
  image: { width:120, height:120, marginBottom:24, resizeMode:'contain' },
  header: { fontSize:24, fontWeight:'bold', color:'#7B32FF', marginBottom:28, textAlign:'center' },
  button: { backgroundColor:'#7B32FF', padding:16, borderRadius:8 },
  buttonText: { color:'#fff', fontWeight:'bold', textAlign:'center', fontSize:16 },
});
