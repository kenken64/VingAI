import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ModelDownloader from '../components/ModelDownloader';
import ModelList from '../components/ModelList';
import { Model } from '../types';
import { RootStackParamList } from '../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  models: Model[];
  isLoading: boolean;
  onModelDownloaded: (model: Model) => void;
  onModelDelete: (model: Model) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  models, 
  isLoading, 
  onModelDownloaded, 
  onModelDelete 
}) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const handleModelPress = (model: Model) => {
    // Create a serializable version of the model by converting the date to string
    const serializableModel = {
      ...model,
      dateDownloaded: model.dateDownloaded.toISOString()
    };
    
    navigation.navigate('ModelDetail', { model: serializableModel });
  };

  // Get status bar height on Android
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: 16 + statusBarHeight }]}>
        <Text style={styles.title}>GGUF Model Downloader</Text>
      </View>
      <ModelDownloader onModelDownloaded={onModelDownloaded} />
      {isLoading ? (
        <View style={styles.loading}>
          <Text>Loading downloaded models...</Text>
        </View>
      ) : (
        <ModelList 
          models={models} 
          onDeleteModel={onModelDelete}
          onModelPress={handleModelPress}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#4A90E2',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;