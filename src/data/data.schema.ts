import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type DataDocument = Data & Document

@Schema()
export class Data {
    @Prop()
    result_time!: string

    @Prop()
    granularity_period!: string

    @Prop()
    object_name!: string

    @Prop()
    enodeb_id!: number

    @Prop()
    cell_id!: number

    @Prop()
    reliability!: string

    @Prop()
    l_cell_avail_dur!: string

    @Prop()
    l_cell_unavail_dur_energy_saving!: string

    @Prop()
    l_cell_unavail_dur_manual!: string

    @Prop()
    l_cell_unavail_dur_sys!: string

    @Prop()
    l_cell_unavail_dur_sys_s1fail!: string

    @Prop()
    l_voice_e2evqi_accept_times!: number

    @Prop()
    l_voice_e2evqi_bad_times!: number

    @Prop()
    l_voice_e2evqi_excellent_times!: number

    @Prop()
    l_voice_e2evqi_good_times!: number

    @Prop()
    l_voice_e2evqi_poor_times!: number

    @Prop()
    availability!: number
}

export const DataSchema = SchemaFactory.createForClass(Data)
