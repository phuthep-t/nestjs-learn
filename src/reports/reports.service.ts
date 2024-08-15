import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/uesr.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {

  constructor(@InjectRepository(Report) private repo: Repository<Report>) {
  }

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);


  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approved = approved;
    return this.repo.save(report);

  }

  async createEstimate({ make, model, lng, lat , year, mileage}: GetEstimateDto) {
    return this.repo.createQueryBuilder()
      .select('*')
      .where('make=:make', { make })
      .andWhere('model=:model', { model })
      .andWhere('lng- :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat- :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year- :year BETWEEN -5 AND 5', { year })
      .andWhere('approved IS TRUE')
      .orderBy('mileage- :mileage')
      .setParameters({mileage})
      .getRawMany();
  }
}
