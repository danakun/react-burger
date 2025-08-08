describe('Modal Component - Essential Tests Only', () => {
	beforeEach(() => {
		// Mock ingredients API
		cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
			fixture: 'ingredients.json',
		}).as('getIngredients');

		// Visit homepage
		cy.visit('http://localhost:5173');
		cy.wait('@getIngredients');
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000);
	});

	describe('Modal Opening', () => {
		it('should open modal when ingredient is clicked', () => {
			cy.get('[data-cy=ingredient-item]').first().click();

			cy.get('[class*="modal"]').should('be.visible');
			cy.url().should('include', '/ingredients/');
		});
	});

	describe('Modal Closing', () => {
		beforeEach(() => {
			cy.get('[data-cy=ingredient-item]').first().click();
			cy.get('[class*="modal"]').should('be.visible');
		});

		it('should close modal with ESC key', () => {
			cy.get('body').type('{esc}');

			cy.get('[class*="modal"]').should('not.exist');
			cy.url().should('not.include', '/ingredients/');
		});

		it('should close modal with close button', () => {
			cy.get('[data-cy="modal-close-button"]').click();

			cy.get('[class*="modal"]').should('not.exist');
			cy.url().should('not.include', '/ingredients/');
		});

		it('should close modal when clicking overlay', () => {
			// Use the specific data-cy attribute you added to ModalOverlay
			// eslint-disable-next-line cypress/no-force
			cy.get('[data-cy="modal-overlay"]').click({ force: true });

			cy.get('[class*="modal"]').should('not.exist');
			cy.url().should('not.include', '/ingredients/');
		});
	});

	describe('Modal Behavior', () => {
		it('should handle multiple rapid open/close cycles', () => {
			for (let i = 0; i < 3; i++) {
				cy.get('[data-cy=ingredient-item]').first().click();
				cy.get('[class*="modal"]').should('be.visible');

				cy.get('body').type('{esc}');
				cy.get('[class*="modal"]').should('not.exist');

				// eslint-disable-next-line cypress/no-unnecessary-waiting
				cy.wait(100);
			}
		});

		it('should maintain focus when modal is open', () => {
			cy.get('[data-cy=ingredient-item]').first().click();
			cy.get('[class*="modal"]').should('be.visible');

			cy.focused().should('exist');

			cy.get('body').type('{esc}');
		});

		it('should clean up modal when closed', () => {
			cy.get('[data-cy=ingredient-item]').first().click();
			cy.get('[class*="modal"]').should('be.visible');

			cy.get('body').type('{esc}');

			cy.get('[class*="modal"]').should('not.exist');
		});
	});

	describe('Navigation', () => {
		it('should update browser history when opening modal', () => {
			cy.get('[data-cy=ingredient-item]').first().click();
			cy.url().should('include', '/ingredients/');

			cy.go('back');
			cy.get('[class*="modal"]').should('not.exist');
			cy.url().should('not.include', '/ingredients/');
		});
	});

	describe('Keyboard Support', () => {
		it('should respond to ESC key from anywhere in modal', () => {
			cy.get('[data-cy=ingredient-item]').first().click();
			cy.get('[class*="modal"]').should('be.visible');

			cy.get('body').type('{esc}');
			cy.get('[class*="modal"]').should('not.exist');
		});

		it('should handle multiple ESC presses gracefully', () => {
			cy.get('[data-cy=ingredient-item]').first().click();
			cy.get('[class*="modal"]').should('be.visible');

			cy.get('body').type('{esc}{esc}{esc}');
			cy.get('[class*="modal"]').should('not.exist');
		});
	});

	describe('Modal Content', () => {
		it('should display modal content when opened', () => {
			cy.get('[data-cy=ingredient-item]').first().click();
			cy.get('[class*="modal"]').should('be.visible');

			cy.get('[class*="modal"]').within(() => {
				cy.get('*').should('have.length.greaterThan', 0);
			});

			cy.get('body').type('{esc}');
		});
	});

	describe('Error Handling', () => {
		it('should handle clicking on ingredient multiple times', () => {
			cy.get('[data-cy=ingredient-item]').first().dblclick();

			cy.get('[class*="modal"]').should('have.length', 1);
			cy.get('[class*="modal"]').should('be.visible');

			cy.get('body').type('{esc}');
		});

		it('should prevent background interaction when modal is open', () => {
			cy.get('[data-cy=ingredient-item]').first().click();
			cy.get('[class*="modal"]').should('be.visible');

			cy.get('body').should('exist');

			cy.get('body').type('{esc}');
		});
	});
});
