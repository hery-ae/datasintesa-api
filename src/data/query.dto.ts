import { IsNumberString, IsIn, IsOptional, IsDateString, ValidateIf } from 'class-validator'

export class QueryDto {
    @IsNumberString()
    'length': number

    @IsIn(['_id', 'result_time'])
    @IsOptional()
    'sort-by': string

    @IsIn(['asc', 'desc'])
    @IsOptional()
    'sort-direction': string

    @IsNumberString()
    @ValidateIf((object, value) => value)
    'enodeb-id': string | null

    @IsNumberString()
    @ValidateIf((object, value) => value)
    'cell-id': string | null

    @IsDateString()
    @ValidateIf((object, value) => value)
    'start-date': string | null

    @IsDateString()
    @ValidateIf((object, value) => value)
    'end-date': string | null

}
