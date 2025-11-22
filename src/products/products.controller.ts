import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PatchProductDto } from './dto/patch-product.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FilterProductsDto } from './dto/filter-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private svc: ProductsService) {}

  @Get()
  async getAll(@Query() filters: FilterProductsDto) {
    return this.svc.getAll(filters);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.svc.getById(id);
  }

  @Post()
  async create(@Body() dto: CreateProductDto) {
    return this.svc.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.svc.update(id, dto);
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: PatchProductDto) {
    return this.svc.patch(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    return this.svc.delete(id);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string) {
    return this.svc.restore(id);
  }

  @Patch(':id/update-image')
  async updateImage(@Param('id') id: string, @Body() dto: UpdateImageDto) {
    return this.svc.updateImage(id, dto);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    return this.svc.deactivate(id);
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    return this.svc.activate(id);
  }

  @Get('search')
  async search(@Query() filters: FilterProductsDto) {
    return this.svc.getAll(filters);
  }
}

