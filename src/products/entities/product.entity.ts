import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 10 })
  type: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'numeric', precision: 8, scale: 2 })
  price: string;

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 8, nullable: true, unique: true })
  product_key?: string;

  @Column({ length: 200, nullable: true })
  image_link?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  modified_at: Date;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at?: Date | null;
}
