import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import app from '../app.json';

const SplashScreen = () => {
  const version = app.expo.version;

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1}>
      <ImageBackground
        source={require('../assets/images/SplashScreen.png')}
        style={styles.background}
        resizeMode='cover'
      >
        <Text style={styles.versionText}>Version {version}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  versionText: {
    marginBottom: 150,
    color: 'black',
    fontSize: 18,
    fontFamily: 'Inter-Regular',
  },
});

export default SplashScreen;
