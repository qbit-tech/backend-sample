import { IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserAddressModel } from './userAddress.entity';

export type AppRequest = {
    user: {
        userType: 'admin' | 'customer' | string;
        userId: string;
        sessionId: string;
        name: string;
        role: string;
    };
};
export class SimpleResponse {
    @ApiProperty()
    isSuccess: boolean;
  }

  export class PaginationResponse {
    @ApiProperty()
    count: number;
    
    @ApiProperty()
    prev: string | null;
  
    @ApiProperty()
    next: string | null;
  
    @ApiProperty({example: []})
    results: any[];
  }

  export class DefaultFindAllRequest {
    @ApiPropertyOptional()
    search?: string;
  
    @ApiPropertyOptional()
    limit?: number;
  
    @ApiPropertyOptional()
    offset?: number;
  }
  
export abstract class AddressApiContract {
  abstract findAll(
    params: AddressFindAllRequest,
    userId: string
  ): Promise<AddressFindAllResponse>;
  abstract create(
    req: AppRequest,
    data: AddressCreateRequest,
    userId: string,
    files: any[],
  ): Promise<UserAddressModel>;
  abstract update(
    addressId: string,
    userId: string,
    data: AddressUpdateRequest,
    files: any[],
  ): Promise<UserAddressModel>;
  abstract delete(addressId: string, userId: string): Promise<SimpleResponse>;
}


export class AddressFindAllRequest extends DefaultFindAllRequest {
  @IsOptional()
  @ApiPropertyOptional()
  readonly userId?: string;
}

export class AddressFindAllResponse extends PaginationResponse {
  results: UserAddressModel[];
}

export class AddressCreateRequest {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  district: string;

  @ApiPropertyOptional()
  postalCode: string;

  @ApiPropertyOptional()
  addressNote: string;

  @ApiPropertyOptional({
    example: {
      latitude: '',
      longitude: '',
    },
  })
  geolocation?: any;

  @ApiPropertyOptional({ example: 'Wall Street 15, Somewhere' })
  addressDetail?: string;

  @ApiPropertyOptional({ example: false })
  isDefault: boolean;
}

export class AddressUpdateRequest {
  @ApiPropertyOptional()
  userId: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  district: string;

  @ApiPropertyOptional()
  postalCode: string;

  @ApiPropertyOptional()
  addressNote: string;

  @ApiPropertyOptional({
    example: {
      latitude: '',
      longitude: '',
    },
  })
  geolocation?: any;

  @ApiPropertyOptional({ example: 'Wall Street 15, Somewhere' })
  addressDetail?: string;

  @ApiPropertyOptional({ example: false })
  isDefault: boolean;
}