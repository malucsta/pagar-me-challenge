import { ClientEntity } from '../../../../client/external/typeorm/entities/client.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'transaction' })
export class TransactionEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'char', length: 512, nullable: false })
  description: string;

  @Column({
    name: 'payment_method',
    type: 'int',
    nullable: false,
  })
  paymentMethod: number;

  @Column({ type: 'float', nullable: false })
  value: number;

  @Column({ name: 'card_number', type: 'char', length: 4, nullable: false })
  cardNumber: string;

  @Column({ name: 'card_owner', type: 'char', length: 255, nullable: false })
  cardOwner: string;

  @Column({
    name: 'card_expiration_date',
    type: 'char',
    length: 7,
    nullable: false,
  })
  cardExpirationDate: string;

  @Column({ name: 'card_cvv', type: 'char', length: 3, nullable: false })
  cardCvv: string;

  @ManyToOne(() => ClientEntity, {
    nullable: false,
  })
  @JoinColumn([{ name: 'fk_client_id', referencedColumnName: 'id' }])
  client: ClientEntity;
}
