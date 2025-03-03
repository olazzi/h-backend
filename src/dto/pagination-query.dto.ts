import { IsOptional, IsNumberString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({ example: '1', description: 'Page number for pagination' })
  page?: string;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional({ example: '10', description: 'Number of posts per page' })
  limit?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: '74e1ef38-1175-4cf9-bd77-7c6680ad3de9', description: 'Filter posts by author ID' })
  authorId?: string;
}
