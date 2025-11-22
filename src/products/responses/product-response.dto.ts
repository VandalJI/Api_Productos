import { ApiResponse } from '../../common/api-response';

export function okResponse(data: any, message = 'OK') {
  return new ApiResponse(200, message, data);
}
