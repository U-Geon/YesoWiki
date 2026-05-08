import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // DIRECT_URL은 db push/migrate 시에만 필요합니다.
  // prisma generate(postinstall)에서는 DB 연결이 필요없으므로 없어도 정상 동작합니다.
  ...(process.env.DIRECT_URL && {
    datasource: {
      url: process.env.DIRECT_URL,
    },
  }),
})
