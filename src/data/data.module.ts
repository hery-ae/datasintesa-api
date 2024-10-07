import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Data, DataSchema } from './data.schema'
import { DataController } from './data.controller'
import { DataService } from './data.service'

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: Data.name,
                    schema: DataSchema.index(
                        {
                            enodeb_id: 1,
                            cell_id: 1,
                            result_time: 1
                        },
                        {
                            unique: true
                        }
                    )
            
                }
            ]
        )
    ],
    controllers: [DataController],
    providers: [DataService]
})

export class DataModule {}
