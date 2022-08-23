import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'client' })
export class ClientEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'char', length: 255, nullable: false })
  name: string;

  @Column({ type: 'char', length: 255, nullable: false })
  account: string;

  @Column({ name: 'is_active', type: 'boolean', nullable: false })
  isActive: boolean;
}
