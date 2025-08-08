// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable cypress/no-unnecessary-waiting */
describe('Burger Constructor Drag and Drop - Essential Tests', () => {
	beforeEach(() => {
		// Mock ingredients API
		cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
			fixture: 'ingredients.json',
		}).as('getIngredients');

		cy.visit('http://localhost:5173');
		cy.wait('@getIngredients');
		cy.wait(1000);

		// Create aliases
		cy.get('[data-cy=constructor]').as('constructor');
		cy.get('[data-cy=order-button]').as('orderButton');
		cy.get('[data-cy=ingredient-item]').as('allIngredients');
		cy.get('@allIngredients').first().as('bunIngredient');
		cy.get('@allIngredients').eq(2).as('mainIngredient');
		cy.get('@allIngredients').eq(4).as('sauceIngredient');
		cy.get('[data-cy=constructor-ingredients]').as('constructorIngredients');
	});

	// and drop
	const performDragDrop = (sourceAlias, targetAlias) => {
		cy.get(sourceAlias).trigger('dragstart');
		cy.wait(200);
		cy.get(targetAlias).trigger('dragover');
		cy.wait(100);
		cy.get(targetAlias).trigger('drop');
		cy.wait(500);
	};

	describe('Core Drag and Drop Functionality', () => {
		it('should add bun to both top and bottom positions', () => {
			performDragDrop('@bunIngredient', '@constructor');

			cy.get('[data-cy=constructor-bun-1]')
				.should('exist')
				.and('contain', 'Ингредиент 1');
			cy.get('[data-cy=constructor-bun-2]')
				.should('exist')
				.and('contain', 'Ингредиент 1');
			cy.get('[data-cy^=constructor-bun]').should('have.length', 2);
		});

		it('should add main ingredient to fillings section', () => {
			performDragDrop('@mainIngredient', '@constructor');

			cy.get('@constructorIngredients')
				.should('exist')
				.and('contain', 'Ингредиент 3')
				.find('li')
				.should('have.length', 1);
		});

		it('should add sauce ingredient to fillings section', () => {
			performDragDrop('@sauceIngredient', '@constructor');

			cy.get('@constructorIngredients')
				.should('exist')
				.and('contain', 'Ингредиент 5');
		});

		it('should create complete burger and enable order button', () => {
			performDragDrop('@bunIngredient', '@constructor');
			performDragDrop('@mainIngredient', '@constructor');
			performDragDrop('@sauceIngredient', '@constructor');

			cy.get('[data-cy=constructor-bun-1]').should('exist');
			cy.get('[data-cy=constructor-bun-2]').should('exist');
			cy.get('@constructorIngredients').find('li').should('have.length', 2);

			cy.get('@orderButton').should('not.be.disabled');
		});
	});

	describe('Bun Replacement', () => {
		it('should replace existing buns when new bun is dragged', () => {
			// Add first bun
			performDragDrop('@bunIngredient', '@constructor');
			cy.get('[data-cy=constructor-bun-1]').should('contain', 'Ингредиент 1');

			// Add different bun
			cy.get('@allIngredients').eq(1).as('secondBun');
			performDragDrop('@secondBun', '@constructor');

			// Verify
			cy.get('[data-cy=constructor-bun-1]').should('contain', 'Ингредиент 2');
			cy.get('[data-cy=constructor-bun-2]').should('contain', 'Ингредиент 2');
			cy.get('[data-cy^=constructor-bun]').should('have.length', 2);
		});
	});

	describe('Multiple Ingredients', () => {
		it('should add multiple instances of same ingredient', () => {
			performDragDrop('@mainIngredient', '@constructor');
			performDragDrop('@mainIngredient', '@constructor');

			cy.get('@constructorIngredients')
				.find('li')
				.should('have.length', 2)
				.each(($el) => {
					cy.wrap($el).should('contain', 'Ингредиент 3');
				});
		});

		it('should handle complex burger with multiple fillings', () => {
			// Add bun + 3 mains + 2 sauces
			performDragDrop('@bunIngredient', '@constructor');

			for (let i = 0; i < 3; i++) {
				performDragDrop('@mainIngredient', '@constructor');
			}

			for (let i = 0; i < 2; i++) {
				performDragDrop('@sauceIngredient', '@constructor');
			}

			// Verify structure
			cy.get('[data-cy=constructor-bun-1]').should('exist');
			cy.get('[data-cy=constructor-bun-2]').should('exist');
			cy.get('@constructorIngredients').find('li').should('have.length', 5);
		});
	});

	describe('Visual Feedback', () => {
		it('should show different drop indicators for different ingredient types', () => {
			// Test bun drag indicator
			cy.get('@bunIngredient').trigger('dragstart');
			cy.wait(200);
			cy.get('@constructor').trigger('dragover');
			cy.wait(300);

			cy.get('@constructor').should(
				'contain',
				'Отпустите, чтобы добавить булку'
			);

			// End bun drag
			cy.get('@constructor').trigger('dragleave');
			cy.wait(200);

			cy.get('@mainIngredient').trigger('dragstart');
			cy.wait(200);
			cy.get('@constructor').trigger('dragover');
			cy.wait(300);

			// Should show ingredient drop indicator
			cy.get('@constructor').should(
				'contain',
				'Отпустите, чтобы добавить ингредиент'
			);

			// End main ingredient drag
			cy.get('@constructor').trigger('dragleave');
			cy.wait(200);
		});
	});

	describe('Edge Cases', () => {
		it('should handle ingredients without bun and disable order button', () => {
			// Add main ingredient without bun
			performDragDrop('@mainIngredient', '@constructor');

			cy.get('@constructorIngredients')
				.should('exist')
				.and('contain', 'Ингредиент 3');
			cy.get('@orderButton').should('be.disabled');
		});

		it('should maintain ingredient order when adding multiple types', () => {
			// Add in specific order: main, sauce, main
			performDragDrop('@mainIngredient', '@constructor');
			performDragDrop('@sauceIngredient', '@constructor');
			performDragDrop('@mainIngredient', '@constructor');

			cy.get('@constructorIngredients')
				.find('li')
				.should('have.length', 3)
				.first()
				.should('contain', 'Ингредиент 3');
		});
	});
});
