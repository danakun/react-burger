import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { string, node, func } from 'prop-types';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { ModalOverlay } from '../modal-overlay/modal-overlay';
import styles from './modal.module.css';

// make modal container if necessary
const getModalRoot = () => {
	let modalRoot = document.getElementById('modals');
	if (!modalRoot) {
		modalRoot = document.createElement('div');
		modalRoot.setAttribute('id', 'modals');
		document.body.appendChild(modalRoot);
	}
	return modalRoot;
};

export const Modal = ({ children, title, onClose }) => {
	// handle ESC
	useEffect(() => {
		const handleEscClose = (e) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleEscClose);

		return () => {
			document.removeEventListener('keydown', handleEscClose);
		};
	}, [onClose]);

	return createPortal(
		<>
			<ModalOverlay onClick={onClose} />
			<div className={styles.modal}>
				<div className={styles.header}>
					{title && <h2 className='text text_type_main-large'>{title}</h2>}
					<button className={styles.closeButton} onClick={onClose}>
						<CloseIcon type='primary' />
					</button>
				</div>
				<div className={styles.content}>{children}</div>
			</div>
		</>,
		getModalRoot()
	);
};

Modal.propTypes = {
	children: node.isRequired,
	title: string,
	onClose: func.isRequired,
};
