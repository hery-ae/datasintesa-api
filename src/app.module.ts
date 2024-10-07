import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { DataModule } from './data/data.module'

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(
            (process.env.DB_URL || 'mongodb://localhost:27017'),
            {
                auth: {
                    username: (process.env.DB_USERNAME || 'mongo'),
                    password: (process.env.DB_PASSWORD || '')
                },
                dbName: (process.env.DB_NAME || 'datasintesa')
            }
        ),
        DataModule
    ]
})

export class AppModule {}
