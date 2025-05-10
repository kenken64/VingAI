import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import { downloadGGUFModel } from '../utils/fileSystem';
import { Model } from '../types';

interface ModelDownloaderProps {
  onModelDownloaded: (model: Model) => void;
}

const ModelDownloader: React.FC<ModelDownloaderProps> = ({ onModelDownloaded }) => {
  const [url, setUrl] = useState('https://huggingface.co/unsloth/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q4_K_M.gguf');
  const [modelName, setModelName] = useState('Qwen3-0.6B-Q4_K_M');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    if (!url) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    if (!url.endsWith('.gguf')) {
      Alert.alert('Error', 'URL must point to a GGUF file');
      return;
    }

    if (!modelName) {
      // Extract model name from URL if not provided
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      setModelName(fileName.replace('.gguf', ''));
    }

    setDownloading(true);
    setProgress(0);

    try {
      const downloadedModel = await downloadGGUFModel(
        url, 
        modelName || 'unnamed-model',
        (progress) => setProgress(progress)
      );
      
      Alert.alert('Success', `Successfully downloaded ${downloadedModel.name}`);
      onModelDownloaded(downloadedModel);
      
    } catch (error) {
      Alert.alert('Error', `Failed to download model: ${error}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Download GGUF Model</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Model URL (must end with .gguf):</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com/model.gguf"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!downloading}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Model Name (optional):</Text>
        <TextInput
          style={styles.input}
          placeholder="My GGUF Model"
          value={modelName}
          onChangeText={setModelName}
          editable={!downloading}
        />
      </View>
      
      {downloading ? (
        <View style={styles.progressContainer}>
          <Progress.Bar progress={progress} width={null} height={10} />
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleDownload}
          disabled={downloading || !url}
        >
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
  },
});

export default ModelDownloader;