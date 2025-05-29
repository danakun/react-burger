import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './burger-constructor.module.css';
import { useDrop } from 'react-dnd';
import {
	CurrencyIcon,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { BunItem } from './bun-item/bun-item';
import { FillingItem } from './filling-item/filling-item';
import { Modal } from '../modal/modal';
import { OrderDetails } from './order-details/order-details';
import { createOrder, clearOrder } from '../../services/orderSlice';
import {
	addIngredient,
	moveIngredient,
	clearConstructor,
} from '../../services/constructorSlice';
import { DND_TYPES } from '../../utils/constants';

export const BurgerConstructor = () => {
	const dispatch = useDispatch();

	// Get constructor ingredients from Redux state
	const { bun, ingredients: fillings } = useSelector(
		(state) => state.burgerConstructor
	);

	// Get order state from Redux
	const {
		order,
		isLoading: isOrderLoading,
		hasError: hasOrderError,
		error: orderError,
	} = useSelector((state) => state.order);

	// Handle dropping ingredients from BurgerIngredients
	const [{ canDrop, isOver, draggedItemType }, dropRef] = useDrop({
		accept: DND_TYPES.INGREDIENT,
		drop: (draggedItem) => {
			// More explicit destructuring and validation
			const { ingredient } = draggedItem;
			if (ingredient) {
				dispatch(addIngredient(ingredient));
			}
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
			// Get the dragged item to check its type
			draggedItemType: monitor.getItem()?.ingredient?.type,
		}),
	});

	// Handle moving ingredients within constructor
	const moveCard = useCallback(
		(dragIndex, hoverIndex) => {
			// Add validation to prevent invalid moves
			if (dragIndex >= 0 && hoverIndex >= 0 && dragIndex !== hoverIndex) {
				dispatch(moveIngredient({ dragIndex, hoverIndex }));
			}
		},
		[dispatch]
	);

	// Calculate total price from constructor ingredients
	const totalPrice = useMemo(() => {
		let price = 0;

		// Add bun price (x2 for top and bottom)
		if (bun?.price) {
			price += bun.price * 2;
		}

		// Add fillings price with null safety
		fillings.forEach((item) => {
			if (item?.price) {
				price += item.price;
			}
		});

		return price;
	}, [bun, fillings]);

	// Check if we can place order - memoized for performance
	const canPlaceOrder = useMemo(() => {
		return bun && fillings.length > 0 && !isOrderLoading;
	}, [bun, fillings.length, isOrderLoading]);

	// Handle order creation with better error handling
	const handleOrderClick = useCallback(async () => {
		// Early return if order can't be placed
		if (!canPlaceOrder) return;

		try {
			// Prepare ingredient IDs for API call
			const ingredientIds = [
				bun._id, // Top bun
				...fillings.map((item) => item._id), // All fillings
				bun._id, // Bottom bun
			];

			// Dispatch createOrder thunk and wait for result
			const resultAction = await dispatch(createOrder(ingredientIds));

			// If order was successful, clear constructor
			if (createOrder.fulfilled.match(resultAction)) {
				dispatch(clearConstructor());
			}
		} catch (error) {
			console.error('Failed to create order:', error);
		}
	}, [dispatch, bun, fillings, canPlaceOrder]);

	// Handle modal close
	const handleCloseModal = useCallback(() => {
		dispatch(clearOrder());
	}, [dispatch]);

	// Determine if drop indicator should be active for specific zones
	const showBunDropIndicator = isOver && canDrop && draggedItemType === 'bun';
	const showFillingDropIndicator =
		isOver && canDrop && draggedItemType !== 'bun' && draggedItemType;

	// Generate dynamic classes for drop zones
	const getBunSlotClass = useCallback(
		(baseClass, additionalClasses = '') => {
			return `${baseClass} ${additionalClasses} ${showBunDropIndicator ? styles.drop_indicator : ''}`.trim();
		},
		[showBunDropIndicator]
	);

	const getFillingSlotClass = useCallback(
		(baseClass, additionalClasses = '') => {
			return `${baseClass} ${additionalClasses} ${showFillingDropIndicator ? styles.drop_indicator : ''}`.trim();
		},
		[showFillingDropIndicator]
	);

	// Dynamic text for drop zones
	const getBunDropZoneText = useCallback(
		(defaultText, dropText) => {
			return showBunDropIndicator ? dropText : defaultText;
		},
		[showBunDropIndicator]
	);

	const getFillingDropZoneText = useCallback(
		(defaultText, dropText) => {
			return showFillingDropIndicator ? dropText : defaultText;
		},
		[showFillingDropIndicator]
	);

	return (
		<section className={styles.burger_constructor}>
			<div ref={dropRef} className={styles.burger_components}>
				{/* Top Bun */}
				{bun ? (
					<BunItem bun={bun} type='top' isLocked={true} />
				) : (
					<div
						className={getBunSlotClass(styles.empty_bun, styles.empty_bun_top)}>
						<p className='text text_type_main-default text_color_inactive'>
							{getBunDropZoneText(
								'Перетащите булку сюда',
								'Отпустите, чтобы добавить булку'
							)}
						</p>
					</div>
				)}

				{/* Fillings */}
				<ul className={`${styles.fillings_list} custom-scroll`}>
					{fillings.length > 0 ? (
						fillings.map((item, index) => (
							<FillingItem
								key={item.ingredientId}
								filling={item}
								index={index}
								moveCard={moveCard}
								isDraggable={true}
							/>
						))
					) : (
						<div className={getFillingSlotClass(styles.empty_fillings, 'pl-8')}>
							<p className='text text_type_main-default text_color_inactive'>
								{getFillingDropZoneText(
									'Перетащите ингредиенты сюда',
									'Отпустите, чтобы добавить ингредиент'
								)}
							</p>
						</div>
					)}
				</ul>

				{/* Bottom Bun */}
				{bun ? (
					<BunItem bun={bun} type='bottom' isLocked={true} />
				) : (
					<div
						className={getBunSlotClass(
							styles.empty_bun,
							`${styles.empty_bun_bottom} pl-8`
						)}>
						<p className='text text_type_main-default text_color_inactive'>
							{getBunDropZoneText(
								'Перетащите булку сюда',
								'Отпустите, чтобы добавить булку'
							)}
						</p>
					</div>
				)}
			</div>

			<div className={`${styles.order_details} mt-10`}>
				<div className={styles.total_price}>
					<span className='text text_type_digits-medium'>{totalPrice}</span>
					<CurrencyIcon type='primary' />
				</div>

				<Button
					type='primary'
					size='large'
					htmlType='button'
					onClick={handleOrderClick}
					disabled={!canPlaceOrder}>
					{isOrderLoading ? 'Оформляем...' : 'Оформить заказ'}
				</Button>

				{/* Show error message if order failed */}
				{hasOrderError && orderError && (
					<p className='text text_type_main-default text_color_error mt-2'>
						Ошибка при создании заказа: {orderError}
					</p>
				)}
			</div>

			{/* Order Modal */}
			{order && (
				<Modal onClose={handleCloseModal}>
					<OrderDetails
						orderNumber={order.order?.number || order.number}
						isLoading={isOrderLoading}
						hasError={hasOrderError}
					/>
				</Modal>
			)}
		</section>
	);
};
// import React, { useMemo, useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import styles from './burger-constructor.module.css';
// import { useDrop } from 'react-dnd';
// import {
// 	CurrencyIcon,
// 	Button,
// } from '@ya.praktikum/react-developer-burger-ui-components';
// import { BunItem } from './bun-item/bun-item';
// import { FillingItem } from './filling-item/filling-item';
// import { Modal } from '../modal/modal';
// import { OrderDetails } from './order-details/order-details';
// import { createOrder, clearOrder } from '../../services/orderSlice';
// import { addIngredient, moveIngredient } from '../../services/constructorSlice';
// import { DND_TYPES } from '../../utils/constants';

