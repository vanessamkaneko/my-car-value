import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;

  /* no report entity que estamos formatando com este dto (ou seja, ao se criar um instância de report), pegue o user id atrelado
   a este report e use como valor de userId...*/
  @Transform(({ obj }) => obj.user.id) 
  @Expose()
  userId: number;
}