import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSettingService } from './admin-setting.service';
import { AdminSettingResolver } from './admin-setting.resolver';
import { AdminSetting } from './entities/admin-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminSetting])],
  providers: [AdminSettingService, AdminSettingResolver],
  exports: [AdminSettingService],
})
export class AdminSettingModule {}
