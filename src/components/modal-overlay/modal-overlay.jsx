import React from 'react';
import * as PropTypes from 'prop-types';
import styles from './modal-overlay.module.css';

export const ModalOverlay = ({ onClick }) => {
	return (
		<div
			className={styles.overlay}
			onClick={onClick}
			role='presentation'
			onKeyDown={onClick}></div>
	);
};

ModalOverlay.propTypes = {
	onClick: PropTypes.func.isRequired,
};