// export const BurgerConstructor = () => {
// 	const dispatch = useDispatch();

// 	// Get constructor ingredients from Redux state
// 	const { bun, ingredients: fillings } = useSelector(
// 		(state) => state.burgerConstructor
// 	);

// 	// Get order state from Redux
// 	const {
// 		order,
// 		isLoading: isOrderLoading,
// 		hasError: hasOrderError,
// 	} = useSelector((state) => state.order);

// 	// Handle dropping ingredients from BurgerIngredients
// 	const [{ canDrop, isOver }, dropRef] = useDrop({
// 		accept: DND_TYPES.INGREDIENT,
// 		drop: (item) => {
// 			dispatch(addIngredient(item.ingredient));
// 		},
// 		collect: (monitor) => ({
// 			isOver: monitor.isOver(),
// 			canDrop: monitor.canDrop(),
// 		}),
// 	});

// 	// Handle moving ingredients within constructor
// 	const moveCard = useCallback(
// 		(dragIndex, hoverIndex) => {
// 			dispatch(moveIngredient({ dragIndex, hoverIndex }));
// 		},
// 		[dispatch]
// 	);

// 	// Calculate total price from constructor ingredients
// 	const totalPrice = useMemo(() => {
// 		let price = 0;

// 		// Add bun price (x2 for top and bottom)
// 		if (bun) {
// 			price += bun.price * 2;
// 		}

