import { Transform } from 'class-transformer'; /* os valores da query são recebidos como string; p/ transformá-los no que
precisamos (no caso, number), vamos utilizá-lo */
import { IsString, IsNumber, Min, Max, IsLongitude, IsLatitude } from 'class-validator'

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value)) // string -> número inteiro
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @Transform(({ value }) => parseFloat(value)) // string -> número decimal
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;
}