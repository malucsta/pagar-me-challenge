import { ClientData } from '../../domain/client-data';
import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateClientDTO implements Omit<ClientData, 'id'> {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  account: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}

export class UpdateClientDTO implements Omit<ClientData, 'id'> {
  @IsString()
  name: string;

  @IsString()
  account: string;

  @IsBoolean()
  isActive: boolean;
}
