import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  
  try {
    await usersService.create({
      name: 'System Administrator User',
      email: 'admin@roxiler.com',
      password: 'Admin@123',
      address: 'Roxiler Systems, Pune, Maharashtra, India',
      role: 'admin',
    });
    console.log('Admin created: admin@roxiler.com / Admin@123');
  } catch (e) {
    console.log('Admin already exists');
  }

  await app.close();
}
seed();