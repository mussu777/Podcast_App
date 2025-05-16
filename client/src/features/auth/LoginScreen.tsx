import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../utils/Constants';
import {screenHeight, screenWidth} from '../../utils/Scaling';
import {Image} from 'react-native';
import CustomText from '../../components/ui/CustomText';
import {navigate} from '../../utils/NavigationUtils';
import {useMutation} from '@apollo/client';
import {LOGIN_MUTATION} from '../../graphQL/queries';
import {mmkvStorage} from '../../state/storage';
import {usePlayerStore} from '../../state/usePlayerStore';

const LoginScreen = () => {
  const {setUser} = usePlayerStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, {loading, error}] = useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    try {
      const {data} = await login({variables: {email, password}});
      if (data?.authenticateUserWithPassword?.sessionToken) {
        mmkvStorage.setItem(
          'token',
          data.authenticateUserWithPassword.sessionToken,
        );
        setUser(data.authenticateUserWithPassword.item);
        navigate('UserBottomTab');
      }
    } catch (err) {
      Alert.alert('Login failed: ' + error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icons/logo.png')}
        style={styles.logoImage}
      />
      <CustomText variant="h3" style={styles.header}>
        Login
      </CustomText>

      <TextInput
        value={email}
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.inactive}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        value={password}
        placeholderTextColor={Colors.inactive}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}>
        <CustomText variant="h5" style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </CustomText>
      </TouchableOpacity>

      {error && (
        <CustomText style={{color: 'red'}}>Error: {error.message}</CustomText>
      )}

      <TouchableOpacity onPress={() => navigate('RegisterScreen')}>
        <CustomText variant="h6" style={styles.signUpText}>
          Don't have an account? Sign Up
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    color: Colors.text,
  },
  logoImage: {
    height: screenHeight * 0.15,
    marginTop: 50,
    width: screenWidth * 0.6,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: Colors.text,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: Colors.background,
  },
  signUpText: {
    marginTop: 15,
    color: Colors.primary,
  },
});

export default LoginScreen;
