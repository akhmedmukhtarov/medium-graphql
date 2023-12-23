
export class OffsetPagination{
  page: number
  offset: number
  totalPages: number
  limit: number
  constructor(page=1, limit=10, totalItems: number){
    this.page = page
    this.limit = limit
    this.offset = (page - 1) * limit
    this.totalPages = Math.ceil(totalItems / this.page) || 0
  }
}