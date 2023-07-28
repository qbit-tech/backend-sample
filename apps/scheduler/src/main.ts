import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const bodyParser = require('body-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error'],
  });

  app.enableCors({ origin: true, exposedHeaders: ['*'] });
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  const port = process.env.HTTP_PORT || 4000;
  await app.listen(port);
  console.info('localhost:' + port);
}
bootstrap();
