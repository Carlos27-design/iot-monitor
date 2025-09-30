import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:4200', 'http://iot-monitor-simulator:3000'],
    credentials: true,
  });
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
