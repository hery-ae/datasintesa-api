import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.enableCors({
        origin: process.env.ALLOW_ORIGINS
    })

    await app.listen(process.env.APP_PORT || 3000, process.env.APP_HOSTNAME || 'localhost')
}

bootstrap()
