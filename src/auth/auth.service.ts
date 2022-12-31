import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as argon from "argon2";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";


@Injectable({})
export class AuthService{
    constructor(private prisma : PrismaService, private config: ConfigService, private jwt: JwtService){}
    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
           
        })
        // if user does not exist, throw exception
       
        if(!user){
            throw new ForbiddenException('Incrorrect credentials');
        }

        const pwMatches = await argon.verify(
            user.hash,
            dto.password
        )
        if(!pwMatches){
            throw new ForbiddenException('Incrorrect credentials');
        }
        delete user.hash;
        return  this.signToken(user.id, user.email);

    }

    async signup(dto:AuthDto){
        try{
            const hash = await argon.hash(dto.password);
            const user = await this.prisma.user.create({
                data:{
                    email: dto.email,
                    hash
                }
               
            });
            delete user.hash;
            return  user;

        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2002'){
                    throw new ForbiddenException('Credentials taken')
                }
                throw error;
            }

        }
      
    }

   async signToken(userId:number, email:string):Promise<{access_token:String}>{
        const payload  = {
            sub : userId,
            email
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret:secret
        });

        return {
            access_token: token
        };

    }
};