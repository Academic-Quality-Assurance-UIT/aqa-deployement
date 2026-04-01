import { Global, Module } from '@nestjs/common';
import { FilterQueryService } from './filter-query.service';

@Global()
@Module({
  providers: [FilterQueryService],
  exports: [FilterQueryService],
})
export class FilterQueryModule {}
