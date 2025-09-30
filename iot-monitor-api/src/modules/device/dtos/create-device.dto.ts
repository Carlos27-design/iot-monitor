import { IsString, IsUUID } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  name: string;

  @IsString()
  serialNumber: string;

  @IsString()
  status: string;
}
