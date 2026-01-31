import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from '../../../identity/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../identity/auth/guards/roles.guard';
import { Roles } from '../../../identity/auth/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
    private readonly logger = new Logger(PagesController.name);

    constructor(private readonly pagesService: PagesService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new page (Admin only)' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Page created successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data or duplicate slug',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Forbidden - Admin access required',
    })
    create(@Body() createPageDto: CreatePageDto) {
        this.logger.log(`Creating page with slug: ${createPageDto.slug}`);
        return this.pagesService.create(createPageDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all pages (Admin only)' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Pages retrieved successfully',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Forbidden - Admin access required',
    })
    findAll() {
        this.logger.log('Fetching all pages');
        return this.pagesService.findAll();
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get page by slug (Public for published pages)' })
    @ApiParam({
        name: 'slug',
        description: 'Page slug (e.g., about-us)',
        example: 'about-us',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Page retrieved successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Page not found or not published',
    })
    findOne(@Param('slug') slug: string, @Request() req: any) {
        // Check if user is admin
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const isAdmin = req.user?.role === UserRole.ADMIN || false;
        this.logger.log(`Fetching page with slug: ${slug}, isAdmin: ${isAdmin}`);
        return this.pagesService.findBySlug(slug, isAdmin);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a page (Admin only)' })
    @ApiParam({
        name: 'id',
        description: 'Page ID',
        example: '507f1f77bcf86cd799439011',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Page updated successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Forbidden - Admin access required',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Page not found',
    })
    update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
        this.logger.log(`Updating page with id: ${id}`);
        return this.pagesService.update(id, updatePageDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a page (Admin only)' })
    @ApiParam({
        name: 'id',
        description: 'Page ID',
        example: '507f1f77bcf86cd799439011',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Page deleted successfully',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Forbidden - Admin access required',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Page not found',
    })
    remove(@Param('id') id: string) {
        this.logger.log(`Deleting page with id: ${id}`);
        return this.pagesService.remove(id);
    }
}
