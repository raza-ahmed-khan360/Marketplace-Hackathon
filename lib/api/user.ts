import { client } from '../sanity';
import bcrypt from 'bcryptjs';

interface BaseUserData {
  name: string;
  email: string;
}

interface PasswordUserData extends BaseUserData {
  password: string;
}

interface OAuthUserData extends BaseUserData {
  image?: string;
}

type UserData = PasswordUserData | OAuthUserData;

interface SanityUser {
  _id: string;
  _type: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  image?: string;
  createdAt: string;
}

export async function createUser(userData: UserData) {
  try {
    // Check if user already exists
    const existingUser = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: userData.email }
    );

    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Create base user object
    const baseUser = {
      _type: 'user',
      name: userData.name,
      email: userData.email,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    // Add password if it's a password-based user
    if ('password' in userData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      Object.assign(baseUser, { password: hashedPassword });
    }

    // Add image if it's an OAuth user
    if ('image' in userData && userData.image) {
      Object.assign(baseUser, { image: userData.image });
    }

    // Create new user
    const result = await client.create(baseUser) as SanityUser;

    // Return user without password
    const { password, ...userWithoutPassword } = result;
    return [userWithoutPassword, null];
  } catch (error) {
    console.error('Error creating user:', error);
    return [null, error];
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    ) as SanityUser;

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.password) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return [userWithoutPassword, null];
  } catch (error) {
    console.error('Error logging in:', error);
    return [null, error];
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    ) as SanityUser;
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return [userWithoutPassword, null];
    }
    return [null, null];
  } catch (error) {
    console.error('Error fetching user:', error);
    return [null, error];
  }
}

export async function updateUser(userId: string, updates: Partial<Omit<UserData, 'password'>>) {
  try {
    const result = await client
      .patch(userId)
      .set({
        ...updates,
        updatedAt: new Date().toISOString()
      })
      .commit() as SanityUser;
    
    const { password, ...userWithoutPassword } = result;
    return [userWithoutPassword, null];
  } catch (error) {
    console.error('Error updating user:', error);
    return [null, error];
  }
}

export async function deleteUser(userId: string) {
  try {
    const result = await client.delete(userId);
    return [result, null];
  } catch (error) {
    console.error('Error deleting user:', error);
    return [null, error];
  }
} 