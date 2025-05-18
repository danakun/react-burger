import React from 'react';
import * as PropTypes from 'prop-types';
import styles from './filling-item.module.css';
import { ingredientPropType } from '@utils/prop-types.js';
import {
	DragIcon,
	ConstructorElement,
} from '@ya.praktikum/react-developer-burger-ui-components';

export const FillingItem = ({ filling, isDraggable }) => {
	return (
		<li className={styles.filling_item}>
			<div className={styles.drag_handle}>
				{isDraggable && <DragIcon type='primary' />}
			</div>
			<ConstructorElement
				text={filling.name}
				price={filling.price}
				thumbnail={filling.image}
			/>
		</li>
	);
};

FillingItem.propTypes = {
	filling: ingredientPropType.isRequired,
	isDraggable: PropTypes.bool,
};
