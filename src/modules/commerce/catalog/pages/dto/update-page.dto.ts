import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePageDto } from './create-page.dto';

// Exclude slug from updates
export class UpdatePageDto extends PartialType(
    OmitType(CreatePageDto, ['slug'] as const),
) {}
