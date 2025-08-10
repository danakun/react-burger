import React from 'react';
import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
	onClick: () => void;
};

export const ModalOverlay = ({
	onClick,
}: ModalOverlayProps): React.JSX.Element => {
	return (
		<div
			data-cy='modal-overlay'
			className={styles.overlay}
			onClick={onClick}
			role='presentation'
			onKeyDown={onClick}></div>
	);
};
