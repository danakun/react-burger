import React from 'react';
import styles from './bun-item.module.css';
import { ConstructorElement } from '@ya.praktikum/react-developer-burger-ui-components';
import { TConstructorIngredient } from '@/utils/types';

interface BunItemProps {
	bun: TConstructorIngredient;
	type: 'top' | 'bottom';
	isLocked?: boolean;
}

export const BunItem: React.FC<BunItemProps> = ({
	bun,
	type,
	isLocked,
}): React.JSX.Element => {
	const position = type === 'top' ? '(верх)' : '(низ)';

	return (
		<div className={`${styles.bun_item} ${styles[`bun_item_${type}`]} pl-8`}>
			<ConstructorElement
				type={type}
				isLocked={isLocked}
				text={`${bun.name} ${position}`}
				price={bun.price}
				thumbnail={bun.image}
			/>
		</div>
	);
};
