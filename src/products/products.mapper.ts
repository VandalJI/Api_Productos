import { Injectable } from '@nestjs/common';
import { ApiResponse } from '../common/api-response';  // prueba 1
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsMapper {
  toItem(product: Product) {
    return new ApiResponse(200, 'Producto obtenido.', product);
  }

  toList(total: number, page: number, limit: number, products: Product[]) {
    return new ApiResponse(200, 'Productos obtenidos exitosamente.', {
      total,
      page,
      limit,
      products,
    });
  }
}
