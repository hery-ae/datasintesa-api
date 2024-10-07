import { Controller, Get, HttpException, HttpStatus, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common'
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express/multer'
import Papa from 'papaparse'
import { DataService } from './data.service'
import { Data } from './data.schema'
import { DataDto } from './data.dto'
import { QueryDto } from './query.dto'

@Controller()
export class DataController {
    constructor(private dataService: DataService) {}

    @Get()
    @UsePipes(new ValidationPipe())
    async getData(
        @Query() queryDto: QueryDto
    ): Promise<Data[]> {
        const where: any = {}

        if (queryDto['enodeb-id']) where.enodeb_id = queryDto['enodeb-id']

        if (queryDto['cell-id']) where.cell_id = queryDto['cell-id']

        if (queryDto['start-date']) where.result_time = { $gt: queryDto['start-date'] }

        if (queryDto['end-date']) where.result_time = Object.assign((where.result_time || {}), { $lt: queryDto['end-date'] })

        return (
            this.dataService
            .findMany(
                where,
                Number(queryDto.length),
                {
                    [queryDto['sort-by']]: queryDto['sort-direction']
                }
            )
        )
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @UsePipes(new ValidationPipe())
    async postData(
        @UploadedFile()
        file: Express.Multer.File
    ) {
        if (!file) throw new HttpException('The file is not submitted!', HttpStatus.BAD_REQUEST)
        if (file.mimetype !== 'text/csv') throw new HttpException('The file type is not supported!', HttpStatus.BAD_REQUEST)

        const csv = file.buffer.toString()
        const json = Papa.parse(csv)

        if (json.errors.length) throw new HttpException('The file-format module cannot parse the file!', HttpStatus.BAD_REQUEST)

        const data = (json.data.slice(2)).reduce(
            (data: DataDto[], value) => {
                const values = value as Array<string>
                const dataDto = new DataDto()

                if (!values[0]) return data

                const columns = json.data[0] as Array<string>
                const units = (json.data[1]) as string[]

                const granularityPeriod = columns.indexOf('Granularity Period')
                const lCellAvailDur = columns.indexOf('L.Cell.Avail.Dur')
                const lCellUnavailDurEnergySaving = columns.indexOf('L.Cell.Unavail.Dur.EnergySaving')
                const lCellUnavailDurManual = columns.indexOf('L.Cell.Unavail.Dur.Manual')
                const lCellUnavailDurSys = columns.indexOf('L.Cell.Unavail.Dur.EnergySaving')
                const lCellUnavailDurSysS1Fail = columns.indexOf('L.Cell.Unavail.Dur.Sys.S1Fail')

                dataDto.resultTime = values[columns.indexOf('Result Time')]
                dataDto.granularityPeriod = (values[granularityPeriod]).concat(' ').concat(units[granularityPeriod])
                dataDto.objectName = values[columns.indexOf('Object Name')]
                dataDto.reliability = values[columns.indexOf('Reliability')]
                dataDto.lCellAvailDur = values[lCellAvailDur].concat(units[lCellAvailDur])
                dataDto.lCellUnavailDurEnergySaving = values[lCellUnavailDurEnergySaving].concat(units[lCellUnavailDurEnergySaving])
                dataDto.lCellUnavailDurManual = values[lCellUnavailDurManual].concat(units[lCellUnavailDurManual])
                dataDto.lCellUnavailDurSys = values[lCellUnavailDurSys].concat(units[lCellUnavailDurSys])
                dataDto.lCellUnavailDurSysS1Fail = values[lCellUnavailDurSysS1Fail].concat(units[lCellUnavailDurSysS1Fail])
                dataDto.lVoiceE2EVQIAcceptTimes = parseInt(values[columns.indexOf('L.Voice.E2EVQI.Accept.Times')])
                dataDto.lVoiceE2EVQIBadTimes = parseInt(values[columns.indexOf('L.Voice.E2EVQI.Bad.Times')])
                dataDto.lVoiceE2EVQIExcellentTimes = parseInt(values[columns.indexOf('L.Voice.E2EVQI.Excellent.Times')])
                dataDto.lVoiceE2EVQIGoodTimes = parseInt(values[columns.indexOf('L.Voice.E2EVQI.Good.Times')])
                dataDto.lVoiceE2EVQIPoorTimes = parseInt(values[columns.indexOf('L.Voice.E2EVQI.Poor.Times')])

                const enodebIdMatch = (
                    (dataDto.objectName).match(
                        /eNodeB ID=([0-9]+),/
                    )
                )

                if (enodebIdMatch?.[1]) {
                    dataDto.enodebId = parseInt(enodebIdMatch[1], 10)
                }

                const cellIdMatch = (
                    (dataDto.objectName).match(
                        /Cell ID=([0-9]+),/
                    )
                )

                if (cellIdMatch?.[1]) {
                    dataDto.cellId = parseInt(cellIdMatch[1], 10)
                }

                data.push(dataDto)

                return data
            },
            []
        )

        return this.dataService.insertMany(data)
    }
}
