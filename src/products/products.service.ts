import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { ProductsMapper } from './products.mapper';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PatchProductDto } from './dto/patch-product.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { getPaginationParams } from './utils/pagination.util';
import { DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { ApiResponse } from '../common/api-response';

@Injectable()
export class ProductsService {
  constructor(
    private repo: ProductsRepository,
    private mapper: ProductsMapper,
    private dataSource: DataSource,
  ) {}

  async getAll(filters: FilterProductsDto) {
    const { page, limit, skip } = getPaginationParams(filters.page, filters.limit);
    const qb = this.repo.createQueryBuilder('p');

    if (filters.type) qb.andWhere('p.type = :type', { type: filters.type });
    if (filters.status !== undefined) qb.andWhere('p.status = :status', { status: filters.status === 'true' });
    if (filters.is_deleted !== undefined) qb.andWhere('p.is_deleted = :is_deleted', { is_deleted: filters.is_deleted === 'true' });
    if (filters.min_price) qb.andWhere('p.price >= :min', { min: Number(filters.min_price) });
    if (filters.max_price) qb.andWhere('p.price <= :max', { max: Number(filters.max_price) });
    if (filters.q) qb.andWhere('(p.name ILIKE :q OR p.description ILIKE :q)', { q: `%${filters.q}%` });

    const sortable = ['name', 'price', 'created_at', 'type', 'status'];
    if (filters.sort && sortable.includes(filters.sort)) {
      const order = filters.order === 'desc' ? 'DESC' : 'ASC';
      qb.orderBy(`p.${filters.sort}`, order as 'ASC' | 'DESC');
    }

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return this.mapper.toList(total, page, limit, items);
  }

  async getById(id: string) {
    const product = await this.repo.findOne({ where: { id, is_deleted: false } });
    if (!product) throw new NotFoundException(new ApiResponse(404, 'Producto no encontrado', null));
    return this.mapper.toItem(product);
  }

  async create(dto: CreateProductDto) {
    if (dto.product_key) {
      const exists = await this.repo.findOne({ where: { product_key: dto.product_key } });
      if (exists) throw new ConflictException(new ApiResponse(409, 'El product_key ya está registrado', null));
    }

    const product = new Product();
    product.type = dto.type;
    product.name = dto.name;
    product.price = dto.price.toFixed(2) as any;
    product.status = dto.status;
    product.description = dto.description;
    product.product_key = dto.product_key;
    product.image_link = dto.image_link;

    await this.repo.save(product);
    return new ApiResponse(201, 'Producto creado exitosamente', product);
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(new ApiResponse(404, 'Producto no encontrado', null));

    if (dto.product_key && dto.product_key !== product.product_key) {
      const exists = await this.repo.findOne({ where: { product_key: dto.product_key } });
      if (exists) throw new ConflictException(new ApiResponse(409, 'El product_key ya está registrado', null));
    }

    product.type = dto.type;
    product.name = dto.name;
    product.price = dto.price.toFixed(2) as any;
    product.status = dto.status;
    product.description = dto.description;
    product.product_key = dto.product_key;
    product.image_link = dto.image_link;
    product.modified_at = new Date();

    await this.repo.save(product);
    return new ApiResponse(200, 'Producto actualizado exitosamente', product);
  }

  async patch(id: string, dto: PatchProductDto) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(new ApiResponse(404, 'Producto no encontrado', null));

    if (dto.product_key && dto.product_key !== product.product_key) {
      const exists = await this.repo.findOne({ where: { product_key: dto.product_key } });
      if (exists) throw new ConflictException(new ApiResponse(409, 'El product_key ya está registrado', null));
    }

    if (dto.type !== undefined) product.type = dto.type;
    if (dto.name !== undefined) product.name = dto.name;
    if (dto.price !== undefined) product.price = dto.price.toFixed(2) as any;
    if (dto.status !== undefined) product.status = dto.status;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.product_key !== undefined) product.product_key = dto.product_key;
    if (dto.image_link !== undefined) product.image_link = dto.image_link;
    product.modified_at = new Date();

    await this.repo.save(product);
    return new ApiResponse(200, 'Producto actualizado exitosamente', product);
  }

  async delete(id: string) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(new ApiResponse(404, 'Producto no encontrado', null));
    if (product.is_deleted) throw new BadRequestException(new ApiResponse(400, 'El producto ya estaba marcado como eliminado', null));

    product.is_deleted = true;
    product.deleted_at = new Date();
    await this.repo.save(product);
    return new ApiResponse(200, 'Producto eliminado exitosamente', { id: product.id, is_deleted: true, deleted_at: product.deleted_at });
  }

  async restore(id: string) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(new ApiResponse(404, 'Producto no encontrado', null));
    if (!product.is_deleted) throw new BadRequestException(new ApiResponse(400, 'El producto no estaba marcado como eliminado', null));

    product.is_deleted = false;
    product.deleted_at = null;
    await this.repo.save(product);
    return new ApiResponse(200, 'Producto restaurado exitosamente', { id: product.id, is_deleted: false, deleted_at: null });
  }

  async updateImage(id: string, dto: UpdateImageDto) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(new ApiResponse(404, 'Producto no encontrado', null));
    product.image_link = dto.image_link;
    product.modified_at = new Date();
    await this.repo.save(product);
    return new ApiResponse(200, 'Imagen del producto actualizada exitosamente', { id: product.id, image_link: product.image_link, modified_at: product.modified_at });
  }

  async deactivate(id: string) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(new ApiResponse(404, 'Producto no encontrado', null));
    if (!product.status) throw new BadRequestException(new ApiResponse(400, 'El producto ya estaba desactivado', null));
    product.status = false;
    product.modified_at = new Date();
    await this.repo.save(product);
    return new ApiResponse(200, 'Producto desactivado exitosamente', { id: product.id, status: product.status, modified_at: product.modified_at });
  }

  async activate(id: string) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(new ApiResponse(404, 'Producto no encontrado', null));
    if (product.status) throw new BadRequestException(new ApiResponse(400, 'El producto ya estaba activado', null));
    product.status = true;
    product.modified_at = new Date();
    await this.repo.save(product);
    return new ApiResponse(200, 'Producto activado exitosamente', { id: product.id, status: product.status, modified_at: product.modified_at });
  }
}
