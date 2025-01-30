import { v4 as uuidv4 } from 'uuid';
import UserSchema from '../Models/UserSchema.js';

async function migrateUsers() {
  const users = await UserSchema.find();

  for (const user of users) {
    if (typeof user._id === 'number' || !user._id.includes('-')) {
      const newId = uuidv4();
      console.log(`Migrando usuario ${user.username} de ID ${user._id} a ${newId}`);
      
      user._id = newId;
      await user.save();
    }
  }
}

migrateUsers().then(() => {
  console.log('Migración completada');
}).catch(error => {
  console.error('Error en la migración:', error);
});
migrateUsers().then(() => {
    console.log('Migración completada');
    }).catch(error => {
    console.error('Error en la migración:', error);
    });