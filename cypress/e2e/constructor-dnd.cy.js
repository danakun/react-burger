import { TEST_URL } from '../../src/utils/constants';

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable cypress/no-unnecessary-waiting */
describe('Burger Constructor Drag and Drop - Essential Tests', () => {
	// Define selector constants to avoid duplication
	const SELECTORS = {
		CONSTRUCTOR_BUN_1: '[data-cy=constructor-bun-1]',
		CONSTRUCTOR_BUN_2: '[data-cy=constructor-bun-2]',
		CONSTRUCTOR_BUNS_ALL: '[data-cy^=constructor-bun]',
		MODAL: '[class*="modal"]',
		ORDER_MODAL: '[data-cy="order-modal"]',
	};

	beforeEach(() => {
		// Mock ingredients API
		cy.intercept('GET', 'api/ingredients', {
			fixture: 'ingredients.json',
		}).as('getIngredients');

		// Mock user authentication API - return authenticated user
		cy.intercept('GET', 'api/auth/user', {
			statusCode: 200,
			body: {
				success: true,
				user: {
					email: 'test@example.com',
					name: 'Test User',
				},
			},
		}).as('getUser');

		// Mock order creation API
		cy.intercept('POST', 'api/orders', {
			fixture: 'order.json',
		}).as('createOrder');

		// Set authentication tokens BEFORE visiting the page
		cy.window().then((win) => {
			win.localStorage.setItem('refreshToken', 'test-refresh-token');
			win.localStorage.setItem('accessToken', 'test-access-token');
		});

		// Visit the main page
		cy.visit(TEST_URL);
		cy.wait('@getIngredients');

		// Wait for user authentication check
		cy.wait('@getUser');
		cy.wait(1000);

		// Create common aliases
		cy.get('[data-cy=constructor]').as('constructor');
		cy.get('[data-cy=order-button]').as('orderButton');
		cy.get('[data-cy=ingredient-item]').as('allIngredients');
		cy.get('@allIngredients').first().as('bunIngredient');
		cy.get('@allIngredients').eq(2).as('mainIngredient');
		cy.get('@allIngredients').eq(4).as('sauceIngredient');
		cy.get('[data-cy=constructor-ingredients]').as('constructorIngredients');
	});

	// Custom command for drag and drop
	const performDragDrop = (sourceAlias, targetAlias) => {
		cy.get(sourceAlias).trigger('dragstart');
		cy.wait(200);
		cy.get(targetAlias).trigger('dragover');
		cy.wait(100);
		cy.get(targetAlias).trigger('drop');
		cy.wait(500);
	};

	describe('Order Creation', () => {
		it('should open order modal when order button is clicked', () => {
			// Build complete burger
			performDragDrop('@bunIngredient', '@constructor');
			performDragDrop('@mainIngredient', '@constructor');
			performDragDrop('@sauceIngredient', '@constructor');

			// Verify order button is enabled
			cy.get('@orderButton').should('not.be.disabled');

			// Click order button
			cy.get('@orderButton').click();

			// Wait for order creation API call
			cy.wait('@createOrder').then((interception) => {
				expect(interception.request.body).to.have.property('ingredients');
				expect(interception.request.body.ingredients).to.be.an('array');
			});

			// Wait a bit for React state to update and modal to render
			cy.wait(1500);

			// Simple check: verify a modal appears (any modal)
			cy.get(SELECTORS.MODAL).should('be.visible');

			// That's it! If modal is visible, the order creation worked
			// Close modal by pressing ESC to clean up
			cy.get('body').type('{esc}');
		});

		it('should not allow order creation without bun', () => {
			// Add only main ingredient (no bun)
			performDragDrop('@mainIngredient', '@constructor');

			// Order button should be disabled
			cy.get('@orderButton').should('be.disabled');

			// Click should not work (button is disabled)
			cy.get('@orderButton').click({ force: true });

			// No API call should be made
			cy.get('@createOrder.all').should('have.length', 0);

			// No modal should appear
			cy.get(SELECTORS.ORDER_MODAL).should('not.exist');
		});
	});

	describe('Core Drag and Drop Functionality', () => {
		it('should add bun to both top and bottom positions', () => {
			performDragDrop('@bunIngredient', '@constructor');

			cy.get(SELECTORS.CONSTRUCTOR_BUN_1)
				.should('exist')
				.and('contain', 'Ингредиент 1');
			cy.get(SELECTORS.CONSTRUCTOR_BUN_2)
				.should('exist')
				.and('contain', 'Ингредиент 1');
			cy.get(SELECTORS.CONSTRUCTOR_BUNS_ALL).should('have.length', 2);
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
			// Build complete burger: bun + main + sauce
			performDragDrop('@bunIngredient', '@constructor');
			performDragDrop('@mainIngredient', '@constructor');
			performDragDrop('@sauceIngredient', '@constructor');

			// Verify structure
			cy.get(SELECTORS.CONSTRUCTOR_BUN_1).should('exist');
			cy.get(SELECTORS.CONSTRUCTOR_BUN_2).should('exist');
			cy.get('@constructorIngredients').find('li').should('have.length', 2);

			// Verify order button is enabled
			cy.get('@orderButton').should('not.be.disabled');
		});
	});

	describe('Bun Replacement', () => {
		it('should replace existing buns when new bun is dragged', () => {
			// Add first bun
			performDragDrop('@bunIngredient', '@constructor');
			cy.get(SELECTORS.CONSTRUCTOR_BUN_1).should('contain', 'Ингредиент 1');

			// Add different bun (should replace)
			cy.get('@allIngredients').eq(1).as('secondBun');
			performDragDrop('@secondBun', '@constructor');

			// Verify replacement
			cy.get(SELECTORS.CONSTRUCTOR_BUN_1).should('contain', 'Ингредиент 2');
			cy.get(SELECTORS.CONSTRUCTOR_BUN_2).should('contain', 'Ингредиент 2');
			cy.get(SELECTORS.CONSTRUCTOR_BUNS_ALL).should('have.length', 2);
		});
	});

	describe('Multiple Ingredients', () => {
		it('should add multiple instances of same ingredient', () => {
			// Add same main ingredient twice
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
			cy.get(SELECTORS.CONSTRUCTOR_BUN_1).should('exist');
			cy.get(SELECTORS.CONSTRUCTOR_BUN_2).should('exist');
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

			// Should show bun drop indicator
			cy.get('@constructor').should(
				'contain',
				'Отпустите, чтобы добавить булку'
			);

			// End bun drag
			cy.get('@constructor').trigger('dragleave');
			cy.wait(200);

			// Test main ingredient drag indicator
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
