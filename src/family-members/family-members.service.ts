import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyMemberStatus } from '../common/enums/family-member-status.enum';
import { FamiliesService } from '../families/families.service';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';
import { UpdateFamilyMemberDto } from './dto/update-family-member.dto';
import { FamilyMember } from './entities/family-member.entity';

@Injectable()
export class FamilyMembersService {
    constructor(
        @InjectRepository(FamilyMember)
        private readonly familyMembersRepository: Repository<FamilyMember>,
        private readonly familiesService: FamiliesService,
    ) {}

    async create(
        createFamilyMemberDto: CreateFamilyMemberDto,
    ): Promise<FamilyMember> {
        await this.familiesService.ensureExists(createFamilyMemberDto.familyId);
        await this.ensureIdentityUserIsAvailableInFamily(
            createFamilyMemberDto.familyId,
            createFamilyMemberDto.identityUserId,
        );

        const familyMember = this.familyMembersRepository.create({
            ...createFamilyMemberDto,
            status: createFamilyMemberDto.status ?? FamilyMemberStatus.ACTIVE,
        });

        return this.familyMembersRepository.save(familyMember);
    }

    findAll(): Promise<FamilyMember[]> {
        return this.familyMembersRepository.find({
            relations: { family: true },
            order: { displayName: 'ASC' },
        });
    }

    async findOne(id: string): Promise<FamilyMember> {
        const familyMember = await this.familyMembersRepository.findOne({
            where: { id },
            relations: { family: true },
        });

        if (!familyMember) {
            throw new NotFoundException(
                `Family member with id ${id} was not found`,
            );
        }

        return familyMember;
    }

    async findByIdentityUserId(identityUserId: string): Promise<FamilyMember[]> {
        return this.familyMembersRepository.find({
            where: { identityUserId, status: FamilyMemberStatus.ACTIVE },
            relations: { family: true },
            order: { displayName: 'ASC' },
        });
    }

    async update(
        id: string,
        updateFamilyMemberDto: UpdateFamilyMemberDto,
    ): Promise<FamilyMember> {
        const familyMember = await this.findOne(id);
        const nextFamilyId = updateFamilyMemberDto.familyId ?? familyMember.familyId;
        const nextIdentityUserId =
            updateFamilyMemberDto.identityUserId ?? familyMember.identityUserId;

        if (updateFamilyMemberDto.familyId) {
            await this.familiesService.ensureExists(updateFamilyMemberDto.familyId);
        }

        if (
            nextFamilyId !== familyMember.familyId ||
            nextIdentityUserId !== familyMember.identityUserId
        ) {
            await this.ensureIdentityUserIsAvailableInFamily(
                nextFamilyId,
                nextIdentityUserId,
                id,
            );
        }

        Object.assign(familyMember, updateFamilyMemberDto);

        return this.familyMembersRepository.save(familyMember);
    }

    async remove(id: string): Promise<FamilyMember> {
        const familyMember = await this.findOne(id);
        familyMember.status = FamilyMemberStatus.INACTIVE;

        return this.familyMembersRepository.save(familyMember);
    }

    async ensureActiveInFamily(id: string, familyId: string): Promise<void> {
        const exists = await this.familyMembersRepository.exists({
            where: { id, familyId, status: FamilyMemberStatus.ACTIVE },
        });

        if (!exists) {
            throw new NotFoundException(
                `Family member with id ${id} was not found in family ${familyId}`,
            );
        }
    }

    private async ensureIdentityUserIsAvailableInFamily(
        familyId: string,
        identityUserId: string,
        currentFamilyMemberId?: string,
    ): Promise<void> {
        const existingFamilyMember = await this.familyMembersRepository.findOne({
            where: { familyId, identityUserId },
        });

        if (
            existingFamilyMember &&
            existingFamilyMember.id !== currentFamilyMemberId
        ) {
            throw new ConflictException(
                `Identity user ${identityUserId} already belongs to family ${familyId}`,
            );
        }
    }
}
