import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateReturnDto } from './create-return.dto';

export class UpdateReturnDto extends PartialType(
    OmitType(CreateReturnDto, ['orderID', 'productID'] as const)
) {}
