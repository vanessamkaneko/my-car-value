import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repo: Repository<Report>
  ) {}

  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.repo.createQueryBuilder()

      // This selects the average price of the matching cars from the database.
      .select('AVG(price)', 'price')

      //  Finds records where the make matches the provided car brand (e.g., Toyota).
      .where('LOWER(make) = LOWER(:make)', { make }) // { make } -> o valor é pego da desestruturação do parâmetro recebido

      // .andWhere('model = :model', { model }): Filters records by the model
      .andWhere('LOWER(model) = LOWER(:model)', { model })

      // Filters cars that are within a longitude range of ±5 degrees from the provided longitude (lng).
      // EX: lng fornecida = 5; resultados trazidos: entre 0 e 10
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })

      //  Filters cars that are within a latitude range of ±5 degrees from the provided latitude (lat).
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      
      // Filters cars that are within a year range of ±3 years from the provided year.
      .andWhere('year - :year BETWEEN -3 AND 3', { year })

      .andWhere('approved IS TRUE')

      /* This orders the results based on the difference between the car’s mileage in the database and the provided mileage, 
      in descending order (i.e., from the biggest difference to the smallest). */
      .orderBy('ABS(mileage - :mileage)', 'DESC')

      // This passes the mileage value to be used in the query. (p/ ser usado no orderBy)
      .setParameters({ mileage })

      // This limits the results to the top 3 records that match the criteria.
      .limit(3)

      // This executes the query and returns a single raw result (the average price), not an entity object.
      .getRawOne()
  }

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);

    report.user = user;

    return this.repo.save(report)
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });

    if(!report) {
      throw new NotFoundException('Report not found!')
    }

    report.approved = approved;

    return this.repo.save(report)
  }

}

// createEstimate(estimateDto: GetEstimateDto) {
//   return this.repo.createQueryBuilder()
//     .select('*')
//     .where('make = :make', { make: estimateDto.make}) -> como se fosse: .where('make = estimateDto.make)
//     .getRawMany()
// }