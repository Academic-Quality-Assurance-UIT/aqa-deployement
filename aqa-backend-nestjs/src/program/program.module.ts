import { Module } from '@nestjs/common';
import { ProgramResolver } from './program.resolver';
import { ProgramService } from './program.service';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports: [ClassModule],
  providers: [ProgramResolver, ProgramService],
})
export class ProgramModule {}
