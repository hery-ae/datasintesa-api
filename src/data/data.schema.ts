import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type DataDocument = Data & Document

@Schema()
export class Data {
    @Prop()
    declare result_time: string

    @Prop()
    declare granularity_period: string

    @Prop()
    declare object_name: string

    @Prop()
    declare enodeb_id: number

    @Prop()
    declare cell_id: number

    @Prop()
    declare reliability: string

    @Prop()
    declare l_cell_avail_dur: string

    @Prop()
    declare l_cell_unavail_dur_energy_saving: string

    @Prop()
    declare l_cell_unavail_dur_manual: string

    @Prop()
    declare l_cell_unavail_dur_sys: string

    @Prop()
    declare l_cell_unavail_dur_sys_s1fail: string

    @Prop()
    declare l_voice_e2evqi_accept_times: number

    @Prop()
    declare l_voice_e2evqi_bad_times: number

    @Prop()
    declare l_voice_e2evqi_excellent_times: number

    @Prop()
    declare l_voice_e2evqi_good_times: number

    @Prop()
    declare l_voice_e2evqi_poor_times: number

    @Prop()
    declare availability: number
}

export const DataSchema = SchemaFactory.createForClass(Data)
