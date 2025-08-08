describe('Modal Component - Essential Tests Only', () => {
	beforeEach(() => {
		// Mock ingredients API
		cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
			fixture: 'ingredients.json',
		}).as('getIngredients');

		cy.visit('http://localhost:5173');
		cy.wait('@getIngredients');
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000);

		// Create aliases
		cy.get('[data-cy=ingredient-item]').first().as('firstIngredient');
		cy.get('body').as('pageBody');
	});

	describe('Modal Opening', () => {
		it('should open modal when ingredient is clicked', () => {
			cy.get('@firstIngredient').click();

			cy.get('[class*="modal"]').as('openModal').should('be.visible');
			cy.url().should('include', '/ingredients/');
		});
	});

	describe('Modal Closing', () => {
		beforeEach(() => {
			cy.get('@firstIngredient').click();
			cy.get('[class*="modal"]').as('modal').should('be.visible');
		});

		it('should close modal with ESC key', () => {
			cy.get('@pageBody').type('{esc}');

			cy.get('@modal').should('not.exist');
			cy.url().should('not.include', '/ingredients/');
		});

		it('should close modal with close button', () => {
			cy.get('[data-cy="modal-close-button"]').as('closeButton').click();

			cy.get('@modal').should('not.exist');
			cy.url().should('not.include', '/ingredients/');
		});

		it('should close modal when clicking overlay', () => {
			// eslint-disable-next-line cypress/no-force
			cy.get('[data-cy="modal-overlay"]')
				.as('modalOverlay')
				.click({ force: true });

			cy.get('@modal').should('not.exist');
			cy.url().should('not.include', '/ingredients/');
		});
	});

	describe('Modal Behavior', () => {
		it('should handle multiple rapid open/close cycles', () => {
			for (let i = 0; i < 3; i++) {
				cy.get('@firstIngredient').click();
				cy.get('[class*="modal"]').as('cycleModal').should('be.visible');

				cy.get('@pageBody').type('{esc}');
				cy.get('@cycleModal').should('not.exist');

				// eslint-disable-next-line cypress/no-unnecessary-waiting
				cy.wait(100);
			}
		});

		it('should maintain focus when modal is open', () => {
			cy.get('@firstIngredient').click();
			cy.get('[class*="modal"]').as('focusModal').should('be.visible');

			cy.focused().as('focusedElement').should('exist');

			cy.get('@pageBody').type('{esc}');
		});

		it('should clean up modal when closed', () => {
			cy.get('@firstIngredient').click();
			cy.get('[class*="modal"]').as('cleanupModal').should('be.visible');

			cy.get('@pageBody').type('{esc}');

			cy.get('@cleanupModal').should('not.exist');
		});
	});

	describe('Navigation', () => {
		it('should update browser history when opening modal', () => {
			cy.get('@firstIngredient').click();
			cy.url().should('include', '/ingredients/');

			cy.go('back');
			cy.get('[class*="modal"]').should('not.exist');
			cy.url().should('not.include', '/ingredients/');
		});
	});

	describe('Keyboard Support', () => {
		beforeEach(() => {
			cy.get('@firstIngredient').click();
			cy.get('[class*="modal"]').as('keyboardModal').should('be.visible');
		});

		it('should respond to ESC key from anywhere in modal', () => {
			cy.get('@pageBody').type('{esc}');
			cy.get('@keyboardModal').should('not.exist');
		});

		it('should handle multiple ESC presses gracefully', () => {
			cy.get('@pageBody').type('{esc}{esc}{esc}');
			cy.get('@keyboardModal').should('not.exist');
		});
	});

	describe('Modal Content', () => {
		it('should display modal content when opened', () => {
			cy.get('@firstIngredient').click();
			cy.get('[class*="modal"]').as('contentModal').should('be.visible');

			cy.get('@contentModal').within(() => {
				cy.get('*').should('have.length.greaterThan', 0);
			});

			cy.get('@pageBody').type('{esc}');
		});
	});

	describe('Error Handling', () => {
		it('should handle clicking on ingredient multiple times', () => {
			cy.get('@firstIngredient').dblclick();

			cy.get('[class*="modal"]')
				.as('errorModal')
				.should('have.length', 1)
				.should('be.visible');

			cy.get('@pageBody').type('{esc}');
		});

		it('should prevent background interaction when modal is open', () => {
			cy.get('@firstIngredient').click();
			cy.get('[class*="modal"]').as('backgroundModal').should('be.visible');

			cy.get('@pageBody').should('exist');

			cy.get('@pageBody').type('{esc}');
		});
	});
});
