import dotenv from "dotenv";
import path from "path";

// .env.local 파일 로드
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
};
