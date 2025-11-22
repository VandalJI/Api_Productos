export class ApiResponse<T = any> {
  constructor(
    public status: number,
    public message: string,
    public data: T | null = null,
  ) {}
}
