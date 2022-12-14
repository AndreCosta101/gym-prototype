import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserDTO } from "../dtos/UserDTO";  
import {USER_STORAGE} from "./storageConfig";

export async function saveUserStorage(user: UserDTO) {  
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export async function getUserStorage() {  
  const user = await AsyncStorage.getItem(USER_STORAGE);
  return user ? (JSON.parse(user) as UserDTO) : null;
}

export async function removeUserStorage() {  
  await AsyncStorage.removeItem(USER_STORAGE);
}