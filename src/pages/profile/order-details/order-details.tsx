import React from 'react';
import { useParams } from 'react-router-dom';

export const OrderDetails = (): React.JSX.Element => {
	const { number } = useParams();

	return (
		<div>
			<h2 className='text text_type_main-large'>Заказ #{number}</h2>
			<p className='text text_type_main-default mt-8'>
				Страница заказа будет реализована в следующем спринте
			</p>
		</div>
	);
};
