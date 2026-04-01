import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { AdminSetting } from './entities/admin-setting.entity';
import { AdminSettingService } from './admin-setting.service';
import { Role } from '../user/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../user/decorator/user.decorator';
import { UserEntity } from '../user/entities/user.entity';

@Resolver(() => AdminSetting)
export class AdminSettingResolver {
  constructor(private readonly adminSettingService: AdminSettingService) {}

  @Query(() => AdminSetting)
  async getSetting(@Args('key') key: string): Promise<AdminSetting> {
    return this.adminSettingService.getSetting(key);
  }

  @Mutation(() => AdminSetting)
  @UseGuards(JwtAuthGuard)
  async updateSetting(
    @Args('key') key: string,
    @Args('value') value: string,
    @CurrentUser() user: UserEntity,
  ): Promise<AdminSetting> {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only ADMIN users can update settings');
    }
    return this.adminSettingService.setSetting(key, value);
  }
}
