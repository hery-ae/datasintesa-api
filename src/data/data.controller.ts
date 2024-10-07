import { Controller, Get, HttpException, HttpStatus, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express/multer'
import Papa from 'papaparse'
import { DataService } from './data.service'
import { Data } from './data.schema'
import { DataDto } from './data.dto'

@Controller()
export class DataController {
    constructor(private dataService: DataService) {}

    @Get()
    async getData(
        @Query('enodeb-id') enodebId: number,
        @Query('cell-id') cellId: number,
        @Query('start-date') startDate: string,
        @Query('end-date') endDate: string
    ): Promise<Data[]> {
        return (
            this.dataService
            .findMany(enodebId, cellId, startDate, endDate)
            .then(
                (value) => value.map(
                    (value) => {
                        value.granularity_period += ' Minutes'

                        return value
                    }
                )
            )
        )
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async postData(
        @UploadedFile()
        file: Express.Multer.File
    ) {
        if (!file) throw new HttpException('The file is not submitted!', HttpStatus.BAD_REQUEST)

        const csv = file.buffer.toString()
        const json = Papa.parse(csv)

        if (json.errors.length) throw new HttpException(json.errors, HttpStatus.BAD_REQUEST)

        const data = (json.data.slice(2)).reduce(
            (data: DataDto[], value) => {
                const values = value as Array<string>
                const columns = json.data[0] as Array<string>
                const dataDto = new DataDto()

                if (!values[0]) return data

                dataDto.resultTime = values[columns.indexOf('Result Time')]
                dataDto.granularityPeriod = values[columns.indexOf('Granularity Period')]
                dataDto.objectName = values[columns.indexOf('Object Name')]
                dataDto.reliability = values[columns.indexOf('Reliability')]
                dataDto.lCellAvailDur = values[columns.indexOf('L.Cell.Avail.Dur')]
                dataDto.lCellUnavailDurEnergySaving = values[columns.indexOf('L.Cell.Unavail.Dur.EnergySaving')]
                dataDto.lCellUnavailDurManual = values[columns.indexOf('L.Cell.Unavail.Dur.EnergySaving')]
                dataDto.lCellUnavailDurSys = values[columns.indexOf('L.Cell.Unavail.Dur.EnergySaving')]
                dataDto.lCellUnavailDurSysS1Fail = values[columns.indexOf('L.Cell.Unavail.Dur.EnergySaving')]
                dataDto.lVoiceE2EVQIAcceptTimes = parseInt(values[columns.indexOf('L.Cell.Unavail.Dur.EnergySaving')])
                dataDto.lVoiceE2EVQIBadTimes = parseInt(values[columns.indexOf('L.Cell.Unavail.Dur.EnergySaving')])
                dataDto.lVoiceE2EVQIExcellentTimes = parseInt(values[columns.indexOf('L.Cell.Unavail.Dur.EnergySaving')])
                dataDto.lVoiceE2EVQIGoodTimes = parseInt(values[columns.indexOf('L.Cell.Unavail.Dur.EnergySaving')])
                dataDto.lVoiceE2EVQIPoorTimes = parseInt(values[columns.indexOf('L.Cell.Unavail.Dur.EnergySaving')])

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
