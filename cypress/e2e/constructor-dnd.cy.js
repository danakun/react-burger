// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable cypress/no-unnecessary-waiting */
describe('Burger Constructor Drag and Drop', () => {
	beforeEach(() => {
		// Mock the ingredients API
		cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
			fixture: 'ingredients.json',
		}).as('getIngredients');

		// Mock user authentication
		cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
			fixture: 'user.json',
		}).as('getUser');

		// Mock order creation
		cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
			fixture: 'order.json',
		}).as('createOrder');

		// Set authentication tokens before visiting
		cy.window().then((win) => {
			win.localStorage.setItem(
				'refreshToken',
				JSON.stringify('test-refresh-token')
			);
		});
		cy.setCookie('accessToken', 'test-access-token');

		// Visit the main page
		cy.visit('http://localhost:5173');

		// Wait for ingredients to load
		cy.wait('@getIngredients');

		// Additional wait for React to fully render
		cy.wait(1000);
	});

	describe('Bun drag and drop functionality', () => {
		it('should add bun to both top and bottom positions when dragged to constructor', () => {
			// Get the first bun ingredient (assuming buns are first in the list)
			cy.get('[data-cy=ingredient-item]').first().as('bunIngredient');

			// Get the constructor drop zone
			cy.get('[data-cy=constructor]').as('constructor');

			// Perform drag and drop with waits
			cy.get('@bunIngredient').trigger('dragstart');
			cy.wait(200);

			cy.get('@constructor').trigger('dragover');
			cy.wait(100);

			cy.get('@constructor').trigger('drop');
			cy.wait(500);

			// Verify that both top and bottom buns are added
			cy.get('[data-cy=constructor-bun-1]')
				.should('exist')
				.and('contain', 'Ингредиент 1');

			cy.get('[data-cy=constructor-bun-2]')
				.should('exist')
				.and('contain', 'Ингредиент 1');

			// Verify that there are exactly 2 bun elements
			cy.get('[data-cy^=constructor-bun]').should('have.length', 2);
		});

		it('should replace existing buns when a new bun is dragged', () => {
			// Add first bun
			cy.get('[data-cy=ingredient-item]')
				.eq(0) // First bun
				.trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Verify first bun is added
			cy.get('[data-cy=constructor-bun-1]').should('contain', 'Ингредиент 1');

			// Add second bun (should replace the first)
			cy.get('[data-cy=ingredient-item]')
				.eq(1) // Second bun
				.trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Verify second bun replaced the first
			cy.get('[data-cy=constructor-bun-1]').should('contain', 'Ингредиент 2');
			cy.get('[data-cy=constructor-bun-2]').should('contain', 'Ингредиент 2');

			// Still should have exactly 2 bun elements
			cy.get('[data-cy^=constructor-bun]').should('have.length', 2);
		});
	});

	describe('Main ingredients drag and drop functionality', () => {
		it('should add main ingredient to the fillings section', () => {
			// Get a main ingredient (assuming they start from index 2)
			cy.get('[data-cy=ingredient-item]').eq(2).as('mainIngredient');

			// Perform drag and drop with waits
			cy.get('@mainIngredient').trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Verify main ingredient is added to constructor
			cy.get('[data-cy=constructor-ingredients]')
				.should('exist')
				.and('contain', 'Ингредиент 3');

			// Verify there's exactly 1 filling ingredient
			cy.get('[data-cy=constructor-ingredients]')
				.find('li')
				.should('have.length', 1);
		});

		it('should add multiple different main ingredients', () => {
			// Add first main ingredient
			cy.get('[data-cy=ingredient-item]').eq(2).trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Add second main ingredient
			cy.get('[data-cy=ingredient-item]').eq(3).trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Verify both ingredients are added
			cy.get('[data-cy=constructor-ingredients]')
				.find('li')
				.should('have.length', 2);

			cy.get('[data-cy=constructor-ingredients]')
				.should('contain', 'Ингредиент 3')
				.and('contain', 'Ингредиент 4');
		});

		it('should add multiple instances of the same main ingredient', () => {
			// Add same main ingredient twice
			cy.get('[data-cy=ingredient-item]').eq(2).trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			cy.get('[data-cy=ingredient-item]').eq(2).trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Verify both instances are added
			cy.get('[data-cy=constructor-ingredients]')
				.find('li')
				.should('have.length', 2);

			// Both should have the same name but different IDs
			cy.get('[data-cy=constructor-ingredients] li').each(($el) => {
				cy.wrap($el).should('contain', 'Ингредиент 3');
			});
		});
	});

	describe('Sauce ingredients drag and drop functionality', () => {
		it('should add sauce ingredient to the fillings section', () => {
			// Get a sauce ingredient (assuming they start from index 4)
			cy.get('[data-cy=ingredient-item]').eq(4).trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Verify sauce is added to constructor
			cy.get('[data-cy=constructor-ingredients]')
				.should('exist')
				.and('contain', 'Ингредиент 5');
		});

		it('should add multiple different sauce ingredients', () => {
			// Add first sauce
			cy.get('[data-cy=ingredient-item]').eq(4).trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Add second sauce
			cy.get('[data-cy=ingredient-item]').eq(5).trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Verify both sauces are added
			cy.get('[data-cy=constructor-ingredients]')
				.find('li')
				.should('have.length', 2);
		});
	});

	describe('Mixed ingredients drag and drop', () => {
		it('should create a complete burger with bun, main, and sauce', () => {
			// Add bun (first item)
			cy.get('[data-cy=ingredient-item]').first().trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Add main ingredient (third item)
			cy.get('[data-cy=ingredient-item]').eq(2).trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Add sauce (fifth item)
			cy.get('[data-cy=ingredient-item]').eq(4).trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Verify complete burger structure
			cy.get('[data-cy=constructor-bun-1]').should('exist');
			cy.get('[data-cy=constructor-bun-2]').should('exist');
			cy.get('[data-cy=constructor-ingredients]')
				.find('li')
				.should('have.length', 2);

			// Verify burger can be ordered (button should be enabled)
			cy.get('[data-cy=order-button]').should('not.be.disabled');
		});

		it('should build a complex burger with multiple fillings', () => {
			// Add bun (first item)
			cy.get('[data-cy=ingredient-item]').first().trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Add multiple main ingredients
			for (let i = 0; i < 3; i++) {
				cy.get('[data-cy=ingredient-item]')
					.eq(2) // Main ingredient
					.trigger('dragstart');
				cy.wait(200);

				cy.get('[data-cy=constructor]').trigger('dragover');
				cy.wait(100);

				cy.get('[data-cy=constructor]').trigger('drop');
				cy.wait(500);
			}

			// Add multiple sauces
			for (let i = 0; i < 2; i++) {
				cy.get('[data-cy=ingredient-item]')
					.eq(4) // Sauce ingredient
					.trigger('dragstart');
				cy.wait(200);

				cy.get('[data-cy=constructor]').trigger('dragover');
				cy.wait(100);

				cy.get('[data-cy=constructor]').trigger('drop');
				cy.wait(500);
			}

			// Verify complex burger structure
			cy.get('[data-cy=constructor-bun-1]').should('exist');
			cy.get('[data-cy=constructor-bun-2]').should('exist');
			cy.get('[data-cy=constructor-ingredients]')
				.find('li')
				.should('have.length', 5); // 3 mains + 2 sauces
		});
	});

	describe('Drag and drop visual feedback', () => {
		it('should show different indicators for different ingredient types', () => {
			// Test bun drag indicator
			cy.get('[data-cy=ingredient-item]').first().trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(300);

			// Should show bun drop indicator
			cy.get('[data-cy=constructor]').should(
				'contain',
				'Отпустите, чтобы добавить булку'
			);

			// End drag
			cy.get('[data-cy=constructor]').trigger('dragleave');
			cy.wait(200);

			// Test main ingredient drag indicator
			cy.get('[data-cy=ingredient-item]').eq(2).trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(300);

			// Should show ingredient drop indicator
			cy.get('[data-cy=constructor]').should(
				'contain',
				'Отпустите, чтобы добавить ингредиент'
			);
		});
	});

	describe('Error handling and edge cases', () => {
		it('should handle dropping ingredients when constructor is empty', () => {
			// Try to add main ingredient without bun
			cy.get('[data-cy=ingredient-item]').eq(2).trigger('dragstart');
			cy.wait(200);

			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);

			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Should still add the ingredient
			cy.get('[data-cy=constructor-ingredients]')
				.should('exist')
				.and('contain', 'Ингредиент 3');

			// Order button should be disabled (no bun)
			cy.get('[data-cy=order-button]').should('be.disabled');
		});

		it('should maintain correct order when adding multiple ingredients', () => {
			// Add ingredients in specific order: main, sauce, main
			cy.get('[data-cy=ingredient-item]').eq(2).trigger('dragstart'); // main
			cy.wait(200);
			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);
			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			cy.get('[data-cy=ingredient-item]').eq(4).trigger('dragstart'); // sauce
			cy.wait(200);
			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);
			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			cy.get('[data-cy=ingredient-item]').eq(2).trigger('dragstart'); // main again
			cy.wait(200);
			cy.get('[data-cy=constructor]').trigger('dragover');
			cy.wait(100);
			cy.get('[data-cy=constructor]').trigger('drop');
			cy.wait(500);

			// Verify order is maintained in the DOM
			cy.get('[data-cy=constructor-ingredients] li')
				.should('have.length', 3)
				.first()
				.should('contain', 'Ингредиент 3'); // First main ingredient
		});
	});
});
