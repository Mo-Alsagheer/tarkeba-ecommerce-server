import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { ProcessReturnDto } from './dto/process-return.dto';
import { QueryReturnsDto } from './dto/query-returns.dto';
import {
    API_OPERATIONS,
    API_PARAMS,
    API_RESPONSE_MESSAGES,
} from '../../../common/constants/api-descriptions';
import type { IAuthenticatedRequest } from '../../../common/interfaces';
import { JwtAuthGuard } from '../../identity/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../identity/auth/guards/roles.guard';
import { Roles } from '../../identity/auth/decorators/roles.decorator';
import { UserRole } from '../../../common/enums';

@ApiTags('Returns')
@Controller('returns')
export class ReturnsController {
    constructor(private readonly returnsService: ReturnsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.RETURNS.CREATE.SUMMARY })
    @ApiResponse({
        status: 201,
        description: API_RESPONSE_MESSAGES.RETURNS.CREATED,
    })
    @ApiResponse({
        status: 400,
        description: API_RESPONSE_MESSAGES.ERROR.BAD_REQUEST,
    })
    @ApiResponse({ status: 401, description: API_RESPONSE_MESSAGES.ERROR.UNAUTHORIZED })
    create(@Body() createReturnDto: CreateReturnDto, @Request() req: IAuthenticatedRequest) {
        return this.returnsService.create(createReturnDto, req.user.sub);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.RETURNS.FIND_ALL.SUMMARY })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.RETURNS.RETRIEVED,
    })
    @ApiResponse({ status: 401, description: API_RESPONSE_MESSAGES.ERROR.UNAUTHORIZED })
    @ApiResponse({ status: 403, description: API_RESPONSE_MESSAGES.ERROR.FORBIDDEN })
    findAll(@Query() queryDto: QueryReturnsDto) {
        return this.returnsService.findAll(queryDto);
    }

    @Get('my-returns')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.RETURNS.GET_USER_RETURNS.SUMMARY })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.RETURNS.USER_RETURNS_RETRIEVED,
    })
    @ApiResponse({ status: 401, description: API_RESPONSE_MESSAGES.ERROR.UNAUTHORIZED })
    getMyReturns(@Query() queryDto: QueryReturnsDto, @Request() req: IAuthenticatedRequest) {
        return this.returnsService.getUserReturns(req.user.sub, queryDto);
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.RETURNS.GET_STATS.SUMMARY })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.RETURNS.STATS_RETRIEVED,
    })
    @ApiResponse({ status: 401, description: API_RESPONSE_MESSAGES.ERROR.UNAUTHORIZED })
    @ApiResponse({ status: 403, description: API_RESPONSE_MESSAGES.ERROR.FORBIDDEN })
    getStats() {
        return this.returnsService.getReturnStats();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.RETURNS.FIND_ONE.SUMMARY })
    @ApiParam({ name: 'id', description: API_PARAMS.RETURN_ID })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.SUCCESS.RETRIEVED,
    })
    @ApiResponse({ status: 401, description: API_RESPONSE_MESSAGES.ERROR.UNAUTHORIZED })
    @ApiResponse({ status: 404, description: API_RESPONSE_MESSAGES.ERROR.NOT_FOUND })
    findOne(@Param('id') id: string) {
        return this.returnsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.RETURNS.UPDATE.SUMMARY })
    @ApiParam({ name: 'id', description: API_PARAMS.RETURN_ID })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.RETURNS.UPDATED,
    })
    @ApiResponse({ status: 401, description: API_RESPONSE_MESSAGES.ERROR.UNAUTHORIZED })
    @ApiResponse({ status: 403, description: API_RESPONSE_MESSAGES.ERROR.FORBIDDEN })
    @ApiResponse({ status: 404, description: API_RESPONSE_MESSAGES.ERROR.NOT_FOUND })
    update(
        @Param('id') id: string,
        @Body() updateReturnDto: UpdateReturnDto,
        @Request() req: IAuthenticatedRequest
    ) {
        return this.returnsService.update(id, updateReturnDto, req.user.sub);
    }

    @Patch(':id/process')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.RETURNS.PROCESS.SUMMARY })
    @ApiParam({ name: 'id', description: API_PARAMS.RETURN_ID })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.RETURNS.PROCESSED,
    })
    @ApiResponse({ status: 401, description: API_RESPONSE_MESSAGES.ERROR.UNAUTHORIZED })
    @ApiResponse({ status: 403, description: API_RESPONSE_MESSAGES.ERROR.FORBIDDEN })
    @ApiResponse({ status: 404, description: API_RESPONSE_MESSAGES.ERROR.NOT_FOUND })
    process(
        @Param('id') id: string,
        @Body() processReturnDto: ProcessReturnDto,
        @Request() req: IAuthenticatedRequest
    ) {
        return this.returnsService.process(id, processReturnDto, req.user.sub);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: API_OPERATIONS.RETURNS.DELETE.SUMMARY })
    @ApiParam({ name: 'id', description: API_PARAMS.RETURN_ID })
    @ApiResponse({
        status: 200,
        description: API_RESPONSE_MESSAGES.RETURNS.DELETED,
    })
    @ApiResponse({ status: 401, description: API_RESPONSE_MESSAGES.ERROR.UNAUTHORIZED })
    @ApiResponse({ status: 403, description: API_RESPONSE_MESSAGES.ERROR.FORBIDDEN })
    @ApiResponse({ status: 404, description: API_RESPONSE_MESSAGES.ERROR.NOT_FOUND })
    remove(@Param('id') id: string, @Request() req: IAuthenticatedRequest) {
        return this.returnsService.remove(id, req.user.sub);
    }
}
