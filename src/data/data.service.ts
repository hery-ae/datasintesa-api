import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Data, DataDocument } from './data.schema'
import { DataDto } from './data.dto'

@Injectable()
export class DataService {
    constructor(
        @InjectModel(Data.name)
        private dataModel: Model<DataDocument>
    ) {}

    insertMany(dataDto: DataDto[]): Promise<any> {
        const data = dataDto.map(
            (value) => {
                const data = new Data()

                data.result_time = value.resultTime
                data.granularity_period = value.granularityPeriod,
                data.object_name = value.objectName
                data.enodeb_id = value.enodebId
                data.cell_id = value.cellId
                data.reliability = value.reliability
                data.l_cell_avail_dur = value.lCellAvailDur
                data.l_cell_unavail_dur_energy_saving = value.lCellUnavailDurEnergySaving
                data.l_cell_unavail_dur_manual = value.lCellUnavailDurManual
                data.l_cell_unavail_dur_sys = value.lCellUnavailDurSys
                data.l_cell_unavail_dur_sys_s1fail = value.lCellUnavailDurSysS1Fail
                data.l_voice_e2evqi_accept_times = value.lVoiceE2EVQIAcceptTimes
                data.l_voice_e2evqi_bad_times = value.lVoiceE2EVQIBadTimes
                data.l_voice_e2evqi_excellent_times = value.lVoiceE2EVQIExcellentTimes
                data.l_voice_e2evqi_good_times = value.lVoiceE2EVQIGoodTimes
                data.l_voice_e2evqi_poor_times = value.lVoiceE2EVQIPoorTimes
                data.availability = (parseInt(value.lCellAvailDur) / 900) * 100

                return data
            }
        )

        return (
            this.dataModel
            .insertMany(
                data,
                {
                    ordered: false
                }
            )
            .then(
                (value) => {
                    return {
                        nInserted: value.length
                    }
                },
                (reason) => reason
            )
        )
    }

    findMany(where: Where, length: number, sort: any): Promise<Data[]> {
        return (
            this.dataModel
            .where(
                where
            )
            .limit(length)
            .sort(sort)
            .exec()
        )
    }
}

interface Where {
    enodeb_id?: number,
    cell_id?: number,
    result_time?: any
}
