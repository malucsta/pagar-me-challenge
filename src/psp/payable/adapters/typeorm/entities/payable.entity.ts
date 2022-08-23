import { ClientEntity } from '../../../../client/adapters/typeorm/entities/client.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { TransactionEntity } from '../../../../transaction/adapters/typeorm/entities/transaction.entity';

@Entity({ name: 'payable' })
export class PayableEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'float', nullable: false })
  value: number;

  @Column({ type: 'date', nullable: false })
  paymentDate: string;

  @Column({ type: 'int', nullable: false })
  status: number;

  @ManyToOne(() => ClientEntity, {
    nullable: false,
  })
  @JoinColumn([{ name: 'fk_client_id', referencedColumnName: 'id' }])
  client: string;

  @OneToOne(() => TransactionEntity, {
    nullable: false,
  })
  @JoinColumn([{ name: 'fk_transaction_id', referencedColumnName: 'id' }])
  transaction: string;
}
