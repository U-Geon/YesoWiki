import 'dotenv/config'
import { defineConfig, env } from '@prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Prisma CLI(db push, migrate)는 반드시 5432 포트인 DIRECT_URL을 사용해야 합니다.
    url: env('DIRECT_URL'),
  }
})
