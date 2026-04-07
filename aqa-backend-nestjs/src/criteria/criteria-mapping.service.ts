import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CriteriaMapping } from './entities/criteria-mapping.entity';
import { Criteria } from './entities/criteria.entity';
import { StaffSurveyCriteria } from '../staff-survey/entities/staff-survey-criteria.entity';
import { AutoMappingSuggestion } from './dto/auto-mapping-suggestion.dto';

@Injectable()
export class CriteriaMappingService {
  constructor(
    @InjectRepository(CriteriaMapping)
    private mappingRepo: Repository<CriteriaMapping>,
    @InjectRepository(Criteria)
    private criteriaRepo: Repository<Criteria>,
    @InjectRepository(StaffSurveyCriteria)
    private staffSurveyCriteriaRepo: Repository<StaffSurveyCriteria>,
  ) {}

  async findAll() {
    return await this.mappingRepo.find({
      relations: ['criteria', 'staffSurveyCriteria'],
    });
  }

  async findOne(id: string) {
    return await this.mappingRepo.findOne({
      where: { id },
      relations: ['criteria', 'staffSurveyCriteria'],
    });
  }

  async create(display_name: string) {
    const mapping = this.mappingRepo.create({ display_name });
    return await this.mappingRepo.save(mapping);
  }

  async update(id: string, display_name: string) {
    await this.mappingRepo.update(id, { display_name });
    return this.findOne(id);
  }

  async delete(id: string) {
    const mapping = await this.findOne(id);
    if (mapping) {
      // Clear mapping_id for related criteria
      await this.criteriaRepo.update({ mapping_id: id }, { mapping_id: null });
      await this.staffSurveyCriteriaRepo.update(
        { mapping_id: id },
        { mapping_id: null },
      );
      await this.mappingRepo.remove(mapping);
      return true;
    }
    return false;
  }

  async mapCriteria(
    mappingId: string,
    criteriaIds: string[],
    type: 'regular' | 'staff_survey',
  ) {
    if (type === 'regular') {
      await this.criteriaRepo.update(
        { criteria_id: In(criteriaIds) },
        { mapping_id: mappingId },
      );
    } else {
      await this.staffSurveyCriteriaRepo.update(
        { staff_survey_criteria_id: In(criteriaIds) },
        { mapping_id: mappingId },
      );
    }
    await this.updateRawDisplayNames(mappingId);
    return this.findOne(mappingId);
  }

  async unmapCriteria(criteriaIds: string[], type: 'regular' | 'staff_survey') {
    // We need to update raw_display_names for the mappings these criteria belonged to
    const criteria =
      type === 'regular'
        ? await this.criteriaRepo.find({
            where: { criteria_id: In(criteriaIds) },
            relations: ['mapping'],
          })
        : await this.staffSurveyCriteriaRepo.find({
            where: { staff_survey_criteria_id: In(criteriaIds) },
            relations: ['mapping'],
          });

    // @ts-ignore
    const affectedMappingIds = [
      ...new Set(criteria.map((c) => c.mapping_id).filter((id) => !!id)),
    ];

    if (type === 'regular') {
      await this.criteriaRepo.update(
        { criteria_id: In(criteriaIds) },
        { mapping_id: null },
      );
    } else {
      await this.staffSurveyCriteriaRepo.update(
        { staff_survey_criteria_id: In(criteriaIds) },
        { mapping_id: null },
      );
    }

    for (const mappingId of affectedMappingIds) {
      await this.updateRawDisplayNames(mappingId as string);
    }

    return true;
  }

  async getAutoMappingSuggestions(): Promise<AutoMappingSuggestion[]> {
    // 1. Get all unmapped criteria
    const unmappedRegular = await this.criteriaRepo.find({
      where: { mapping_id: null },
    });
    const unmappedStaff = await this.staffSurveyCriteriaRepo.find({
      where: { mapping_id: null },
    });

    const suggestionsMap = new Map<string, AutoMappingSuggestion>();

    // Helper to add or create suggestion
    const process = (
      name: string,
      id: string,
      type: 'regular' | 'staff',
      semester?: string | string[],
    ) => {
      const trimmedName = name.trim();
      if (!suggestionsMap.has(trimmedName)) {
        suggestionsMap.set(trimmedName, {
          display_name: trimmedName,
          criteriaIds: [],
          staffSurveyCriteriaIds: [],
          semesters: [],
        });
      }
      const suggestion = suggestionsMap.get(trimmedName);
      if (type === 'regular') {
        suggestion.criteriaIds.push(id);
        if (semester && !suggestion.semesters.includes(semester as string)) {
          suggestion.semesters.push(semester as string);
        }
      } else {
        suggestion.staffSurveyCriteriaIds.push(id);
        if (semester) {
          const sems = Array.isArray(semester) ? semester : [semester];
          sems.forEach((s) => {
            if (!suggestion.semesters.includes(s)) suggestion.semesters.push(s);
          });
        }
      }
    };

    unmappedRegular.forEach((c) =>
      process(c.display_name, c.criteria_id, 'regular', c.semester_id),
    );
    unmappedStaff.forEach((c) =>
      process(c.display_name, c.staff_survey_criteria_id, 'staff', c.semesters),
    );

    // Only return suggestions with more than 1 criteria or mixed sources
    return Array.from(suggestionsMap.values()).filter(
      (s) => s.criteriaIds.length + s.staffSurveyCriteriaIds.length > 1,
    );
  }

  async confirmAutoMapping(suggestions: AutoMappingSuggestion[]) {
    for (const suggestion of suggestions) {
      // 1. Look for existing mapping with the same name
      let mapping = await this.mappingRepo.findOne({
        where: { display_name: suggestion.display_name },
      });

      // 2. Create if not exists
      if (!mapping) {
        mapping = await this.create(suggestion.display_name);
      }

      // 3. Map criteria
      if (suggestion.criteriaIds.length > 0) {
        await this.mapCriteria(mapping.id, suggestion.criteriaIds, 'regular');
      }
      if (suggestion.staffSurveyCriteriaIds.length > 0) {
        await this.mapCriteria(
          mapping.id,
          suggestion.staffSurveyCriteriaIds,
          'staff_survey',
        );
      }
    }
    return true;
  }

  private async updateRawDisplayNames(mappingId: string) {
    const mapping = await this.mappingRepo.findOne({
      where: { id: mappingId },
      relations: ['criteria', 'staffSurveyCriteria'],
    });

    if (!mapping) return;

    const names = new Set<string>();
    // Always include the current display name
    if (mapping.display_name) names.add(mapping.display_name);

    mapping.criteria?.forEach((c) => names.add(c.display_name));
    mapping.staffSurveyCriteria?.forEach((c) => names.add(c.display_name));

    await this.mappingRepo.update(mappingId, {
      raw_display_names: Array.from(names),
    });
  }
}
