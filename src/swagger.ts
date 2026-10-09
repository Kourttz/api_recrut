import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function initSwagger(app: INestApplication) {
  const apiPrefix = process.env.API_PREFIX || '';

  const config = new DocumentBuilder()
    .setTitle('API RECRUTAMENTO')
    .setDescription('API responsável por gerenciar o processo de recrutamento.')
    .setVersion('1.1')
    .addServer(apiPrefix)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}
