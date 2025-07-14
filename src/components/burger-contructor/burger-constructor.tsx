import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from '../../services/store';
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
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserData } from '../../services/userSlice';
import { TConstructorIngredient, TIngredientData } from '@/utils/types';

type DragObject = {
	ingredient: TIngredientData;
};

type DropCollectedProps = {
	canDrop: boolean;
	isOver: boolean;
	draggedItemType: string;
};

export const BurgerConstructor = (): React.JSX.Element => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const user = useSelector(getUserData);

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
	const [{ canDrop, isOver, draggedItemType }, dropRef] = useDrop<
		DragObject,
		unknown,
		DropCollectedProps
	>({
		accept: DND_TYPES.INGREDIENT,
		drop: (draggedItem: DragObject) => {
			const { ingredient } = draggedItem;
			if (ingredient) {
				dispatch(addIngredient(ingredient));
			}
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
			draggedItemType: monitor.getItem()?.ingredient?.type || '',
		}),
	});

	// move ingredient
	const moveCard = useCallback(
		(dragIndex: number, hoverIndex: number): void => {
			if (dragIndex >= 0 && hoverIndex >= 0 && dragIndex !== hoverIndex) {
				dispatch(moveIngredient({ dragIndex, hoverIndex }));
			}
		},
		[dispatch]
	);

	// total price
	const totalPrice = useMemo((): number => {
		let price = 0;

		// 2 buns
		if (bun?.price) {
			price += bun.price * 2;
		}

		// all fillings
		fillings.forEach((item: TConstructorIngredient) => {
			if (item?.price) {
				price += item.price;
			}
		});

		return price;
	}, [bun, fillings]);

	const canPlaceOrder = useMemo((): boolean => {
		return Boolean(bun && fillings.length > 0 && !isOrderLoading);
	}, [bun, fillings.length, isOrderLoading]);

	const handleOrderClick = useCallback(async (): Promise<void> => {
		if (!canPlaceOrder) return;

		// Check if user is authenticated
		if (!user) {
			// Redirect to login page with current location
			navigate('/login', { state: { from: location } });
			return;
		}

		try {
			const ingredientIds: Array<string> = [
				bun!._id, // Top bun
				...fillings.map((item: TConstructorIngredient) => item._id), // fillings
				bun!._id, // Bottom bun
			];

			console.log('Dispatching order with ingredients:', ingredientIds); // Debug log

			// Dispatch thunk - now properly typed
			const resultAction = await dispatch(createOrder(ingredientIds));

			console.log('Order result action:', resultAction); // Debug log

			// If success clear
			if (createOrder.fulfilled.match(resultAction)) {
				console.log('Order successful, clearing constructor'); // Debug log
				dispatch(clearConstructor());
			} else {
				console.log('Order failed:', resultAction); // Debug log
			}
		} catch (error) {
			console.error('Failed to create order:', error);
		}
	}, [dispatch, bun, fillings, canPlaceOrder, user, navigate, location]);

	const handleCloseModal = useCallback((): void => {
		dispatch(clearOrder());
	}, [dispatch]);

	const showBunDropIndicator: boolean =
		isOver && canDrop && draggedItemType === 'bun';

	const showFillingDropIndicator: boolean =
		isOver && canDrop && draggedItemType !== 'bun' && Boolean(draggedItemType);

	const getBunSlotClass = useCallback(
		(baseClass: string, additionalClasses: string = ''): string => {
			return `${baseClass} ${additionalClasses} ${
				showBunDropIndicator ? styles.drop_indicator : ''
			}`.trim();
		},
		[showBunDropIndicator]
	);

	const getFillingSlotClass = useCallback(
		(baseClass: string, additionalClasses: string = ''): string => {
			return `${baseClass} ${additionalClasses} ${
				showFillingDropIndicator ? styles.drop_indicator : ''
			}`.trim();
		},
		[showFillingDropIndicator]
	);

	const getBunDropZoneText = (
		defaultText: string,
		dropText: string
	): string => {
		return showBunDropIndicator ? dropText : defaultText;
	};

	const getFillingDropZoneText = (
		defaultText: string,
		dropText: string
	): string => {
		return showFillingDropIndicator ? dropText : defaultText;
	};

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
						fillings.map((item: TConstructorIngredient, index: number) => (
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

				{/* Error message if order failed */}
				{hasOrderError && orderError && (
					<p className='text text_type_main-default text_color_error mt-2'>
						Ошибка при создании заказа: {orderError}
					</p>
				)}
			</div>

			{order && (
				<>
					{console.log('=== ORDER DEBUG ===')}
					{console.log('Full order object:', order)}
					{console.log('Order keys:', Object.keys(order))}
					{console.log('Order.number:', order.number)}
					{console.log('Order._id:', order._id)}
					{console.log('=== END DEBUG ===')}
					<Modal onClose={handleCloseModal}>
						<OrderDetails
							orderNumber={order.number}
							isLoading={isOrderLoading}
							hasError={hasOrderError}
						/>
					</Modal>
				</>
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
// // @ts-expect-error "Ignore"
// import { createOrder, clearOrder } from '../../services/orderSlice';
// import {
// 	addIngredient,
// 	moveIngredient,
// 	clearConstructor,
// 	// @ts-expect-error "Ignore"
// } from '../../services/constructorSlice';
// import { DND_TYPES } from '../../utils/constants';
// import { useNavigate, useLocation } from 'react-router-dom';
// // @ts-expect-error "Ignore"
// import { getUserData } from '../../services/userSlice';
// import { TConstructorIngredient, TIngredientData } from '@/utils/types';

// type DragObject = {
// 	ingredient: TIngredientData;
// };

// type DropCollectedProps = {
// 	canDrop: boolean;
// 	isOver: boolean;
// 	draggedItemType: string;
// };

// export const BurgerConstructor = (): React.JSX.Element => {
// 	const dispatch = useDispatch();
// 	const navigate = useNavigate();
// 	const location = useLocation();
// 	const user = useSelector(getUserData);

// 	// Get constructor ingredients from Redux state
// 	const { bun, ingredients: fillings } = useSelector(
// 		// @ts-expect-error "Ignore"
// 		(state) => state.burgerConstructor
// 	);

// 	// Get order state from Redux
// 	const {
// 		order,
// 		isLoading: isOrderLoading,
// 		hasError: hasOrderError,
// 		error: orderError,
// 		// @ts-expect-error "Ignore"
// 	} = useSelector((state) => state.order);

// 	// Handle dropping ingredients from BurgerIngredients
// 	const [{ canDrop, isOver, draggedItemType }, dropRef] = useDrop<
// 		DragObject,
// 		unknown,
// 		DropCollectedProps
// 	>({
// 		accept: DND_TYPES.INGREDIENT,
// 		drop: (draggedItem: DragObject) => {
// 			const { ingredient } = draggedItem;
// 			if (ingredient) {
// 				dispatch(addIngredient(ingredient));
// 			}
// 		},
// 		collect: (monitor) => ({
// 			isOver: monitor.isOver(),
// 			canDrop: monitor.canDrop(),
// 			draggedItemType: monitor.getItem()?.ingredient?.type || '',
// 		}),
// 	});

// 	// move ingredient
// 	const moveCard = useCallback(
// 		(dragIndex: number, hoverIndex: number): void => {
// 			if (dragIndex >= 0 && hoverIndex >= 0 && dragIndex !== hoverIndex) {
// 				dispatch(moveIngredient({ dragIndex, hoverIndex }));
// 			}
// 		},
// 		[dispatch]
// 	);

// 	// total price
// 	const totalPrice = useMemo((): number => {
// 		let price = 0;

// 		// 2 buns
// 		if (bun?.price) {
// 			price += bun.price * 2;
// 		}

// 		// all fillings
// 		fillings.forEach((item: TConstructorIngredient) => {
// 			if (item?.price) {
// 				price += item.price;
// 			}
// 		});

// 		return price;
// 	}, [bun, fillings]);

// 	const canPlaceOrder = useMemo((): boolean => {
// 		return Boolean(bun && fillings.length > 0 && !isOrderLoading);
// 	}, [bun, fillings.length, isOrderLoading]);

// 	const handleOrderClick = useCallback(async (): Promise<void> => {
// 		if (!canPlaceOrder) return;

// 		// Check if user is authenticated
// 		if (!user) {
// 			// Redirect to login page with current location
// 			navigate('/login', { state: { from: location } });
// 			return;
// 		}

// 		try {
// 			const ingredientIds: Array<string> = [
// 				bun!._id, // Top bun
// 				...fillings.map((item: TConstructorIngredient) => item._id), // fillings
// 				bun!._id, // Bottom bun
// 			];
// 			// dispath thunk
// 			const resultAction = await dispatch(createOrder(ingredientIds));

// 			// If success clear
// 			if (createOrder.fulfilled.match(resultAction)) {
// 				dispatch(clearConstructor());
// 			}
// 		} catch (error) {
// 			console.error('Failed to create order:', error);
// 		}
// 	}, [dispatch, bun, fillings, canPlaceOrder, user, navigate, location]);

// 	const handleCloseModal = useCallback((): void => {
// 		dispatch(clearOrder());
// 	}, [dispatch]);

// 	const showBunDropIndicator: boolean =
// 		isOver && canDrop && draggedItemType === 'bun';

// 	const showFillingDropIndicator: boolean =
// 		isOver && canDrop && draggedItemType !== 'bun' && Boolean(draggedItemType);

// 	const getBunSlotClass = useCallback(
// 		(baseClass: string, additionalClasses: string = ''): string => {
// 			return `${baseClass} ${additionalClasses} ${
// 				showBunDropIndicator ? styles.drop_indicator : ''
// 			}`.trim();
// 		},
// 		[showBunDropIndicator]
// 	);

// 	const getFillingSlotClass = useCallback(
// 		(baseClass: string, additionalClasses: string = ''): string => {
// 			return `${baseClass} ${additionalClasses} ${
// 				showFillingDropIndicator ? styles.drop_indicator : ''
// 			}`.trim();
// 		},
// 		[showFillingDropIndicator]
// 	);

// 	const getBunDropZoneText = (
// 		defaultText: string,
// 		dropText: string
// 	): string => {
// 		return showBunDropIndicator ? dropText : defaultText;
// 	};

// 	const getFillingDropZoneText = (
// 		defaultText: string,
// 		dropText: string
// 	): string => {
// 		return showFillingDropIndicator ? dropText : defaultText;
// 	};

// 	return (
// 		<section className={styles.burger_constructor}>
// 			<div ref={dropRef} className={styles.burger_components}>
// 				{/* Top Bun */}
// 				{bun ? (
// 					<BunItem bun={bun} type='top' isLocked={true} />
// 				) : (
// 					<div
// 						className={getBunSlotClass(styles.empty_bun, styles.empty_bun_top)}>
// 						<p className='text text_type_main-default text_color_inactive'>
// 							{getBunDropZoneText(
// 								'Перетащите булку сюда',
// 								'Отпустите, чтобы добавить булку'
// 							)}
// 						</p>
// 					</div>
// 				)}

// 				{/* Fillings */}
// 				<ul className={`${styles.fillings_list} custom-scroll`}>
// 					{fillings.length > 0 ? (
// 						fillings.map((item: TConstructorIngredient, index: number) => (
// 							<FillingItem
// 								key={item.ingredientId}
// 								filling={item}
// 								index={index}
// 								moveCard={moveCard}
// 								isDraggable={true}
// 							/>
// 						))
// 					) : (
// 						<div className={getFillingSlotClass(styles.empty_fillings, 'pl-8')}>
// 							<p className='text text_type_main-default text_color_inactive'>
// 								{getFillingDropZoneText(
// 									'Перетащите ингредиенты сюда',
// 									'Отпустите, чтобы добавить ингредиент'
// 								)}
// 							</p>
// 						</div>
// 					)}
// 				</ul>

// 				{/* Bottom Bun */}
// 				{bun ? (
// 					<BunItem bun={bun} type='bottom' isLocked={true} />
// 				) : (
// 					<div
// 						className={getBunSlotClass(
// 							styles.empty_bun,
// 							`${styles.empty_bun_bottom} pl-8`
// 						)}>
// 						<p className='text text_type_main-default text_color_inactive'>
// 							{getBunDropZoneText(
// 								'Перетащите булку сюда',
// 								'Отпустите, чтобы добавить булку'
// 							)}
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

// 				{/* Error message if order failed */}
// 				{hasOrderError && orderError && (
// 					<p className='text text_type_main-default text_color_error mt-2'>
// 						Ошибка при создании заказа: {orderError}
// 					</p>
// 				)}
// 			</div>

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
