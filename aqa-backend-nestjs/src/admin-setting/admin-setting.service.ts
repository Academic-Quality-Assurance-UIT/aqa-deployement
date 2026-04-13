import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminSetting } from './entities/admin-setting.entity';

@Injectable()
export class AdminSettingService implements OnModuleInit {
  constructor(
    @InjectRepository(AdminSetting)
    private readonly adminSettingRepository: Repository<AdminSetting>,
  ) {}

  async onModuleInit() {
    try {
      const filterYearSetting = await this.adminSettingRepository.findOne({
        where: { key: 'filter_year' },
      });
      if (!filterYearSetting) {
        await this.adminSettingRepository.save({
          key: 'filter_year',
          value: '5',
        });
      }
    } catch (error) {
      console.error('Failed to initialize AdminSetting:', error.message);
    }
  }

  async getSetting(key: string): Promise<AdminSetting> {
    const setting = await this.adminSettingRepository.findOne({
      where: { key },
    });
    if (!setting) {
      return { key, value: '' };
    }
    return setting;
  }

  async setSetting(key: string, value: string): Promise<AdminSetting> {
    const setting = await this.adminSettingRepository.findOne({
      where: { key },
    });
    if (setting) {
      setting.value = value;
      return this.adminSettingRepository.save(setting);
    } else {
      return this.adminSettingRepository.save({ key, value });
    }
  }
}
