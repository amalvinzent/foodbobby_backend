import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { MenuModule } from './menu/menu.module'
import { OrdersModule } from './orders/orders.module'
import { AppController } from './app.controller'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI')
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    MenuModule,
    OrdersModule
  ],
  controllers: [AppController]
})
export class AppModule {}
