import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(    
    
    new ValidationPipe({

    // Make sure that there's no unexpected data
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,

    /**
     * Reference: https://docs.nestjs.com/techniques/validation#transform-payload-objects
     * 
     * Payloads coming in over the network are plain JavaScript objects. 
     * The ValidationPipe can automatically transform payloads to be objects typed according to 
     * their DTO classes. 
     * To enable auto-transformation, set transform to true.
     */
    transform: true,
    })
  )
  
  await app.listen(3000);
}
bootstrap();
