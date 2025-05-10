import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { Model } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Get the appropriate directory for storing models
export const getModelsDirectory = (): string => {
  // Use the documents directory on iOS and the external directory on Android
  const baseDir = Platform.OS === 'ios' 
    ? RNFS.DocumentDirectoryPath 
    : RNFS.ExternalDirectoryPath;
  
  return `${baseDir}/gguf-models`;
};

// Ensure the models directory exists
export const ensureModelsDirectory = async (): Promise<void> => {
  const modelsDir = getModelsDirectory();
  const exists = await RNFS.exists(modelsDir);
  
  if (!exists) {
    await RNFS.mkdir(modelsDir);
  }
};

// Get all downloaded models
export const getDownloadedModels = async (): Promise<Model[]> => {
  await ensureModelsDirectory();
  const modelsDir = getModelsDirectory();
  
  try {
    const files = await RNFS.readDir(modelsDir);
    
    const models: Model[] = [];
    
    for (const file of files) {
      if (file.name.endsWith('.gguf')) {
        models.push({
          id: uuidv4(),
          name: file.name.replace('.gguf', ''),
          path: file.path,
          size: file.size || 0,
          dateDownloaded: new Date(),
        });
      }
    }
    
    return models;
  } catch (error) {
    console.error('Error reading models directory:', error);
    return [];
  }
};

// Download a GGUF model
export const downloadGGUFModel = async (
  url: string,
  modelName: string,
  progressCallback: (progress: number) => void
): Promise<Model> => {
  await ensureModelsDirectory();
  const modelsDir = getModelsDirectory();
  
  // Ensure model name has .gguf extension
  const sanitizedModelName = modelName.endsWith('.gguf') 
    ? modelName 
    : `${modelName}.gguf`;
  
  const destPath = `${modelsDir}/${sanitizedModelName}`;
  
  // Check if file already exists
  const exists = await RNFS.exists(destPath);
  if (exists) {
    throw new Error(`A model with the name ${sanitizedModelName} already exists`);
  }
  
  try {
    // Start the download
    const download = await RNFS.downloadFile({
      fromUrl: url,
      toFile: destPath,
      progress: (res) => {
        const progress = res.bytesWritten / res.contentLength;
        progressCallback(progress);
      },
      progressDivider: 1, // Update progress on every 1% change
    }).promise;
    
    if (download.statusCode !== 200) {
      throw new Error(`Download failed with status code ${download.statusCode}`);
    }
    
    // Get file stats
    const stats = await RNFS.stat(destPath);
    
    return {
      id: uuidv4(),
      name: modelName,
      path: destPath,
      size: stats.size,
      dateDownloaded: new Date(),
    };
  } catch (error) {
    // Clean up partial download if it exists
    const fileExists = await RNFS.exists(destPath);
    if (fileExists) {
      await RNFS.unlink(destPath);
    }
    
    throw error;
  }
};

// Delete a GGUF model
export const deleteGGUFModel = async (modelPath: string): Promise<boolean> => {
  try {
    // Check if file exists
    const exists = await RNFS.exists(modelPath);
    if (!exists) {
      throw new Error(`Model file at ${modelPath} does not exist`);
    }
    
    // Delete the file
    await RNFS.unlink(modelPath);
    return true;
  } catch (error) {
    console.error('Error deleting model:', error);
    throw error;
  }
};