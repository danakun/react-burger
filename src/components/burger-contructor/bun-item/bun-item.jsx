import React from 'react';
import styles from './bun-item.module.css';
import * as PropTypes from 'prop-types';
import { ingredientPropType } from '@utils/prop-types.js';
import { ConstructorElement } from '@ya.praktikum/react-developer-burger-ui-components';

export const BunItem = ({ bun, type, isLocked }) => {
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

BunItem.propTypes = {
	bun: ingredientPropType.isRequired,
	type: PropTypes.oneOf(['top', 'bottom']).isRequired,
	isLocked: PropTypes.bool,
};
