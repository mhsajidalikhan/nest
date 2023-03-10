import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JWTStrategy } from "./strategy";

@Module({
    imports: [JwtModule.register({}), PrismaModule],
    controllers:[AuthController],
    providers: [AuthService, JWTStrategy]
})
export class AuthModule{
}