// 		// Add fillings price
// 		fillings.forEach((item) => {
// 			price += item.price;
// 		});

// 		return price;
// 	}, [bun, fillings]);

// 	const handleOrderClick = async () => {
// 		if (!bun || fillings.length === 0) return;

// 		// Prepare ingredient IDs for API call
// 		const ingredientIds = [
// 			bun._id, // Top bun
// 			...fillings.map((item) => item._id), // All fillings
// 			bun._id, // Bottom bun
// 		];

// 		// Dispatch createOrder thunk
// 		dispatch(createOrder(ingredientIds));
// 	};

// 	const handleCloseModal = () => {
// 		dispatch(clearOrder());
// 	};

// 	// Check if we can place order
// 	const canPlaceOrder = bun && fillings.length > 0 && !isOrderLoading;

// 	return (
// 		<section className={styles.burger_constructor}>
// 			<div ref={dropRef} className={styles.burger_components}>
// 				{/* Top Bun */}
// 				{bun ? (
// 					<BunItem bun={bun} type='top' isLocked={true} />
// 				) : (
// 					<div className={`${styles.empty_bun} ${styles.empty_bun_top}`}>
// 						<p className='text text_type_main-default text_color_inactive'>
// 							Перетащите булку сюда
// 						</p>
// 					</div>
// 				)}

// 				{/* Fillings */}
// 				<ul className={`${styles.fillings_list} custom-scroll`}>
// 					{fillings.length > 0 ? (
// 						fillings.map((item, index) => (
// 							<FillingItem
// 								key={item.constructorId} // Use constructorId for unique keys
// 								filling={item}
// 								index={index}
// 								moveCard={moveCard}
// 								isDraggable={true}
// 							/>
// 						))
// 					) : (
// 						<div className={`${styles.empty_fillings} pl-8`}>
// 							<p className='text text_type_main-default text_color_inactive'>
// 								Перетащите ингредиенты сюда
// 							</p>
// 						</div>
// 					)}
// 				</ul>

// 				{/* Bottom Bun */}
// 				{bun ? (
// 					<BunItem bun={bun} type='bottom' isLocked={true} />
// 				) : (
// 					<div
// 						className={`${styles.empty_bun} ${styles.empty_bun_bottom} pl-8`}>
// 						<p className='text text_type_main-default text_color_inactive'>
// 							Перетащите булку сюда
// 						</p>
// 					</div>
// 				)}

// 				{/* Drop zone indicator */}
// 				{isOver && canDrop && (
// 					<div className={styles.drop_indicator}>
// 						<p className='text text_type_main-default'>
// 							Отпустите, чтобы добавить ингредиент
// 						</p>
// 					</div>
// 				)}
// 			</div>

// 			<div className={`${styles.order_details} mt-10`}>
// 				<div className={styles.total_price}>
// 					<span className='text text_type_digits-medium'>{totalPrice}</span>
// 					<CurrencyIcon type='primary' />
// 				</div>
// 				<Button
// 					type='primary'
// 					size='large'
// 					htmlType='button'
// 					onClick={handleOrderClick}
// 					disabled={!canPlaceOrder}>
// 					{isOrderLoading ? 'Оформляем...' : 'Оформить заказ'}
// 				</Button>
// 			</div>

// 			{/* Order Modal */}
// 			{order && (
// 				<Modal onClose={handleCloseModal}>
// 					<OrderDetails
// 						orderNumber={order.order?.number || order.number}
// 						isLoading={isOrderLoading}
// 						hasError={hasOrderError}
// 					/>
// 				</Modal>
// 			)}
// 		</section>
// 	);
// };
