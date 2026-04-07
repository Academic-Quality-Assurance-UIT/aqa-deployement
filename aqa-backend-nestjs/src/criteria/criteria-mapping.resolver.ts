import { Args, Mutation, Query, Resolver, ID } from '@nestjs/graphql';
import { CriteriaMapping } from './entities/criteria-mapping.entity';
import { CriteriaMappingService } from './criteria-mapping.service';
import { AutoMappingSuggestion } from './dto/auto-mapping-suggestion.dto';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
class AutoMappingSuggestionInput {
  @Field()
  display_name: string;

  @Field(() => [ID])
  criteriaIds: string[];

  @Field(() => [ID])
  staffSurveyCriteriaIds: string[];
}

@Resolver(() => CriteriaMapping)
export class CriteriaMappingResolver {
  constructor(private readonly mappingService: CriteriaMappingService) {}

  @Query(() => [CriteriaMapping], { name: 'getCriteriaMappings' })
  async findAll() {
    return this.mappingService.findAll();
  }

  @Query(() => CriteriaMapping, { name: 'getCriteriaMapping' })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.mappingService.findOne(id);
  }

  @Query(() => [AutoMappingSuggestion], { name: 'getAutoMappingSuggestions' })
  async getAutoMappingSuggestions() {
    return this.mappingService.getAutoMappingSuggestions();
  }

  @Mutation(() => CriteriaMapping)
  async createCriteriaMapping(@Args('display_name') display_name: string) {
    return this.mappingService.create(display_name);
  }

  @Mutation(() => CriteriaMapping)
  async updateCriteriaMapping(
    @Args('id', { type: () => ID }) id: string,
    @Args('display_name') display_name: string,
  ) {
    return this.mappingService.update(id, display_name);
  }

  @Mutation(() => Boolean)
  async deleteCriteriaMapping(@Args('id', { type: () => ID }) id: string) {
    return this.mappingService.delete(id);
  }

  @Mutation(() => CriteriaMapping)
  async mapCriteriaToGroup(
    @Args('mappingId', { type: () => ID }) mappingId: string,
    @Args('criteriaIds', { type: () => [ID] }) criteriaIds: string[],
    @Args('type') type: 'regular' | 'staff_survey',
  ) {
    return this.mappingService.mapCriteria(mappingId, criteriaIds, type);
  }

  @Mutation(() => Boolean)
  async unmapCriteria(
    @Args('criteriaIds', { type: () => [ID] }) criteriaIds: string[],
    @Args('type') type: 'regular' | 'staff_survey',
  ) {
    return this.mappingService.unmapCriteria(criteriaIds, type);
  }

  @Mutation(() => Boolean)
  async confirmAutoMapping(
    @Args('suggestions', { type: () => [AutoMappingSuggestionInput] })
    suggestions: AutoMappingSuggestionInput[],
  ) {
    // Convert input to suggestions
    return this.mappingService.confirmAutoMapping(suggestions as any);
  }
}
